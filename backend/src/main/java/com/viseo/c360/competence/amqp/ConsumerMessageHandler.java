package com.viseo.c360.competence.amqp;

import com.viseo.c360.competence.dao.CollaboratorDAO;
import com.viseo.c360.competence.domain.collaborator.Collaborator;
import com.viseo.c360.competence.dto.collaborator.CollaboratorDescription;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.amqp.core.FanoutExchange;
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
    Queue responseQueue;

    public void handleMessage(String request) {
        SpringBeanAutowiringSupport.processInjectionBasedOnCurrentContext(this);
        com.fasterxml.jackson.databind.ObjectMapper mapperObj = new com.fasterxml.jackson.databind.ObjectMapper();

        try {
            CollaboratorDescription collaborator = mapperObj.readValue(request, CollaboratorDescription.class);
            System.out.println("Halelujah j'ai reçu ça   : " + request);
            Collaborator c = ws.getCollaboratorByLogin(collaborator.getEmail());
            System.out.println("Le voila = " + c.getFirstName());
            if(c != null)
            rabbitTemplate.convertAndSend(responseQueue.getName(),mapperObj.writeValueAsString(c));
            else
                System.out.println("Rien trouvé");
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

}
