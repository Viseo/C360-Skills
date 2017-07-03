package com.viseo.c360.competence.converters.collaborator;

import com.viseo.c360.competence.converters.skill.SkillToDescription;
import com.viseo.c360.competence.domain.collaborator.Collaborator;
import com.viseo.c360.competence.domain.collaborator.Expertise;
import com.viseo.c360.competence.dto.collaborator.CollaboratorDescription;
import com.viseo.c360.competence.dto.collaborator.ExpertiseDescription;

import java.util.ArrayList;
import java.util.List;

public class ExpertiseToDescription {

    public ExpertiseToDescription() {
    }

    public ExpertiseDescription convert(Expertise source) {
        ExpertiseDescription dto = new ExpertiseDescription();
        dto.setId(source.getId());
        dto.setVersion(source.getVersion());
        dto.setSkill(new SkillToDescription().convert(source.getSkill()));
        dto.setCollaborator(new CollaboratorToIdentity().convert(source.getCollaborator()));
        dto.setLevel(source.getLevel());
        dto.setNoted(source.isNoted());
        return dto;
    }

    public List<ExpertiseDescription> convert(List<Expertise> sourceList) {
        List<ExpertiseDescription> listDto = new ArrayList<>();
        for (Expertise expertise : sourceList) {
            listDto.add(convert(expertise));
        }
        return listDto;
    }

}
