package com.viseo.c360.competence.dao;

import com.viseo.c360.competence.dao.db.DAOFacade;
import com.viseo.c360.competence.domain.collaborator.Collaborator;
import com.viseo.c360.competence.domain.collaborator.Expertise;
import com.viseo.c360.competence.domain.skill.Link;
import com.viseo.c360.competence.domain.skill.Skill;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.persistence.PersistenceException;
import java.util.ArrayList;
import java.util.List;

import static com.viseo.c360.competence.dao.db.DAOFacade.Parameter.param;

@Repository
public class ExpertiseDAO {
    @Inject
    DAOFacade daoFacade;

    @Transactional
    public Expertise addExpertise(Expertise expertise) throws PersistenceException {
        daoFacade.persist(expertise);
        daoFacade.flush();
        return expertise;
    }

    @Transactional
    public Expertise updateExpertise(Expertise expertise) throws PersistenceException {
        expertise = daoFacade.merge(expertise);
        List<Link> links = this.getAllLinksBySkill(expertise.getSkill());
        List<Skill> skills = new ArrayList<>();
        for(int i=0; i<links.size();i++){
            if(links.get(i).getSkill1() == expertise.getSkill()){
                skills.add(links.get(i).getSkill2());
            }else{
                skills.add(links.get(i).getSkill1());
            }
        }

        Collaborator collaborator = expertise.getCollaborator();
        List<Expertise> expertises =  this.getExpertiseByCollab(collaborator);
        for(int j=0; j<skills.size();j++){

        }
        daoFacade.flush();
        return expertise;
    }

    @Transactional
    public List<Link> getAllLinksBySkill(Skill skill) {
        daoFacade.getList("select l from Link l left outer join fetch l.skill1 where l.skill1 = :skill OR l.skill2 = :skill", param("skill", skill));
        return daoFacade.getList("select l from Link l left outer join fetch l.skill2 where l.skill2 = :skill OR l.skill2 = :skill", param("skill", skill));
    }

    @Transactional
    public List<Expertise> getExpertiseByCollab(Collaborator collaborator) {
        daoFacade.getList("select e from Expertise e left outer join fetch e.skill where e.collaborator = :collaborator", param("collaborator", collaborator));
        return daoFacade.getList("select e from Expertise e left outer join fetch e.collaborator where e.collaborator = :collaborator", param("collaborator", collaborator));
    }


}
