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

    @Transactional
    public void removeExpertisesBySkill(Skill skill){
         daoFacade.executeRequest("delete from Expertise e where e.skill.id =:skill",param("skill",skill.getId()));
    }

    @Transactional
    public List<Expertise> intersectionExpertises(List<Expertise> list1, List<Expertise> list2){
        List<Expertise> list3 = new ArrayList<>();
        for(int i=0 ; i<list1.size() ; i++){
            for(int j=0 ; j<list2.size(); j++){
                if (list2.get(j).getCollaborator() == list1.get(i).getCollaborator()){
                    list3.add(list2.get(j));
                    list3.add(list1.get(i));
                }
            }
        }
        return list3;
    }

    @Transactional
    public List<Expertise> getCollabsByExpertise (List<Expertise> list){

        daoFacade.getList("select e from Expertise e left outer join fetch e.skill where e.skill= :skill and e.level >= :level",
                param("skill", list.get(0).getSkill()), param("level", list.get(0).getLevel()));
        List<Expertise> result = daoFacade.getList("select e from Expertise e left outer join fetch e.collaborator where e.skill= :skill and e.level >= :level",
                param("skill", list.get(0).getSkill()), param("level", list.get(0).getLevel()));
        if(list.size()>1){
            for(int i=1; i<list.size(); i++){
                daoFacade.getList("select e from Expertise e left outer join fetch e.skill where e.skill= :skill and e.level >= :level",
                        param("skill", list.get(i).getSkill()), param("level", list.get(i).getLevel()));
                List<Expertise> tmp = daoFacade.getList("select e from Expertise e left outer join fetch e.collaborator where e.skill= :skill and e.level >= :level",
                        param("skill", list.get(i).getSkill()), param("level", list.get(i).getLevel()));
                result = this.intersectionExpertises(result, tmp);
            }
        }
        return result;

    }

    @Transactional
    public List<Expertise> getInductedExpertisesByCollaborators (List<Expertise> list){
        List<Expertise> listExpertise = new ArrayList();
        for(int i = 0; i<list.size(); i++){
            daoFacade.getList("select e from Expertise e, Link l left outer join fetch e.skill where (l.skill1 = :skill and l.skill2 = e.skill and e.collaborator = :collaborator and e.isNoted = false and e.level >0)" +
                    "or (l.skill2 = :skill and l.skill1 = e.skill and e.collaborator = :collaborator and e.isNoted = false and e.level >0)", param("skill", list.get(i).getSkill()),param("collaborator", list.get(i).getCollaborator()));
            List<Expertise> tmp = daoFacade.getList("select e from Expertise e, Link l left outer join fetch e.collaborator where (l.skill1 = :skill and l.skill2 = e.skill and e.collaborator = :collaborator and e.isNoted = false and e.level >0)" +
                            "or (l.skill2 = :skill and l.skill1 = e.skill and e.collaborator = :collaborator and e.isNoted = false and e.level >0)", param("skill", list.get(i).getSkill()),param("collaborator", list.get(i).getCollaborator()));
            for(int j = 0; j<tmp.size();j++){
                listExpertise.add(tmp.get(j));
            }
        }
        for(int i = 0; i<listExpertise.size();i++){
            for(int j = 0; j<list.size();j++){
                if(listExpertise.get(i).getSkill().getId() == list.get(j).getSkill().getId()){
                    listExpertise.remove(i);
                    i--;
                    break;
                }
            }
        }
        return  listExpertise;
    }

    @Transactional
    public boolean updateLink (Link link){
        System.out.println("LINK = " + link.getSkill1().getLabel() +link.getSkill2().getLabel());
        this.updateSkillLevel(link.getSkill1());
        this.updateSkillLevel(link.getSkill2());
        return true;
    }

    @Transactional
    public boolean updateSkillLevel (Skill skill){
        System.out.println("SKILL = " + skill.getLabel());
        List<Collaborator> listCollab = daoFacade.getList("select c from Collaborator c");
        System.out.println("Collab = " + listCollab);
        for(int i = 0; i<listCollab.size(); i++){
            List<Integer> maxScore = daoFacade.getList("select max(e.level) from Expertise e,Link l where e.collaborator.id = :collaborator and e.isNoted = true and ((l.skill1.id = :skill and e.skill.id = l.skill2.id) or (l.skill2.id = :skill and e.skill.id = l.skill1.id))",param("collaborator",listCollab.get(i).getId()),param("skill",skill.getId()));
            System.out.println("MAXSCORE = " + maxScore);
            if(maxScore.get(0) != null && maxScore.get(0) > 2){
                daoFacade.getList("select e from Expertise e left outer join fetch e.skill where e.collaborator.id = :collaborator and e.skill.id = :skill and e.isNoted = false",param("collaborator",listCollab.get(i).getId()),param("skill",skill.getId()));
                List<Expertise> tmp = daoFacade.getList("select e from Expertise e left outer join fetch e.collaborator where e.collaborator.id = :collaborator and e.skill.id = :skill and e.isNoted = false",param("collaborator",listCollab.get(i).getId()),param("skill",skill.getId()));
                System.out.println("tmp = " + tmp);
                if(tmp.size() != 0){
                    Expertise expertiseToUpdate = tmp.get(0);
                    if(expertiseToUpdate != null){
                        expertiseToUpdate = daoFacade.merge(expertiseToUpdate);
                        expertiseToUpdate.setLevel(maxScore.get(0) - 2);
                        daoFacade.flush();
                    }
                }
            }
        }
        return  true;
    }


}
