package com.viseo.c360.competence.dto.skill;
import com.viseo.c360.competence.dto.BaseDTO;

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
