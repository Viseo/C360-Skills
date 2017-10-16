package com.viseo.c360.competence.amqp;

import com.viseo.c360.competence.dto.skill.SkillDescription;

import javax.inject.Inject;

/**
 * Created by YGU3747 on 16/10/2017
 */

public class DeleteSkillMessage extends RabbitMsg {

    @Inject
    private SkillDescription skillDescription;

    public DeleteSkillMessage() {
        super(MessageType.DELETESKILL);
    }

    public SkillDescription getSkillDescription() {
        return skillDescription;
    }

    public DeleteSkillMessage setSkillDescription(SkillDescription skillsDescription) {
        this.skillDescription = skillsDescription;
        return this;
    }
}
