package com.viseo.c360.competence.amqp;

import com.viseo.c360.competence.converters.collaborator.CollaboratorToDescription;
import com.viseo.c360.competence.dao.CollaboratorDAO;
import com.viseo.c360.competence.domain.collaborator.Collaborator;
import com.viseo.c360.competence.dto.collaborator.CollaboratorDescription;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import javax.inject.Inject;
import java.io.IOException;

public class ConsumerMessageHandler {
    @Inject
    CollaboratorDAO ws;

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
            RabbitMessage rabbitMessageResponse = new RabbitMessage();
            rabbitMessageResponse = new com.fasterxml.jackson.databind.ObjectMapper().readValue(request, RabbitMessage.class);

            CollaboratorDescription collaborator = rabbitMessageResponse.getCollaboratorDescription();
            System.out.println("Halelujah j'ai reçu ça   : " + request);
            if(collaborator.getFirstName() == null){
                Collaborator c = ws.getCollaboratorByLogin(collaborator.getEmail());
                System.out.println("Le voila = " + c.getFirstName());
                rabbitMessageResponse.setCollaboratorDescription(new CollaboratorToDescription().convert(c));
                if(c.getFirstName() != null)
                    if(!rabbitMessageResponse.getNameFileResponse().equals(responseCompetence.getName()))
                        rabbitTemplate.convertAndSend(rabbitMessageResponse.getNameFileResponse(),mapperObj.writeValueAsString(rabbitMessageResponse));
                    else
                        System.out.println("Rien trouvé");
            }
            else{
                System.out.println("REPONSE : "+ collaborator.getFirstName() + " " + collaborator.getLastName());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

}
