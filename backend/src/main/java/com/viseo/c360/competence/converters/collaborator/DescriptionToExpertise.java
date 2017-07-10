package com.viseo.c360.competence.converters.collaborator;

import com.viseo.c360.competence.converters.skill.DescriptionToSkill;
import com.viseo.c360.competence.domain.collaborator.Expertise;
import com.viseo.c360.competence.dto.collaborator.ExpertiseDescription;

import java.util.ArrayList;
import java.util.List;

public class DescriptionToExpertise {

    public DescriptionToExpertise() {
    }

    public Expertise convert(ExpertiseDescription dto) {
        Expertise domain = new Expertise();
        domain.setId(dto.getId());
        domain.setVersion(dto.getVersion());
        domain.setSkill(new DescriptionToSkill().convert(dto.getSkill()));
        domain.setCollaborator(new IdentityToCollaborator().convert(dto.getCollaborator()));
        domain.setLevel(dto.getLevel());
        domain.setNoted(dto.isNoted());
        return domain;
    }

    public List<Expertise> convert(List<ExpertiseDescription> sourceList) {
        List<Expertise> listExpertise = new ArrayList<>();
        for (ExpertiseDescription expertiseDescription : sourceList) {
            listExpertise.add(convert(expertiseDescription));
        }
        return listExpertise;
    }
}
