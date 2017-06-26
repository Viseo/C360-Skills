package com.viseo.c360.competence.dao;

import com.viseo.c360.competence.dao.db.DAOFacade;
import com.viseo.c360.competence.domain.skill.Wish;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.persistence.PersistenceException;
import java.util.List;

import static com.viseo.c360.competence.dao.db.DAOFacade.Parameter.param;

/**
 * Created by NBE3663 on 26/06/2017.
 */
@Repository
public class WishDAO {
    @Inject
    DAOFacade daoFacade;

    @Transactional
    public Wish addWish(Wish wish) throws PersistenceException {
        daoFacade.persist(wish);
        daoFacade.flush();
        return wish;
    }

    @Transactional
    public List<Wish> getAllWishes() {
        return daoFacade.getList("select w from Wish w");
    }

    @Transactional
    public boolean checkIfWishExistByLabel(String label) {
        List<Wish> wish = daoFacade.getList("select w from Wish w where w.label = :label",
                param("label", label));
        if (wish.size() != 0) {
            return true;
        } else {
            return false;
        }
    }

}
