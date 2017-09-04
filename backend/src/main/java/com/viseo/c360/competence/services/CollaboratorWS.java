package com.viseo.c360.competence.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.viseo.c360.competence.amqp.RabbitMessage;
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
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.core.convert.ConversionException;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.mail.MessagingException;
import javax.persistence.PersistenceException;
import java.io.IOException;
import java.security.Key;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

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

    @CrossOrigin
    @RequestMapping(value = "${endpoint.user}", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, CollaboratorDescription> getUserByLoginPassword(@RequestBody CollaboratorDescription myCollaboratorDescription) throws Exception {
        try {
            System.out.println("THIS IS DAO : " + collaboratorDAO);
            InitializeMap();
            CollaboratorDescription user = checkIfCollaboratorExistElsewhere(myCollaboratorDescription);
            Key key = MacProvider.generateKey();
            String compactJws = Jwts.builder()
                    .claim("firstName", user.getFirstName())
                    .claim("lastName", user.getLastName())
                    .claim("isAdmin", user.getIsAdmin())
                    .claim("email", user.getEmail())
                    .claim("version", user.getVersion())
                    .claim("id", user.getId())
                    .claim("defaultPicture", user.getDefaultPicture())
                    .signWith(SignatureAlgorithm.HS512, key)
                    .compact();
            Map currentUserMap = new HashMap<>();
            putUserInCache(compactJws, user);
            currentUserMap.put("userConnected", compactJws);
            ObjectMapper mapperObj = new ObjectMapper();


            return currentUserMap;
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    public CollaboratorDescription checkIfCollaboratorExistElsewhere(CollaboratorDescription myCollaboratorDescription) {
        ObjectMapper mapperObj = new ObjectMapper();

        CollaboratorDescription receivedCollab = null;

        RabbitMessage rabbitMessage = new RabbitMessage();
        rabbitMessage.setCollaboratorDescription(myCollaboratorDescription);
        rabbitMessage.setNameFileResponse(responseCompetence.getName());

        try {
            this.rabbitTemplate.convertAndSend(fanout.getName(), "", mapperObj.writeValueAsString(rabbitMessage));
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            Message consumerResponse = this.rabbitTemplate.receive(responseCompetence.getName());
            if (consumerResponse != null) {

                RabbitMessage rabbitMessageResponse = new RabbitMessage();
                rabbitMessageResponse = new ObjectMapper().readValue(consumerResponse.getBody(), RabbitMessage.class);
                receivedCollab = rabbitMessageResponse.getCollaboratorDescription();

                System.out.println("Received Collaborator : " + receivedCollab.getFirstName() + receivedCollab.getLastName());
            }
            receivedCollab = handleReceivedCollaborator(myCollaboratorDescription, receivedCollab);

            return receivedCollab;

        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    public CollaboratorDescription handleReceivedCollaborator(CollaboratorDescription myCollaboratorDescription, CollaboratorDescription receivedCollab) {
        Collaborator storedCollaborator = collaboratorDAO.getCollaboratorByLogin(myCollaboratorDescription.getEmail());

        CollaboratorDescription addedCollaborator;

        if (isEmpty(storedCollaborator.getEmail())) {
            if(receivedCollab.getPassword().equals(myCollaboratorDescription.getPassword())){
                receivedCollab.setId(0);
                addedCollaborator = addCollaborator(receivedCollab);
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

    private static ConcurrentHashMap<String, CollaboratorDescription> mapUserCache;

    private void InitializeMap() {
        if (mapUserCache == null)
            mapUserCache = new ConcurrentHashMap<String, CollaboratorDescription>();
    }

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
        try {
            mapUserCache.remove(token);
            if (mapUserCache.get(token) == null)
                return true;
            else
                return false;
        } catch (Exception e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @CrossOrigin
    @RequestMapping(value = "${endpoint.collaborators}", method = RequestMethod.POST)
    @ResponseBody
    public CollaboratorDescription addCollaborator(@RequestBody CollaboratorDescription collaboratorDescription) {
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
            InitializeMap();
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