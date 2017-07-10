package com.viseo.c360.competence.dao;

import com.viseo.c360.competence.converters.collaborator.CollaboratorToIdentity;
import com.viseo.c360.competence.converters.collaborator.DescriptionToExpertise;
import com.viseo.c360.competence.converters.skill.SkillToDescription;
import com.viseo.c360.competence.dao.db.DAOFacade;
import com.viseo.c360.competence.domain.collaborator.Collaborator;
import com.viseo.c360.competence.domain.skill.Skill;
import com.viseo.c360.competence.dto.collaborator.ExpertiseDescription;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.persistence.FlushModeType;
import javax.persistence.PersistenceException;
import java.util.List;

import static com.viseo.c360.competence.dao.db.DAOFacade.Parameter.param;

@Repository
public class CollaboratorDAO {

    @Inject
    DAOFacade daoFacade;

    @Inject
    ExpertiseDAO expertiseDAO;

    @Inject
    SkillDAO skillDAO;


    //collaborateur
    @Transactional
    public Collaborator addCollaborator(Collaborator collaborator) throws PersistenceException {
        daoFacade.persist(collaborator);
        daoFacade.flush();
        List<Skill> skills = skillDAO.getAllSkills();
        for(int i = 0; i < skills.size(); i++){
            ExpertiseDescription tmp = new ExpertiseDescription();
            tmp.setCollaborator(new CollaboratorToIdentity().convert(collaborator));
            tmp.setSkill(new SkillToDescription().convert(skills.get(i)));
            tmp.setLevel(0);
            tmp.setNoted(false);
            expertiseDAO.addExpertise(new DescriptionToExpertise().convert(tmp));
        }
        return collaborator;
    }

    @Transactional
    public Collaborator updateCollaborator(Collaborator collaborator) throws PersistenceException {
        collaborator = daoFacade.merge(collaborator);
        daoFacade.flush();
        return collaborator;
    }

    public Collaborator getCollaboratorByLoginPassword(String personnalEmail, String personnalPassword) {
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        Collaborator registredUser =
                (Collaborator) daoFacade.getSingle(
                        "select c from Collaborator c where c.email = :personnalEmail and c.password = :personnalPassword",
                        param("personnalEmail", personnalEmail), param("personnalPassword", personnalPassword));
        return registredUser;
    }

    public Collaborator getCollaboratorByLogin(String personnalEmail) {
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        Collaborator registredUser =
                (Collaborator) daoFacade.getSingle(
                        "select c from Collaborator c where c.email = :personnalEmail",
                        param("personnalEmail", personnalEmail));
        return registredUser;
    }

    public Collaborator getCollaboratorById(Long collab_id) {
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        Collaborator registredUser =
                (Collaborator) daoFacade.getSingle(
                        "select c from Collaborator c where c.id = :id",
                        param("id", collab_id));
        return registredUser;
    }

    public List<Collaborator> getAllCollaborators() {
        return daoFacade.getList("select c from Collaborator c");
    }


    public Collaborator getCollaborator(long id) {
        return daoFacade.find(Collaborator.class, id);
    }


    @Transactional
    public Collaborator updateCollaboratorPassword(Collaborator collaborator, String collaboratorPassword) {

        collaborator = daoFacade.merge(collaborator);
        collaborator.setPassword(collaboratorPassword);
        daoFacade.flush();
        return collaborator;
    }


}

