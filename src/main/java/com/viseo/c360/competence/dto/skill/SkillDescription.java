package com.viseo.c360.competence.dto.skill;
import com.viseo.c360.competence.dto.BaseDTO;
import com.viseo.c360.competence.dto.collaborator.CollaboratorIdentity;

import java.util.List;

public class SkillDescription extends BaseDTO {

    String label;

    public SkillDescription() {
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

}
