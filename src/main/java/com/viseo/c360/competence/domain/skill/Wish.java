package com.viseo.c360.competence.domain.skill;

import com.viseo.c360.competence.domain.BaseEntity;

import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * Created by NBE3663 on 26/06/2017.
 */
@Entity

public class Wish extends BaseEntity{

    @NotNull
    @Size (max = 20)
    String label;

    public Wish() {
        super();
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }
}

