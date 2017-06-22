package com.viseo.c360.competence.dao;

import com.viseo.c360.competence.dao.db.DAOFacade;
import com.viseo.c360.competence.domain.skill.Skill;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.persistence.PersistenceException;
import java.util.List;

import static com.viseo.c360.competence.dao.db.DAOFacade.Parameter.param;

/**
 * Created by HBO3676 on 15/06/2017.
 */
@Repository
public class SkillDAO {
    @Inject
    DAOFacade daoFacade;


    @Transactional
    public Skill addSkill(Skill skill) throws PersistenceException {
        daoFacade.persist(skill);
        daoFacade.flush();
        return skill;
    }
    @Transactional
    public Skill getSkillById(long id) throws PersistenceException{
        Skill skill = daoFacade.find(Skill.class,id);
        return skill;
    }


    @Transactional
    public Skill updateSkill(Skill skill) throws PersistenceException {
        skill = daoFacade.merge(skill);
        daoFacade.flush();
        return skill;
    }

    @Transactional
    public Skill removeSkill(Skill skill) throws PersistenceException{
        daoFacade.remove(skill);
        daoFacade.flush();
        return skill;
    }

    @Transactional
    public List<Skill> getAllSkills() {
        return daoFacade.getList("select s from Skill s left outer join fetch s.collaborators");
    }

    @Transactional
    public boolean getSkillByLabel(String label) {
        List<Skill> skill = daoFacade.getList("select s from Skill s left outer join fetch s.collaborators where s.label = :label",
                param("label", label));
        if(skill.size() != 0){
            return true;
        }else{
            return false;
        }
    }

}
