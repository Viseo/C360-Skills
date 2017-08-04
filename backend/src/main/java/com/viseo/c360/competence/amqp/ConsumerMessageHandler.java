package com.viseo.c360.competence.amqp;

import com.viseo.c360.competence.dao.CollaboratorDAO;
import com.viseo.c360.competence.domain.collaborator.Collaborator;
import com.viseo.c360.competence.dto.collaborator.CollaboratorDescription;
import com.viseo.c360.competence.dto.collaborator.CollaboratorIdentity;
import com.viseo.c360.competence.services.CollaboratorWS;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import javax.inject.Inject;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by BBA3616 on 28/07/2017.
 */
public class ConsumerMessageHandler {
    @Inject
    CollaboratorDAO ws;

    public String handleMessage(String request) {
        SpringBeanAutowiringSupport.processInjectionBasedOnCurrentContext(this);
        com.fasterxml.jackson.databind.ObjectMapper mapperObj = new com.fasterxml.jackson.databind.ObjectMapper();

        try {
            CollaboratorDescription collaborator = new ObjectMapper().readValue(request, CollaboratorDescription.class);
            System.out.println("Message Received at consumer end  : " + request);
            Collaborator c = ws.getCollaboratorByLogin(collaborator.getEmail());
            System.out.println("Le voila = " + c.getFirstName());
            if(c != null)
            return  mapperObj.writeValueAsString(c);
        } catch (IOException e) {
            e.printStackTrace();
        }

            return null;
    }

}