package com.viseo.c360.competence.config;

import com.viseo.c360.competence.security.JwtAuthenticationEntryPoint;
import com.viseo.c360.competence.security.JwtAuthenticationProvider;
import com.viseo.c360.competence.security.JwtAuthenticationSuccessHandler;
import com.viseo.c360.competence.security.JwtAuthenticationTokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.regex.Pattern;

/**
 * Created by YGU3747 on 10/11/2017
 */
@Configuration
@EnableWebSecurity
@ComponentScan("com.viseo.c360.competence")
//@EnableAutoConfiguration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter{

    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;

    @Autowired
    private JwtAuthenticationProvider authenticationProvider;

    @Bean
    @Override
    public AuthenticationManager authenticationManager() throws Exception {
        return new ProviderManager(Arrays.asList(authenticationProvider));
    }

    @Bean
    public JwtAuthenticationTokenFilter authenticationTokenFilterBean() throws Exception{
        JwtAuthenticationTokenFilter authenticationTokenFilter = new JwtAuthenticationTokenFilter();
        authenticationTokenFilter.setAuthenticationManager(authenticationManager());
        authenticationTokenFilter.setAuthenticationSuccessHandler(new JwtAuthenticationSuccessHandler());
        return authenticationTokenFilter;
    }

    @Override
    protected void configure (HttpSecurity httpSecurity) throws Exception{

        RequestMatcher requestMatcher = new RequestMatcher() {

            // Always allow the HTTP OPTIONS method
            private Pattern allowedMethods = Pattern.compile("^OPTIONS$");

            // Disable CSFR protection on the following urls:
            private AntPathRequestMatcher[] requestMatchers = {
                    new AntPathRequestMatcher("/login"),
                    new AntPathRequestMatcher("/api/user/**"),
                    new AntPathRequestMatcher("/api/sendtoken/**")
            };

            @Override
            public boolean matches(HttpServletRequest request) {

                // If the request match one url the CSFR protection will be disabled
                for (AntPathRequestMatcher rm : requestMatchers) {
                    if (rm.matches(request)) { return false; }
                }

                if (new AntPathRequestMatcher("/api/**").matches(request)
                        && allowedMethods.matcher(request.getMethod()).matches()){
                    //disable protection for OPTIONS request of api
                    return false;
                }

                if (new AntPathRequestMatcher("/api/collaborateurs").matches(request)
                        && Pattern.compile("^POST$").matcher(request.getMethod()).matches())
                {
                    // allow register action no token
                    return false;
                }

                return true;
            } // method matches

        };

        httpSecurity
                // we don't need CSRF because our token is invulnerable
                .csrf().disable()

                .requestMatcher(requestMatcher).authorizeRequests()
                    .and()
               /* .antMatcher("/api/**").authorizeRequests().anyRequest().authenticated()
                    .and()

                */
                .formLogin()
                    .loginPage("/login").permitAll()
                    .and()

                // Call our errorHandler if authentication/authorisation fails
                .exceptionHandling()
                    .authenticationEntryPoint(unauthorizedHandler)
                    .and()
                // don't create session
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        // Custom JWT based security filter
        httpSecurity
                .addFilterBefore(authenticationTokenFilterBean(), UsernamePasswordAuthenticationFilter.class);
        // disable page caching
        httpSecurity.headers().cacheControl();
    }

/*
    @Override
    public void configure(WebSecurity web) throws Exception {

        web.ignoring().antMatchers("/api/user/**", "/api/sendtoken/**");
        web.ignoring().antMatchers(HttpMethod.OPTIONS, "/api/**");

        //web.ignoring().anyRequest();
    }
    */


}
