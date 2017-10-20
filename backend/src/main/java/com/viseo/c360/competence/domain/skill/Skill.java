package com.viseo.c360.competence.domain.skill;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.viseo.c360.competence.domain.BaseEntity;

import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
public class Skill extends BaseEntity {

    @NotNull
    @Size(max = 20)
    String label;

    public Skill() {
        super();
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

}

