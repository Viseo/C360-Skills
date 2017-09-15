package com.viseo.c360.competence.amqp;

import com.viseo.c360.competence.converters.collaborator.CollaboratorToDescription;
import com.viseo.c360.competence.dao.CollaboratorDAO;
import com.viseo.c360.competence.domain.collaborator.Collaborator;
import com.viseo.c360.competence.dto.collaborator.CollaboratorDescription;
import com.viseo.c360.competence.services.CollaboratorWS;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import javax.inject.Inject;
import java.io.IOException;

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

    public void handleMessage(String request) {
        SpringBeanAutowiringSupport.processInjectionBasedOnCurrentContext(this);
        com.fasterxml.jackson.databind.ObjectMapper mapperObj = new com.fasterxml.jackson.databind.ObjectMapper();

        try {
            ConnectionMessage connectionMessageResponse = new ConnectionMessage();
            connectionMessageResponse = new com.fasterxml.jackson.databind.ObjectMapper().readValue(request, ConnectionMessage.class);
            CollaboratorDescription collaborator = connectionMessageResponse.getCollaboratorDescription();
            System.out.println("Halelujah j'ai reçu ça   : " + request);
            if (connectionMessageResponse.getToken() != null) {
                ws.checkIfAlreadyConnected(connectionMessageResponse);
            } else  {
                Collaborator c = dao.getCollaboratorByLogin(collaborator.getEmail());
                System.out.println("Le voila = " + c.getFirstName());
                connectionMessageResponse.setCollaboratorDescription(new CollaboratorToDescription().convert(c));
                if (c.getFirstName() != null) {
                    if (!connectionMessageResponse.getNameFileResponse().equals(responseCompetence.getName())) {
                        rabbitTemplate.convertAndSend(connectionMessageResponse.getNameFileResponse(), mapperObj.writeValueAsString(connectionMessageResponse));
                        System.out.println("Collaborateur envoyé !");
                    }

                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

}
