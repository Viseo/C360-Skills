package com.viseo.c360.competence.converters.collaborator;

import com.viseo.c360.competence.domain.collaborator.Collaborator;
import com.viseo.c360.competence.dto.collaborator.CollaboratorDescription;

import java.util.ArrayList;
import java.util.List;

public class CollaboratorToDescription {

    public CollaboratorToDescription() {
    }

    public CollaboratorDescription convert(Collaborator source) {
        CollaboratorDescription dto = new CollaboratorDescription();
        dto.setId(source.getId());
        dto.setVersion(source.getVersion());
        dto.setPersonnalIdNumber(source.getPersonnalIdNumber());
        dto.setLastName(source.getLastName());
        dto.setFirstName(source.getFirstName());
        dto.setEmail(source.getEmail());
        dto.setPassword(source.getPassword());

        dto.setAdmin(source.getAdmin());
        dto.setFunction(source.getFunction());
        dto.setBusinessUnit(source.getBusinessUnit());
        dto.setDefaultPicture(source.getDefaultPicture());
        dto.setLastUpdateDate(source.getLastUpdateDate());
        return dto;
    }

    public List<CollaboratorDescription> convert(List<Collaborator> sourceList) {
        List<CollaboratorDescription> listDto = new ArrayList<>();
        for (Collaborator collaborator : sourceList) {
            listDto.add(convert(collaborator));
        }
        return listDto;
    }



}
