package com.viseo.c360.competence.amqp;

import com.viseo.c360.competence.dto.collaborator.CollaboratorDescription;

import javax.inject.Inject;
import java.util.UUID;

/**
 * Created by SJO3662 on 24/08/2017.
 */
public class ConnectionMessage {

    @Inject
    private CollaboratorDescription collaboratorDescription;

    UUID Sequence;

    private String nameFileResponse;

    public CollaboratorDescription getCollaboratorDescription() {
        return collaboratorDescription;
    }

    public ConnectionMessage setCollaboratorDescription(CollaboratorDescription collaboratorDescription) {
        this.collaboratorDescription = collaboratorDescription;
        return this;
    }

    public UUID getSequence() {
        return Sequence;
    }

    public ConnectionMessage setSequence(UUID sequence) {
        Sequence = sequence;
        return this;
    }

    public String getNameFileResponse() {
        return nameFileResponse;
    }

    public ConnectionMessage setNameFileResponse(String nameFileResponse) {
        this.nameFileResponse = nameFileResponse;
        return this;
    }
}
