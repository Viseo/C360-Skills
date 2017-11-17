package com.viseo.c360.competence.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.GetResponse;
import com.viseo.c360.competence.amqp.*;
import com.viseo.c360.competence.config.ServerConfig;
import com.viseo.c360.competence.converters.skill.DescriptionToSkill;
import com.viseo.c360.competence.converters.skill.SkillToDescription;
import com.viseo.c360.competence.dao.ExpertiseDAO;
import com.viseo.c360.competence.dao.SkillDAO;
import com.viseo.c360.competence.domain.collaborator.Collaborator;
import com.viseo.c360.competence.domain.collaborator.Expertise;
import com.viseo.c360.competence.domain.skill.Skill;
import com.viseo.c360.competence.dto.skill.SkillDescription;
import com.viseo.c360.competence.exceptions.C360Exception;
import com.viseo.c360.competence.exceptions.dao.UniqueFieldException;
import com.viseo.c360.competence.exceptions.dao.util.ExceptionUtil;
import com.viseo.c360.competence.exceptions.dao.util.UniqueFieldErrors;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.ChannelCallback;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.core.convert.ConversionException;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.persistence.PersistenceException;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by HBO3676 on 15/06/2017.
 */
@RestController
public class SkillWS {
    @Inject
    SkillDAO skillDAO;

    @Inject
    ExpertiseDAO expertiseDAO;

    @Inject
    ExceptionUtil exceptionUtil;

    @Inject
    Queue responseCompetence;

    @Inject
    FanoutExchange fanout;

    @Inject
    RabbitTemplate rabbitTemplate;

    public SkillWS(){
        TimerTask timerTask = new synchronizeDateBase();
        Timer timer = new Timer(true);
        timer.scheduleAtFixedRate(timerTask, 1*1000, 15*1000);
        System.out.println("Synchronize DateBase for skill data started");
    }

    private class synchronizeDateBase extends TimerTask{

        @Override
        public void run() {
            List<SkillDescription> otherListSkill = getSkillsFromOtherServices();
            handleReceivedCollaborator(otherListSkill);
            System.out.println("Skill data is synchronized");
        }
    }

    private List<SkillDescription> mergeTwoSkillList (List<SkillDescription> listSkill, List<SkillDescription> otherListSkill){
        if(listSkill == null){
            return otherListSkill;
        }
        else if (otherListSkill == null){
            return listSkill;
        }
        Set<String> labels = otherListSkill.stream().map(SkillDescription::getLabel).collect(Collectors.toSet());
        List<SkillDescription> mergedListSkill = listSkill.stream().filter(skill -> !labels.contains(skill.getLabel()))
                .collect(Collectors.toList());
        return mergedListSkill;
    }

    private List<SkillDescription> handleReceivedCollaborator (List<SkillDescription> listReceived){
        if(listReceived != null){
            for (SkillDescription s : listReceived){
                if (!skillDAO.getSkillByLabel(s.getLabel())){
                    skillDAO.addSkill(new DescriptionToSkill().convert(s));
                }
            }
        }
        return new SkillToDescription().convert(skillDAO.getAllSkills());
    }

    private List<SkillDescription> getSkillsFromOtherServices(){
        ObjectMapper mapperObj = new ObjectMapper();
        UUID personalMessageSequence = UUID.randomUUID();
        InformationMessage informationMessage = new InformationMessage()
                .setNameFileResponse(responseCompetence.getName())
                .setMessageDate(new Date())
                .setSequence(personalMessageSequence);
        try{
            this.rabbitTemplate.convertAndSend(fanout.getName(),"",mapperObj.writeValueAsString(informationMessage));
            InformationMessage result;
            result = this.rabbitTemplate.execute(new ChannelCallback<InformationMessage>(){

                @Override
                public InformationMessage doInRabbit(Channel channel) throws Exception {
                    long startTime = System.currentTimeMillis();
                    long elapsedTime;
                    InformationMessage collectedResponse = new InformationMessage();
                    GetResponse consumerResponse;
                    long deliveryTag;
                    sleep();
                    do{
                        elapsedTime = (new Date()).getTime() - startTime;
                        consumerResponse = channel.basicGet(responseCompetence.getName(), false);
                        if (consumerResponse != null){
                            deliveryTag = consumerResponse.getEnvelope().getDeliveryTag();
                            channel.basicAck(deliveryTag, true);
                            // check if the right msg type
                            JSONObject jo = (JSONObject) new JSONParser().parse(new String(consumerResponse.getBody(), StandardCharsets.UTF_8));
                            RabbitMsg rbtMsg = ResolveMsgFactory.getFactory().get(jo.get("type")).apply(jo);
                            if(rbtMsg.getType() == MessageType.INFORMATION){
                                InformationMessage rabbitMessageResponse = new ObjectMapper().readValue(consumerResponse.getBody(), InformationMessage.class);
                                if ((new Date().getTime() - rabbitMessageResponse.getMessageDate().getTime()) < 50000) {
                                    if (rabbitMessageResponse.getSequence().equals(personalMessageSequence)) {
                                        collectedResponse.setSkillsDescription(mergeTwoSkillList(collectedResponse.getSkillsDescription()
                                                , rabbitMessageResponse.getSkillsDescription()));
                                    } else {
                                        channel.basicPublish("", responseCompetence.getName(), null, consumerResponse.getBody());
                                    }
                                }
                            }
                            else{
                                channel.basicPublish("", responseCompetence.getName(), null, consumerResponse.getBody());
                            }
                        }
                    }while(elapsedTime < 2000);
                    // the expiration time is 2s, during this 2s, service will continue to receive the skill list
                    return collectedResponse;
                }
            });
            return result.getSkillsDescription();

        }catch (JsonProcessingException jpe){
            throw new RuntimeException(jpe);
        }
    }

    public void sleep() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
        }
    }

    @CrossOrigin (origins =  ServerConfig.address)
    @RequestMapping(value = "${endpoint.addskill}", method = RequestMethod.POST)
    @ResponseBody
    public Boolean addSkill(@RequestBody SkillDescription skillDescription){
        try {
            if(!skillDAO.getSkillByLabel(skillDescription.getLabel())){
                skillDAO.addSkill(new DescriptionToSkill().convert(skillDescription));
                return true;
            }else{
                return false;
            }
        } catch (PersistenceException pe) {
            UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
            if (uniqueFieldErrors == null) throw new C360Exception(pe);
            else throw new UniqueFieldException(uniqueFieldErrors.getField());
        }
    }

    @CrossOrigin (origins =  ServerConfig.address)
    @RequestMapping(value = "${endpoint.updateskill}", method = RequestMethod.PUT)
    @ResponseBody
    public Boolean updateSkill(@RequestBody SkillDescription skillDescription){
        try {
            skillDAO.updateSkill(new DescriptionToSkill().convert(skillDescription));
            return true;
        } catch (PersistenceException pe) {
            UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
            if (uniqueFieldErrors == null) throw new C360Exception(pe);
            else throw new UniqueFieldException(uniqueFieldErrors.getField());
        }
    }
    @CrossOrigin (origins =  ServerConfig.address)
    @RequestMapping(value = "${endpoint.removeskill}", method = RequestMethod.POST)
    @ResponseBody
    public Boolean removeSkill(@RequestBody SkillDescription skillDescription){
        if (skillDAO.getSkillByLabel(skillDescription.getLabel())){
            try {
                expertiseDAO.removeExpertisesBySkill(new DescriptionToSkill().convert(skillDescription));
                skillDAO.removeSkill(new DescriptionToSkill().convert(skillDescription));
                sendRemoveSkillRequesToOtherServices(skillDescription);
                return true;
            } catch (PersistenceException pe) {
                UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
                if (uniqueFieldErrors == null) throw new C360Exception(pe);
                else throw new UniqueFieldException(uniqueFieldErrors.getField());
            }
        }
        else
            return false;
    }

    private void sendRemoveSkillRequesToOtherServices(SkillDescription skillDescription) {
        ObjectMapper mapperObj = new ObjectMapper();
        DeleteSkillMessage deleteSkillMessage = new DeleteSkillMessage();
        deleteSkillMessage.setSkillDescription(skillDescription);
        try{
            this.rabbitTemplate.convertAndSend(fanout.getName(), "", mapperObj.writeValueAsString(deleteSkillMessage));
        }catch(JsonProcessingException jpe){
            throw new RuntimeException(jpe);
        }
    }

    @CrossOrigin (origins =  ServerConfig.address)
    @RequestMapping(value = "${endpoint.skills}", method = RequestMethod.GET)
    @ResponseBody
    public List<SkillDescription> getAllSkills() {
        try {
            return new SkillToDescription().convert(skillDAO.getAllSkills());
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    public void addCollaboratorSkillLevel(List<Skill> skills, List<Collaborator> collaborators){
        for(Collaborator collaborator : collaborators){
            List<Expertise> expertises = expertiseDAO.getExpertiseByCollabEmail(collaborator);
            for(Expertise expertise : expertises){
                for (Skill skill : skills){
                    if (skill.getLabel().equals(expertise.getSkill().getLabel())){
                        int level = expertise.getLevel();
                        if (level < 5){
                            level+=1;
                            expertiseDAO.updateExpertise(expertise.setLevel(level));
                        }
                        break;
                    }
                }
            }
        }
    }
}
