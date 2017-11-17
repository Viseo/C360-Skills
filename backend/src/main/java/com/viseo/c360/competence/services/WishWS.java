package com.viseo.c360.competence.services;

import com.viseo.c360.competence.config.ServerConfig;
import com.viseo.c360.competence.converters.skill.DescriptionToWish;
import com.viseo.c360.competence.converters.skill.WishToDescription;
import com.viseo.c360.competence.dao.WishDAO;
import com.viseo.c360.competence.dto.skill.WishDescription;
import com.viseo.c360.competence.exceptions.C360Exception;
import com.viseo.c360.competence.exceptions.dao.UniqueFieldException;
import com.viseo.c360.competence.exceptions.dao.util.ExceptionUtil;
import com.viseo.c360.competence.exceptions.dao.util.UniqueFieldErrors;
import org.springframework.core.convert.ConversionException;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.persistence.PersistenceException;
import java.util.List;

/**
 * Created by NBE3663 on 26/06/2017.
 */
@RestController
public class WishWS {

    @Inject
    WishDAO wishDAO;

    @Inject
    ExceptionUtil exceptionUtil;

    @CrossOrigin (origins =  ServerConfig.adress)
    @RequestMapping(value = "${endpoint.addwish}", method = RequestMethod.POST)
    @ResponseBody
    public Boolean addWishes(@RequestBody WishDescription wishDescription) {
        try {
            if (!wishDAO.checkIfWishExistByLabel(wishDescription.getLabel())) {
                wishDAO.addWish(new DescriptionToWish().convert(wishDescription));
                return true;
            } else {
                return false;
            }

        } catch (PersistenceException pe) {
            UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
            if (uniqueFieldErrors == null) throw new C360Exception(pe);
            else throw new UniqueFieldException(uniqueFieldErrors.getField());
        }
    }

    @CrossOrigin (origins =  ServerConfig.adress)
    @RequestMapping(value = "${endpoint.wishes}", method = RequestMethod.GET)
    @ResponseBody
    public List<WishDescription> getAllWishes() {
        try {
            return new WishToDescription().convert(wishDAO.getAllWishes());

        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @CrossOrigin (origins =  ServerConfig.adress)
    @RequestMapping(value = "${endpoint.removewish}", method = RequestMethod.POST)
    @ResponseBody
    public boolean removeWish(@RequestBody WishDescription wishDescription) {
        try {
            wishDAO.removeWish(new DescriptionToWish().convert(wishDescription));
            return true;
        } catch (PersistenceException pe) {
            UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
            if (uniqueFieldErrors == null) throw new C360Exception(pe);
            else throw new UniqueFieldException(uniqueFieldErrors.getField());
        }
    }


}
