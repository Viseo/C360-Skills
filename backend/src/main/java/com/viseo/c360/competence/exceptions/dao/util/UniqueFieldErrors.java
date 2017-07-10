package com.viseo.c360.competence.exceptions.dao.util;

public enum UniqueFieldErrors {
    COLLABORATOR_ID_NUMBER_PERSISTED("personnalIdNumber"),
    COLLABORATOR_EMAIL_PERSISTED("email"),
    TRAINING_TITLE("trainingTitle"),
    TOPIC_NAME("name"),
    SKILL_LABEL("label");

    String field;

    UniqueFieldErrors(String field){
        this.field = field;
    }

    public String getField() {
        return field;
    }

    public boolean matches(String field){
        return field.toLowerCase().equals(this.field.toLowerCase());
    }
}
