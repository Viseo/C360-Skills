package com.viseo.c360.competence.file;

/**
 * Created by BBA3616 on 22/05/2017.
 */

import org.springframework.web.bind.annotation.CrossOrigin;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
@CrossOrigin
@WebServlet("/fileUpload")
@MultipartConfig(fileSizeThreshold = 1024 * 1024 * 1, // 1 MB
        maxFileSize = 1024 * 1024 * 5, // 5 MB
        maxRequestSize = 1024 * 1024 * 10)
// 10 MB
public class FileUploadController extends HttpServlet {

    private static final long serialVersionUID = 1L;
    @CrossOrigin
    protected void setServerResponse(HttpServletResponse response,String successMessage) throws IOException {
        try {
        response.getWriter().print(successMessage);
        System.out.println(successMessage);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    @CrossOrigin
    protected void createImage(Part image, String Path) throws IOException {
        try {
            image.write(Path);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    @CrossOrigin
    protected String getCurrentPath(){
        URL resource = null;
        try {
            resource = new URL("/"+System.getProperty("catalina.base").replaceAll("\\\\", "/"));
            System.out.println("AAAAAAAAAAAAAA");

        } catch (MalformedURLException e) {
            System.out.println("OOOOOOOOOOOOOOO");
            e.printStackTrace();
        }
        return resource.getPath();
    }
    @CrossOrigin
    protected boolean isMimeTypeImage(Part image){
        String mimeType = image.getContentType().split("/")[0];
        return mimeType.equals("image");
    }
    @CrossOrigin
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Part imageCollaborator = request.getPart("file");
        String idCollaborator = request.getParameter("idCollaborator");
        System.out.println(getCurrentPath());
        String imgPath = getCurrentPath();
        String imageName = idCollaborator + ".jpg";

        if(isMimeTypeImage(imageCollaborator)) {
            createImage(imageCollaborator, imgPath + imageName);
            setServerResponse(response, "Upload/Update profil image successfully, id skill:"+idCollaborator+"\n");
        }
        else{
            response.sendError(404,"File MimeType is not an image");
        }
    }

}