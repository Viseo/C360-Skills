package com.viseo.c360.competence.dto.collaborator;

import com.viseo.c360.competence.dto.BaseDTO;
import com.viseo.c360.competence.dto.skill.SkillDescription;

public class ExpertiseDescription extends BaseDTO {

    SkillDescription skill;

    CollaboratorIdentity collaborator;

    int level;

    boolean isNoted;

    public ExpertiseDescription() {
    }

    public SkillDescription getSkill() {
        return skill;
    }

    public void setSkill(SkillDescription skill) {
        this.skill = skill;
    }

    public CollaboratorIdentity getCollaborator() {
        return collaborator;
    }

    public void setCollaborator(CollaboratorIdentity collaborator) {
        this.collaborator = collaborator;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public boolean isNoted() {
        return isNoted;
    }

    public void setNoted(boolean noted) {
        isNoted = noted;
    }
}
