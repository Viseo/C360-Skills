package com.viseo.c360.competence.domain.collaborator;

import com.viseo.c360.competence.domain.BaseEntity;
import com.viseo.c360.competence.domain.skill.Skill;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

@Entity
public class Expertise extends BaseEntity {

    @NotNull
    @ManyToOne
    Skill skill;

    @NotNull
    @ManyToOne
    Collaborator collaborator;

    @NotNull
    int level;

    @NotNull
    boolean isNoted;

    public Expertise() {
        super();
    }

    public Skill getSkill() {
        return skill;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }

    public Collaborator getCollaborator() {
        return collaborator;
    }

    public void setCollaborator(Collaborator collaborator) {
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
