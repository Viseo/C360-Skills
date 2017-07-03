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
        int globalScore = expertise.getLevel();

        List<Link> links = this.getAllLinksBySkill(expertise.getSkill());
        List<Skill> skills = new ArrayList<>();
        for (int i = 0; i < links.size(); i++) {
            if (links.get(i).getSkill1() == expertise.getSkill()) {
                skills.add(links.get(i).getSkill2());
            } else {
                skills.add(links.get(i).getSkill1());
            }
        }
        System.out.println(links);
        System.out.println(skills);

        Collaborator collaborator = expertise.getCollaborator();
        List<Expertise> expertises = this.getExpertiseByCollab(collaborator);
        for (int j = 0; j < expertises.size(); j++) {
            if (skills.contains(expertises.get(j).getSkill())) {
                Expertise tmp = daoFacade.merge(expertises.get(j));
                if ((globalScore >= 3) && (tmp.getLevel() < globalScore - 2)) {
                    tmp.setLevel(globalScore - 2);
                    daoFacade.flush();
                    if (globalScore == 5) {
                        this.updateExpertise(tmp);
                    }
                }
            }
        }
        daoFacade.flush();
        return expertise;
    }

    @Transactional
    public List<Link> getAllLinksBySkill(Skill skill) {
        daoFacade.getList("select l from Link l left outer join fetch l.skill1 where l.skill1.id = :skill OR l.skill2.id = :skill", param("skill", skill.getId()));
        return daoFacade.getList("select l from Link l left outer join fetch l.skill2 where l.skill1.id = :skill OR l.skill2.id = :skill", param("skill", skill.getId()));
    }

    @Transactional
    public List<Expertise> getExpertiseByCollab(Collaborator collaborator) {
        daoFacade.getList("select e from Expertise e left outer join fetch e.skill where e.collaborator.id = :collaborator AND e.isNoted = false", param("collaborator", collaborator.getId()));
        return daoFacade.getList("select e from Expertise e left outer join fetch e.collaborator where e.collaborator.id = :collaborator AND e.isNoted = false", param("collaborator", collaborator.getId()));
    }

    @Transactional
    public List<Expertise> getAllExpertises(Collaborator collaborator) {
        daoFacade.getList("select e from Expertise e left outer join fetch e.skill where e.collaborator.id =:collaborator",param("collaborator",collaborator.getId()));
        return daoFacade.getList("select e from Expertise e left outer join fetch e.collaborator where e.collaborator.id =:collaborator",param("collaborator",collaborator.getId()));
    }
}
