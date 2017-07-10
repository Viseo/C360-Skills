package com.viseo.c360.competence.converters.skill;

import com.viseo.c360.competence.domain.skill.Wish;
import com.viseo.c360.competence.dto.skill.WishDescription;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by NBE3663 on 26/06/2017.
         */
public class WishToDescription {
    public WishToDescription() {
    }

    public WishDescription convert(Wish source){
        WishDescription dto = new WishDescription();
        dto.setLabel(source.getLabel());
        dto.setId(source.getId());
        dto.setVersion(source.getVersion());
        return dto;
    }

    public List<WishDescription> convert(List<Wish> sourceList) {
        List<WishDescription> listDto = new ArrayList<>();
        for (Wish wish : sourceList){
            listDto.add(convert(wish));
        }
        return listDto;
    }
}
