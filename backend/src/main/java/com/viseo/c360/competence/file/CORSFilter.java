package com.viseo.c360.competence.file;

import org.springframework.context.annotation.Configuration;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

//@Configuration
public class CORSFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}

    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        System.out.println("CORSFilter Request :" + request.getMethod());

                HttpServletResponse resp = (HttpServletResponse) servletResponse;
        //resp.addHeader("Access-Control-Allow-Origin","http://localhost:8081");
        //resp.addHeader("Access-Control-Allow-Methods","GET,PUT,POST,DELETE,PATCH,OPTIONS");
        //resp.addHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
        //resp.addHeader("Access-Control-Allow-Credentials", "true");

        // Just ACCEPT and REPLY OK if OPTIONS
        if ( request.getMethod().equals("OPTIONS") ) {
            resp.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        chain.doFilter(request, servletResponse);
    }

    @Override
    public void destroy() {}
}