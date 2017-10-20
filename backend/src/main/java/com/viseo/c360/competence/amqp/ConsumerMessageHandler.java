package com.viseo.c360.competence.amqp;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.viseo.c360.competence.converters.collaborator.CollaboratorToDescription;
import com.viseo.c360.competence.converters.skill.SkillToDescription;
import com.viseo.c360.competence.dao.CollaboratorDAO;
import com.viseo.c360.competence.dao.SkillDAO;
import com.viseo.c360.competence.domain.collaborator.Collaborator;
import com.viseo.c360.competence.dto.collaborator.CollaboratorDescription;
import com.viseo.c360.competence.services.CollaboratorWS;
import com.viseo.c360.competence.services.SkillWS;
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
    SkillWS skillWS;

    @Inject
    RabbitTemplate rabbitTemplate;

    @Inject
    Queue responseFormation;

    @Inject
    Queue responseCompetence;

    @Inject
    SkillDAO skillDAO;

    private Map<String, Function<JSONObject, RabbitMsg>> factory = ResolveMsgFactory.getFactory();

    public void handleMessage(String request) {
        SpringBeanAutowiringSupport.processInjectionBasedOnCurrentContext(this);
        //deserialiser json et repondre
        try {
            JSONObject jo = (JSONObject) new JSONParser().parse(request);
            RabbitMsg rabbitMsgResponse = factory.get(jo.get("type")).apply(jo);
            if (rabbitMsgResponse instanceof ConnectionMessage){
                ConnectionMessage connectionMessageResponse = (ConnectionMessage) rabbitMsgResponse;
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
                            ObjectMapper mapper = new ObjectMapper();
                            try{
                                rabbitTemplate.convertAndSend(connectionMessageResponse.getNameFileResponse(), mapper.writeValueAsString(connectionMessageResponse));
                                System.out.println("Collaborateur envoyé !");
                            }catch (JsonProcessingException e){
                                throw new RuntimeException(e);
                            }
                        }

                    }
                }
            }
            else if (rabbitMsgResponse instanceof DisconnectionMessage){
                DisconnectionMessage disconnectionMessage = (DisconnectionMessage) rabbitMsgResponse;
                ws.checkIfAlreadyConnected(disconnectionMessage);
            }
            else if (rabbitMsgResponse instanceof InformationMessage){
                InformationMessage informationMessageResponse = (InformationMessage) rabbitMsgResponse;
                informationMessageResponse.setSkillsDescription(new SkillToDescription().convert(skillDAO.getAllSkills()));
                if (!informationMessageResponse.getNameFileResponse().equals(responseCompetence.getName())) {
                    ObjectMapper mapper = new ObjectMapper();
                    try{
                        rabbitTemplate.convertAndSend(informationMessageResponse.getNameFileResponse(), mapper.writeValueAsString(informationMessageResponse));
                        System.out.println("Skill list sent successfully : " + informationMessageResponse.getSkillsDescription().size());
                    }catch (JsonProcessingException e){
                        throw new RuntimeException(e);
                    }
                }
            }
            else if (rabbitMsgResponse instanceof AddSkillLevelMessage){
                AddSkillLevelMessage addSkillLevelMessageResponse = (AddSkillLevelMessage) rabbitMsgResponse;
                if (addSkillLevelMessageResponse.getNameFileResponse().equals(responseCompetence.getName())){
                    skillWS.addCollaboratorSkillLevel(addSkillLevelMessageResponse.getSkills()
                            , addSkillLevelMessageResponse.getCollaborators());
                }
            }

        } catch (ParseException pe) {
            pe.printStackTrace();
        }

    }

}
