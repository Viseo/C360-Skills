package com.viseo.c360.competence.domain.skill;

import com.viseo.c360.competence.domain.BaseEntity;
import com.viseo.c360.competence.domain.collaborator.Collaborator;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.Entity;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

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

