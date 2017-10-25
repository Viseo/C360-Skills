package com.viseo.c360.competence.dto.skill;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.viseo.c360.competence.dto.BaseDTO;

import java.util.Date;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SkillDescription extends BaseDTO {

    String label;

    Date date;

    public SkillDescription() {
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
