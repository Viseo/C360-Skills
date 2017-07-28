package com.viseo.c360.competence.amqp;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by BBA3616 on 28/07/2017.
 */
public class ConsumerMessageHandler {

    public List<String> handleMessage(String request) {
        System.out.println("Message Received at consumer end  : " + request);

        List<String> list = new ArrayList<String>();
        list.add("Hello.....");
        list.add("This is my response de C360_Skills....");
        list.add(request);

        return list;

    }
}