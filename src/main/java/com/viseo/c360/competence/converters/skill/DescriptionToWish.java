package com.viseo.c360.competence.converters.skill;

import com.viseo.c360.competence.domain.skill.Wish;
import com.viseo.c360.competence.dto.skill.WishDescription;

/**
 * Created by NBE3663 on 26/06/2017.
 */
public class DescriptionToWish  {
    public DescriptionToWish() {
    }

    public Wish convert (WishDescription dto){
        Wish domain = new Wish();
        domain.setLabel(dto.getLabel());
        domain.setId(dto.getId());
        domain.setVersion(dto.getVersion());
        return domain;
    }
}
