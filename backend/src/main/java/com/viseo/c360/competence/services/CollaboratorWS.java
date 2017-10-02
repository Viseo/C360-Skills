package com.viseo.c360.competence.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.GetResponse;
import com.viseo.c360.competence.amqp.DisconnectionMessage;
import com.viseo.c360.competence.amqp.MessageType;
import com.viseo.c360.competence.amqp.ConnectionMessage;
import com.viseo.c360.competence.amqp.RabbitMsg;
import com.viseo.c360.competence.converters.collaborator.*;
import com.viseo.c360.competence.dao.CollaboratorDAO;
import com.viseo.c360.competence.dao.ExpertiseDAO;
import com.viseo.c360.competence.domain.collaborator.Collaborator;
import com.viseo.c360.competence.domain.collaborator.Expertise;
import com.viseo.c360.competence.dto.collaborator.CollaboratorDescription;
import com.viseo.c360.competence.dto.collaborator.CollaboratorIdentity;
import com.viseo.c360.competence.dto.collaborator.ExpertiseDescription;
import com.viseo.c360.competence.email.sendMessage;
import com.viseo.c360.competence.exceptions.C360Exception;
import com.viseo.c360.competence.exceptions.dao.PersistentObjectNotFoundException;
import com.viseo.c360.competence.exceptions.dao.UniqueFieldException;
import com.viseo.c360.competence.exceptions.dao.util.ExceptionUtil;
import com.viseo.c360.competence.exceptions.dao.util.UniqueFieldErrors;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.impl.crypto.MacProvider;
import org.json.simple.parser.ParseException;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.ChannelCallback;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.core.convert.ConversionException;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.mail.MessagingException;
import javax.persistence.PersistenceException;
import java.io.IOException;
import java.security.Key;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

import static io.jsonwebtoken.impl.crypto.MacProvider.generateKey;
import static org.apache.commons.lang3.StringUtils.isEmpty;

//import com.viseo.c360.competence.amqp.RequestProducerConfig;

@RestController
public class CollaboratorWS {

    @Inject
    CollaboratorDAO collaboratorDAO;

    @Inject
    ExceptionUtil exceptionUtil;

    @Inject
    ExpertiseDAO expertiseDAO;

    @Inject
    RabbitTemplate rabbitTemplate;

    @Inject
    FanoutExchange fanout;

    @Inject
    Queue responseFormation;

    @Inject
    Queue responseCompetence;

    String compactJws;
    private boolean compteExisteInOtherApp = false;

    private String createSecurityToken(CollaboratorDescription user){
        return Jwts.builder()
                .setSubject(user.getFirstName())
                .claim("lastName", user.getLastName())
                .claim("roles", user.getIsAdmin())
                .claim("id", user.getId())
                .signWith(SignatureAlgorithm.HS512, generateKey())
                .compact();
    }

    public CollaboratorDescription checkIfAlreadyConnected(RabbitMsg msg) {
        try {
            CollaboratorDescription user = null;
            if (msg.getType() == MessageType.CONNECTION) {
                ConnectionMessage message = (ConnectionMessage) msg;
                user = mapUserCache.get(message.getToken());
                if (user != null) {
                    ConnectionMessage response = new ConnectionMessage().setNameFileResponse(message.getNameFileResponse())
                            .setCollaboratorDescription(user)
                            .setMessageDate(new Date())
                            .setSequence(message.getSequence());
                    ObjectMapper mapper = new ObjectMapper();
                    rabbitTemplate.convertAndSend(message.getNameFileResponse(), mapper.writeValueAsString(response));
                }
            } else if (msg.getType() == MessageType.DISCONNECTION) {
                String token = null;
                DisconnectionMessage message = (DisconnectionMessage) msg;
                System.out.println("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA : " + message.getCollaboratorDescription());
                if(!message.getNameFileResponse().equals(this.responseCompetence.getName())){
                    CollaboratorDescription collaborator = message.getCollaboratorDescription();
                    for (String t : mapUserCache.keySet()){
                        if (mapUserCache.get(t).getEmail().equals(collaborator.getEmail())){
                            token = t;
                            System.out.println("Reomving token : " + token);
                            mapUserCache.remove(token);
                            compactJws = null;
                            break;
                        }
                    }
                }
            }
            return user;
        } catch (Exception e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @RequestMapping(value = "${endpoint.getuserifalreadyconnectedelsewhere}", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, String> getUserIfAlreadyConnectedElseWhere(@RequestBody String theToken){
        try {
            ConnectionMessage request = new ConnectionMessage();
            UUID personalMessageSequence = UUID.randomUUID();
            request.setSequence(personalMessageSequence)
                    .setToken(theToken.substring(0, theToken.length() - 1))
                    .setMessageDate(new Date())
                    .setNameFileResponse(responseCompetence.getName());
            ObjectMapper mapper = new ObjectMapper();
            rabbitTemplate.convertAndSend(fanout.getName(),"",mapper.writeValueAsString(request));
            ConnectionMessage connectedUser = this.rabbitTemplate.execute(new ChannelCallback<ConnectionMessage>() {

                @Override
                public ConnectionMessage doInRabbit(final Channel channel) throws Exception {
                    long startTime = System.currentTimeMillis();
                    long elapsedTime = 0;
                    ConnectionMessage mostRecentConsumerResponse = null;
                    GetResponse consumerResponse;
                    long deliveryTag;
                    sleep();
                    do {
                        elapsedTime = (new Date()).getTime() - startTime;
                        consumerResponse = channel.basicGet(responseCompetence.getName(), false);
                        if (consumerResponse != null) {
                            deliveryTag = consumerResponse.getEnvelope().getDeliveryTag();
                            ConnectionMessage rabbitMessageResponse = new ObjectMapper().readValue(consumerResponse.getBody(), ConnectionMessage.class);
                            channel.basicAck(deliveryTag, true);
                                if (rabbitMessageResponse.getSequence().equals(personalMessageSequence)) {
                                    if (mostRecentConsumerResponse == null ||
                                            rabbitMessageResponse.getCollaboratorDescription().getLastUpdateDate()
                                                    .after(mostRecentConsumerResponse.getCollaboratorDescription().getLastUpdateDate())) {
                                        mostRecentConsumerResponse = rabbitMessageResponse;
                                    }
                                } else {
                                    channel.basicPublish("", responseCompetence.getName(), null, consumerResponse.getBody());
                                }

                        }
                    } while (consumerResponse != null && elapsedTime < 2000);


                    return mostRecentConsumerResponse;
                }
            });
            return this.getUserByLoginPassword(connectedUser.getCollaboratorDescription());

        } catch (Exception e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }


    @CrossOrigin
    @RequestMapping(value = "${endpoint.user}", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, String> getUserByLoginPassword(@RequestBody CollaboratorDescription myCollaboratorDescription) {
        CollaboratorDescription externalDescription = checkIfCollaboratorExistElsewhere(myCollaboratorDescription);
        CollaboratorDescription user = handleReceivedCollaborator(myCollaboratorDescription,externalDescription);
        compactJws = createSecurityToken(user);
        this.putUserInCache(compactJws, user);
        Map<String, String> currentUserMap = new HashMap<>();
        currentUserMap.put("userConnected", compactJws);
        return currentUserMap;
    }



    void sleep() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
        }
    }

    public CollaboratorDescription connectUserInMicroservicesFunction(Long collab_id) {
        try {
            ObjectMapper mapperObj = new ObjectMapper();

            CollaboratorDescription user = new CollaboratorToDescription().convert(collaboratorDAO.getCollaboratorById(collab_id));
            UUID personalMessageSequence = UUID.randomUUID();
            ConnectionMessage connectionMessage = new ConnectionMessage()
                    .setCollaboratorDescription(user)
                    .setNameFileResponse(responseCompetence.getName())
                    .setSequence(personalMessageSequence)
                    .setMessageDate(new Date());
            rabbitTemplate.convertAndSend(fanout.getName(),"",mapperObj.writeValueAsString(connectionMessage));
            return user;
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @RequestMapping(value = "${endpoint.connectuserinmicroservices}", method = RequestMethod.GET)
    @ResponseBody
    public CollaboratorDescription connectUserInMicroservices(@PathVariable Long collab_id) {
        return this.connectUserInMicroservicesFunction(collab_id);

    }

    public CollaboratorDescription checkIfCollaboratorExistElsewhere(CollaboratorDescription inputCollaboratorData) {
        ObjectMapper mapperObj = new ObjectMapper();
        UUID personalMessageSequence = UUID.randomUUID();
        ConnectionMessage connectionMessage = new ConnectionMessage()
                .setCollaboratorDescription(inputCollaboratorData)
                .setNameFileResponse(responseCompetence.getName())
                .setSequence(personalMessageSequence)
                .setMessageDate(new Date());
        try {
            this.rabbitTemplate.convertAndSend(fanout.getName(), "", mapperObj.writeValueAsString(connectionMessage));
            ConnectionMessage mostRecentRemoteCollaborator = null;
            mostRecentRemoteCollaborator = this.rabbitTemplate.execute(new ChannelCallback<ConnectionMessage>() {

                @Override
                public ConnectionMessage doInRabbit(final Channel channel) throws Exception {
                    long startTime = System.currentTimeMillis();
                    long elapsedTime = 0;
                    ConnectionMessage mostRecentConsumerResponse = null;
                    GetResponse consumerResponse;
                    long deliveryTag;
                    sleep();
                    do {
                        elapsedTime = (new Date()).getTime() - startTime;
                        consumerResponse = channel.basicGet(responseCompetence.getName(), false);
                        if (consumerResponse != null) {
                            deliveryTag = consumerResponse.getEnvelope().getDeliveryTag();
                            ConnectionMessage rabbitMessageResponse = new ObjectMapper().readValue(consumerResponse.getBody(), ConnectionMessage.class);
                            channel.basicAck(deliveryTag, true);
                            if ((new Date().getTime() - rabbitMessageResponse.getMessageDate().getTime()) < 5000) {
                                if (rabbitMessageResponse.getSequence().equals(personalMessageSequence)) {
                                    if (mostRecentConsumerResponse == null ||
                                            rabbitMessageResponse.getCollaboratorDescription().getLastUpdateDate()
                                                    .after(mostRecentConsumerResponse.getCollaboratorDescription().getLastUpdateDate())) {
                                        mostRecentConsumerResponse = rabbitMessageResponse;
                                    }
                                } else {
                                    channel.basicPublish("", responseCompetence.getName(), null, consumerResponse.getBody());
                                }
                            }
                        }
                    } while (consumerResponse != null && elapsedTime < 2000);


                    return mostRecentConsumerResponse;
                }
            });
            if (mostRecentRemoteCollaborator != null)
                return mostRecentRemoteCollaborator.getCollaboratorDescription();
            return null;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    public CollaboratorDescription handleReceivedCollaborator(CollaboratorDescription myCollaboratorDescription, CollaboratorDescription receivedCollab) {
        Collaborator storedCollaborator = collaboratorDAO.getCollaboratorByLogin(myCollaboratorDescription.getEmail());

        CollaboratorDescription addedCollaborator;

        if (isEmpty(storedCollaborator.getEmail())) {
            if(receivedCollab.getPassword().equals(myCollaboratorDescription.getPassword())){
                receivedCollab.setId(0);
                addedCollaborator = addCollaboratorDirectly(receivedCollab);
                System.out.println("ADDEDCOLLAB" + addedCollaborator.getFirstName());
                return addedCollaborator;
            }
            else
                return null;
        } else {
            //  COMPLET
            CollaboratorDescription storedcollaboratorDescription = new CollaboratorToDescription().convert(storedCollaborator);

            if(receivedCollab == null || receivedCollab.getFirstName() == null || (storedcollaboratorDescription.getPassword().equals(receivedCollab.getPassword()) && (storedcollaboratorDescription.getPassword().equals(myCollaboratorDescription.getPassword()))) || (storedcollaboratorDescription.getLastUpdateDate().after(receivedCollab.getLastUpdateDate()) && storedcollaboratorDescription.getPassword().equals(myCollaboratorDescription.getPassword()))){
                System.out.println("MOT DE PASSE IDENTIQUE OU PLUS RECENT");
                return storedcollaboratorDescription;
            }
            else if( (myCollaboratorDescription.getPassword().equals(receivedCollab.getPassword())) && (storedcollaboratorDescription.getLastUpdateDate().before(receivedCollab.getLastUpdateDate()))){
                storedcollaboratorDescription = updateCollaboratorPassword(receivedCollab.getPassword(),String.valueOf(storedcollaboratorDescription.getId()));
                return storedcollaboratorDescription;
            }
            else {
                System.out.println("MOT DE PASSE MOINS RECENT");

                return null;
            }

        }
    }

    private CollaboratorDescription addCollaboratorDirectly(CollaboratorDescription collaboratorDescription){
        try {
            System.out.println("ADDING COLLABORAOR DIRECTLY");
            collaboratorDescription.setDefaultPicture(true);
            Collaborator collaborator = collaboratorDAO.addCollaborator(new DescriptionToCollaborator().convert(collaboratorDescription));
            return new CollaboratorToDescription().convert(collaborator);
        } catch (PersistenceException pe) {
            UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
            if (uniqueFieldErrors == null) throw new C360Exception(pe);
            else throw new UniqueFieldException(uniqueFieldErrors.getField());
        }
    }

    /*private void Send(String message) throws Exception {
        *//*ConnectionFactory var1 = new ConnectionFactory();
        var1.setHost("localhost");
        Connection var2 = var1.newConnection();
        Channel var3 = var2.createChannel();
        var3.queueDeclare("hello", false, false, false, (Map)null);
        var3.basicPublish("", "hello", (BasicProperties)null, message.getBytes("UTF-8"));
        System.out.println(" [x] Sent \'" + message + "\'");
        var3.close();
        var2.close();*//*
    }*/

    private static final Map<String, CollaboratorDescription> mapUserCache = new ConcurrentHashMap<>();

    private void putUserInCache(String token, CollaboratorDescription user) {
        mapUserCache.put(token, user);
    }

    @CrossOrigin
    @RequestMapping(value = "${endpoint.getuserrole}", method = RequestMethod.POST)
    @ResponseBody
    public boolean checkIsAdminAlreadyConnected(@RequestBody String thisToken) {
        try {
            return mapUserCache.get(thisToken).getIsAdmin();
        } catch (Exception e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @CrossOrigin
    @RequestMapping(value = "${endpoint.isconnected}", method = RequestMethod.POST)
    @ResponseBody
    public boolean checkIsAlreadyConnected(@RequestBody String thisToken) {
        try {
            thisToken = thisToken.replace("=", "");
            return mapUserCache.get(thisToken) != null;
        } catch (Exception e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @CrossOrigin
    @RequestMapping(value = "${endpoint.userdisconnect}", method = RequestMethod.POST)
    @ResponseBody
    public Boolean deleteDisconnectedUserFromCache(@RequestBody String token) {
        CollaboratorDescription collaborator = mapUserCache.get(token.substring(0, token.length()-1));
        if (collaborator != null){
            try {
            /* log out for this microservice */
                mapUserCache.remove(token);
                compactJws = null;
            /* send disconnection request for other microservices */
                DisconnectionMessage msg = new DisconnectionMessage();
                msg.setToken(token)
                        .setNameFileResponse(responseCompetence.getName())
                        .setCollaboratorDescription(collaborator);
                ObjectMapper mapper = new ObjectMapper();
                rabbitTemplate.convertAndSend(fanout.getName(),"",mapper.writeValueAsString(msg));
                return (mapUserCache.get(token) == null);
            } catch (Exception e) {
                e.printStackTrace();
                throw new C360Exception(e);
            }
        }
        else
            return true;
    }

    @CrossOrigin
    @RequestMapping(value = "${endpoint.collaborators}", method = RequestMethod.POST)
    @ResponseBody
    public CollaboratorDescription addCollaborator(@RequestBody CollaboratorDescription collaboratorDescription) {

        ConnectionMessage checkIfUserExist = new ConnectionMessage();
        UUID personalMessageSequence = UUID.randomUUID();
        checkIfUserExist.setCollaboratorDescription(collaboratorDescription).
                setMessageDate(new Date()).
                setNameFileResponse(responseCompetence.getName()).
                setSequence(personalMessageSequence);
        ObjectMapper mapper = new ObjectMapper();
        try{
            rabbitTemplate.convertAndSend(fanout.getName(),"",mapper.writeValueAsString(checkIfUserExist));
        }catch (Exception e){
            e.printStackTrace();
        }

        ConnectionMessage connectedUser = this.rabbitTemplate.execute(new ChannelCallback<ConnectionMessage>() {

            @Override
            public ConnectionMessage doInRabbit(final Channel channel) throws Exception {
                long startTime = System.currentTimeMillis();
                long elapsedTime = 0;
                ConnectionMessage mostRecentConsumerResponse = null;
                GetResponse consumerResponse;
                long deliveryTag;
                sleep();
                do {
                    elapsedTime = (new Date()).getTime() - startTime;
                    consumerResponse = channel.basicGet(responseCompetence.getName(), false);
                    if (consumerResponse != null) {
                        deliveryTag = consumerResponse.getEnvelope().getDeliveryTag();
                        ConnectionMessage rabbitMessageResponse = new ObjectMapper().readValue(consumerResponse.getBody(), ConnectionMessage.class);
                        channel.basicAck(deliveryTag, true);
                        if (rabbitMessageResponse.getSequence().equals(personalMessageSequence)) {
                            if (mostRecentConsumerResponse == null ||
                                    rabbitMessageResponse.getCollaboratorDescription().getLastUpdateDate()
                                            .after(mostRecentConsumerResponse.getCollaboratorDescription().getLastUpdateDate())) {
                                mostRecentConsumerResponse = rabbitMessageResponse;
                            }
                        } else {
                            channel.basicPublish("", responseCompetence.getName(), null, consumerResponse.getBody());
                        }
                        System.out.println("compte existe!");
                        compteExisteInOtherApp = true;
                        return null;
                    }
                    else{
                        System.out.println("compte existe pas!");
                        compteExisteInOtherApp = false;
                    }
                } while (consumerResponse != null && elapsedTime < 2000);
                return mostRecentConsumerResponse;
            }
        });
        if (compteExisteInOtherApp){
            //if the email is already exist in other microservice
            throw new UniqueFieldException("email");
        }
        try {
            collaboratorDescription.setDefaultPicture(true);
            Collaborator collaborator = collaboratorDAO.addCollaborator(new DescriptionToCollaborator().convert(collaboratorDescription));
            return new CollaboratorToDescription().convert(collaborator);
        } catch (PersistenceException pe) {
            UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
            if (uniqueFieldErrors == null) throw new C360Exception(pe);
            else throw new UniqueFieldException(uniqueFieldErrors.getField());
        }
    }

    @CrossOrigin
    @RequestMapping(value = "${endpoint.updatecollaborator}", method = RequestMethod.PUT)
    @ResponseBody
    public Map<String, CollaboratorDescription> updateCollaborator(@RequestBody CollaboratorDescription collaborator) {
        try {
            Collaborator collaboratorToUpdate = collaboratorDAO.updateCollaborator(new DescriptionToCollaborator().convert(collaborator));
            Key key = MacProvider.generateKey();
            String compactJws = Jwts.builder()
                    .claim("firstName", collaborator.getFirstName())
                    .claim("lastName", collaborator.getLastName())
                    .claim("isAdmin", collaborator.getIsAdmin())
                    .claim("email", collaborator.getEmail())
                    .claim("version", collaborator.getVersion())
                    .claim("id", collaborator.getId())
                    .claim("defaultPicture", collaborator.getDefaultPicture())
                    .signWith(SignatureAlgorithm.HS512, key)
                    .compact();
            Map currentUserMap = new HashMap<>();
            putUserInCache(compactJws, collaborator);
            currentUserMap.put("userConnected", compactJws);
            return currentUserMap;
        } catch (PersistenceException pe) {
            UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
            if (uniqueFieldErrors == null) throw new C360Exception(pe);
            else throw new UniqueFieldException(uniqueFieldErrors.getField());
        }
    }

    @CrossOrigin
    @RequestMapping(value = "${endpoint.collaborators}", method = RequestMethod.GET)
    @ResponseBody
    public List<CollaboratorIdentity> getAllCollaborators() {
        try {
            return new CollaboratorToIdentity().convert(collaboratorDAO.getAllCollaborators());
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @CrossOrigin
    @RequestMapping(value = "${endpoint.collaboratorbyid}", method = RequestMethod.GET)
    @ResponseBody
    public CollaboratorIdentity getCollaboratorById(@PathVariable Long collab_id) {
        try {
            return new CollaboratorToIdentity().convert(collaboratorDAO.getCollaboratorById(collab_id));
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @CrossOrigin
    @RequestMapping(value = "${endpoint.collabdescriptionbyid}", method = RequestMethod.GET)
    @ResponseBody
    public CollaboratorDescription getCollabDescriptionById(@PathVariable Long collab_id) {
        try {
            return new CollaboratorToDescription().convert(collaboratorDAO.getCollaboratorById(collab_id));
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }


    //Update Collaborator Password
    @CrossOrigin
    @RequestMapping(value = "${endpoint.collaboratorspassword}", method = RequestMethod.PUT)
    @ResponseBody
    public CollaboratorDescription updateCollaboratorPassword(@PathVariable String collaboratorPassword, @PathVariable String collabId) {
        try {
            Collaborator collaborator = collaboratorDAO.getCollaborator(Long.parseLong(collabId));
            if (collaborator == null) throw new PersistentObjectNotFoundException(15, Collaborator.class);
            collaborator = collaboratorDAO.updateCollaboratorPassword(collaborator, collaboratorPassword);
            return new CollaboratorToDescription().convert(collaborator);
        } catch (PersistentObjectNotFoundException e) {
            throw new C360Exception(e);
        }
    }

    //Send Collaborator Email
    @CrossOrigin
    @RequestMapping(value = "${endpoint.collaboratorsemailpassword}", method = RequestMethod.POST)
    @ResponseBody
    public void sendCollaboratorEmail(@PathVariable String collaboratorId) {
        try {
            Collaborator collaborator = collaboratorDAO.getCollaborator(Long.parseLong(collaboratorId));
            sendMessage sendmessage = new sendMessage();
            try {
                sendmessage.main(collaborator.getEmail(), collaborator.getId());
            } catch (MessagingException e) {
                e.printStackTrace();
            }
            if (collaborator == null) throw new PersistentObjectNotFoundException(15, Collaborator.class);

        } catch (PersistentObjectNotFoundException e) {
            throw new C360Exception(e);
        }
    }

    @CrossOrigin
    @RequestMapping(value = "${endpoint.expertise}", method = RequestMethod.PUT)
    @ResponseBody
    public ExpertiseDescription updateExpertise(@RequestBody ExpertiseDescription expertiseDescription) {
        try {
            expertiseDescription.setNoted(true);
            Expertise expertise = expertiseDAO.updateExpertise(new DescriptionToExpertise().convert(expertiseDescription));
            return new ExpertiseToDescription().convert(expertise);
        } catch (PersistenceException pe) {
            UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
            if (uniqueFieldErrors == null) throw new C360Exception(pe);
            else throw new UniqueFieldException(uniqueFieldErrors.getField());
        }
    }

    @CrossOrigin
    @RequestMapping(value = "${endpoint.getcollabexpertises}", method = RequestMethod.GET)
    @ResponseBody
    public List<ExpertiseDescription> getAllExpertise(@PathVariable Long collaboratorId) {
        try {
            return new ExpertiseToDescription().convert(expertiseDAO.getAllExpertises(new IdentityToCollaborator().convert(this.getCollaboratorById(collaboratorId))));
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @CrossOrigin
    @RequestMapping(value = "${endpoint.collaboratorsexpertises}", method = RequestMethod.POST)
    @ResponseBody
    public List<ExpertiseDescription> getCollabsByExpertises(@RequestBody List<ExpertiseDescription> list) {
        try {
            return new ExpertiseToDescription().convert(expertiseDAO.getCollabsByExpertise(new DescriptionToExpertise().convert(list)));

        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @CrossOrigin
    @RequestMapping(value = "${endpoint.expertisebycollaborator}", method = RequestMethod.POST)
    @ResponseBody
    public List<ExpertiseDescription> getInductedExpertisesByCollaborators(@RequestBody List<ExpertiseDescription> list) {
        try {
            return new ExpertiseToDescription().convert(expertiseDAO.getInductedExpertisesByCollaborators(new DescriptionToExpertise().convert(list)));

        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }


}