/**
 * Created by CLH3623 on 30/06/2017.
 */
import Vue from 'vue'
import axios from 'axios'
import config from '@/config/config'
import AddSkillsPage from '@/components/pages/addSkillsPage'
import MockAdapter from 'axios-mock-adapter'

var Constructor = Vue.extend(AddSkillsPage);
var vmAddSkillsPage;

var mock = new MockAdapter(axios);

describe('test addSkillsPage.vue', function() {
  beforeEach(function () {
    vmAddSkillsPage = new Constructor().$mount();
    mock = new MockAdapter(axios);
  });

  afterEach(function () {
    Object.assign(vmAddSkillsPage.$data, vmAddSkillsPage.$options.data());
  });

  it('should get all skills', function(done){
    let allSkills =  [
      {"id":4,"version":0,"label":"C++"},
      {"id":5,"version":0,"label":"CSS"},
      {"id":14,"version":0,"label":"HTML"},
      {"id":15,"version":0,"label":"Java"},
      {"id":2,"version":0,"label":"Android"}
    ];
    mock.onGet(config.server + "/api/skills/").reply(200, allSkills);
    var containerSVG = document.createElement('div');
    containerSVG.setAttribute("id",'svg-container');
    document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(containerSVG);
     vmAddSkillsPage.getAllSkills();
     setTimeout(function() {
       expect(vmAddSkillsPage.skills.length).toBe(5);
       expect(vmAddSkillsPage.skills[0].label).toBe("Android");
       expect(containerSVG.style.height).toBe("360px");
       done();
     },0)
  });

  it('should fail to get all skills and links', function() {
    mock.onGet(config.server + "/api/skills/").reply(400);
    expect(vmAddSkillsPage.skills.length).toBe(0);

    mock.onGet(config.server + "/api/links/").reply(400);
    expect(vmAddSkillsPage.links.length).toBe(0);
  });

  it('should get all links', function (done) {
    let allLinks = [{
      "id": 28,
      "version": 0,
      "skill1": {"id": 25, "version": 0, "label": "Karma"},
      "skill2": {"id": 24, "version": 0, "label": "TDD"}
    }, {
      "id": 27,
      "version": 0,
      "skill1": {"id": 21, "version": 0, "label": "HTML"},
      "skill2": {"id": 20, "version": 0, "label": "CSS"}
    }, {
      "id": 26,
      "version": 0,
      "skill1": {"id": 23, "version": 0, "label": "Tests"},
      "skill2": {"id": 24, "version": 0, "label": "TDD"}
    }];

    mock.onGet(config.server + "/api/links/").reply(200, allLinks);
    vmAddSkillsPage.getAllLinks();
    setTimeout(function () {
      expect(vmAddSkillsPage.showCross).toBe(false);
      expect(vmAddSkillsPage.links[0].skill1.label).toBe("Tests");
      expect(vmAddSkillsPage.links.length).toBe(3);
      done();
    }, 0)
  });

  it('should remove the selected skill', function(done) {
    let allSkills = [
      {"id":4,"version":0,"label":"C++"},
      {"id":5,"version":0,"label":"CSS"},
      {"id":14,"version":0,"label":"HTML"},
      {"id":15,"version":0,"label":"Java"},
      {"id":2,"version":0,"label":"Android"}
    ];
    vmAddSkillsPage.skills = allSkills;
    vmAddSkillsPage.selectedSkill.skill1 = allSkills[0];
    mock.onPost(config.server + '/api/removeskill').reply(200);
    vmAddSkillsPage.removeSkill();
    setTimeout(function() {
      expect(vmAddSkillsPage.selectedSkill.skill1).toBe('');
      expect(vmAddSkillsPage.selectedSkill.skill2).toBe('');
      done();
    },0);
  });

  it('should remove the selected link', function() {
    mock.onPost(config.server + '/api/removelink').reply(200);
    vmAddSkillsPage.removeLink();
  });

  it('should fail to remove links and skills', function() {
    mock.onPost(config.server + '/api/removeskill').reply(400);
    vmAddSkillsPage.removeSkill();
    mock.onPost(config.server + '/api/removelink').reply(400);
    vmAddSkillsPage.removeLink();

  })
});
