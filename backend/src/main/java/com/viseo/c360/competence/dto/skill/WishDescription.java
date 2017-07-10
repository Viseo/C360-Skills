package com.viseo.c360.competence.dto.skill;

import com.viseo.c360.competence.dto.BaseDTO;

/**
 * Created by NBE3663 on 26/06/2017.
 */
public class WishDescription extends BaseDTO {

    String label;

    public WishDescription() {
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }
}
