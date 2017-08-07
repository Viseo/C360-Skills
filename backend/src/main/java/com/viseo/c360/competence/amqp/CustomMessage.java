package com.viseo.c360.competence.amqp;

/**
 * Created by SJO3662 on 27/07/2017.
 */

public class CustomMessage {

    private int id;
    private String name;

    public CustomMessage(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return "CustomMessage{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
