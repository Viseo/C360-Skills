package com.viseo.c360.competence.converters.collaborator;

import com.viseo.c360.competence.domain.collaborator.Collaborator;
import com.viseo.c360.competence.dto.collaborator.CollaboratorIdentity;

import java.util.ArrayList;
import java.util.List;

public class CollaboratorToIdentity {

    public CollaboratorIdentity convert(Collaborator source) {
        CollaboratorIdentity dto = new CollaboratorIdentity();
        dto.setId(source.getId());
        dto.setVersion(source.getVersion());
        dto.setFirstName(source.getFirstName());
        dto.setLastName(source.getLastName());
        dto.setEmail(source.getEmail());
        dto.setDefaultPicture(source.getDefaultPicture());
        return dto;
    }

    public List<CollaboratorIdentity> convert(List<Collaborator> sourceList) {
        List<CollaboratorIdentity> listDto = new ArrayList<>();
        for (Collaborator collaborator : sourceList) {
            listDto.add(convert(collaborator));
        }
        return listDto;
    }
}
