package com.viseo.c360.competence.amqp;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.viseo.c360.competence.converters.collaborator.CollaboratorToDescription;
import com.viseo.c360.competence.dao.CollaboratorDAO;
import com.viseo.c360.competence.domain.collaborator.Collaborator;
import com.viseo.c360.competence.dto.collaborator.CollaboratorDescription;
import com.viseo.c360.competence.services.CollaboratorWS;
import org.apache.commons.collections.map.HashedMap;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import javax.inject.Inject;
import java.io.IOException;
import java.util.Date;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

public class ConsumerMessageHandler {
    @Inject
    CollaboratorDAO dao;

    @Inject
    CollaboratorWS ws;

    @Inject
    RabbitTemplate rabbitTemplate;

    @Inject
    Queue responseFormation;

    @Inject
    Queue responseCompetence;

    private Map<String, Function<JSONObject, RabbitMsg>> factory = new HashedMap();

    public void handleMessage(String request) {
        SpringBeanAutowiringSupport.processInjectionBasedOnCurrentContext(this);
        //initialiser factory

        factory.put(MessageType.CONNECTION.toString(), json->{
            ObjectMapper objectMapper = new ObjectMapper();
            ConnectionMessage connectionMessage = new ConnectionMessage();
            try{
                connectionMessage.setToken((String)json.get("token"))
                        .setSequence(UUID.fromString((String)json.get("sequence")))
                        .setNameFileResponse((String)json.get("nameFileResponse"))
                        .setMessageDate(new Date((long)json.get("messageDate")))
                        .setType(MessageType.CONNECTION);
                if(json.get("collaboratorDescription") != null){
                    connectionMessage.setCollaboratorDescription(objectMapper.readValue(json.get("collaboratorDescription").toString(), CollaboratorDescription.class));
                }
                return connectionMessage;
            }catch (IOException ioe){
                throw new RuntimeException(ioe);
            }
        });
        factory.put(MessageType.DISCONNECTION.toString(), json->{
            DisconnectionMessage disconnectionMessage = new DisconnectionMessage();
            disconnectionMessage.setToken((String)json.get("token"))
                    .setType(MessageType.DISCONNECTION);
            return disconnectionMessage;
        });
        //deserialiser json et repondre
        try {
            JSONObject jo = (JSONObject) new JSONParser().parse(request);
            RabbitMsg rabbitMsgResponse = factory.get(jo.get("type")).apply(jo);
            if (rabbitMsgResponse instanceof ConnectionMessage){
                ConnectionMessage connectionMessageResponse = (ConnectionMessage) rabbitMsgResponse;
                CollaboratorDescription collaborator = connectionMessageResponse.getCollaboratorDescription();
                System.out.println("Halelujah j'ai reçu ça   : " + request);
                System.out.println("fuck : " + collaborator );
                if (connectionMessageResponse.getToken() != null) {
                    ws.checkIfAlreadyConnected(connectionMessageResponse);
                } else  {
                    Collaborator c = dao.getCollaboratorByLogin(collaborator.getEmail());
                    System.out.println("Le voila = " + c.getFirstName());
                    connectionMessageResponse.setCollaboratorDescription(new CollaboratorToDescription().convert(c));
                    if (c.getFirstName() != null) {
                        if (!connectionMessageResponse.getNameFileResponse().equals(responseCompetence.getName())) {
                            rabbitTemplate.convertAndSend(connectionMessageResponse.getNameFileResponse(), jo.toJSONString());
                            System.out.println("Collaborateur envoyé !");
                        }

                    }
                }
            }
            else if (rabbitMsgResponse instanceof DisconnectionMessage){
                DisconnectionMessage disconnectionMessage = (DisconnectionMessage) rabbitMsgResponse;
                ws.checkIfAlreadyConnected(disconnectionMessage);
            }

        } catch (ParseException pe) {
            pe.printStackTrace();
        }

    }

}
