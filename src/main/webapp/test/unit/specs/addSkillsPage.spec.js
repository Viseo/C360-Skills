/**
 * Created by CLH3623 on 30/06/2017.
 * Created by SJO3662 on 30/06/2017.
 */
import Vue from 'vue'
import axios from 'axios'
import config from '@/config/config'
import AddSkillsPage from '@/components/pages/addSkillsPage'
import MockAdapter from 'axios-mock-adapter'
require('jasmine-ajax');


var Constructor = Vue.extend(AddSkillsPage);
var vmAddSkillsPage;

var mock = new MockAdapter(axios);

describe('test addSkillsPage.vue', function() {
  let collaboratorToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg";
  beforeEach(function () {
    vmAddSkillsPage = new Constructor().$mount();
    mock = new MockAdapter(axios);
  });

  afterEach(function () {
    Object.assign(vmAddSkillsPage.$data, vmAddSkillsPage.$options.data());

  });

  it('should verify if show circle is blur when the skill is selected',function () {
    var id = 1;
    vmAddSkillsPage.selectedSkill = {
      skill1: {id:1,label:'JAVA',version:0},
      skill2: {id:2,label:'J2EE',version:0}
    };
   expect(vmAddSkillsPage.showCircleBlurOrNot(id)).toBe(true);
  });

  it('should verify if show circle is not blur when the skill is not selected',function () {
    var id = 2;
    vmAddSkillsPage.selectedSkill = {
      skill1: {id:1,label:'JAVA',version:0},
      skill2: {id:2,label:'JAVA',version:0}
    };
    expect(vmAddSkillsPage.showCircleBlurOrNot(id)).toBe(false);
  });

  it('should displayInput',function () {
    vmAddSkillsPage.displayInput();
    expect(vmAddSkillsPage.newSkillClicked).toBe(true);
    expect(vmAddSkillsPage.label).toEqual('');
  });

  it('should hide Input when the label have skill',function () {
    vmAddSkillsPage.label = 'JAVA';
    vmAddSkillsPage.hideInput();
    expect(vmAddSkillsPage.newSkillClicked).toBe(false);
    expect(vmAddSkillsPage.label).toEqual('JAVA');
  });

  it('should hide Input when the label is empty',function () {
    vmAddSkillsPage.label = '';
    vmAddSkillsPage.hideInput();
    expect(vmAddSkillsPage.newSkillClicked).toBe(false);
    expect(vmAddSkillsPage.label).toEqual('Nouvelle');
  });

  it('should link PositionX when selected link is empty',function () {
    vmAddSkillsPage.selectedlink = '';
    expect(vmAddSkillsPage.linkPositionX()).toEqual(0);
  });

  it('should link PositionX when selected link is not empty',function () {

    vmAddSkillsPage.selectedlink = {
      id:10,
      skill1: {id:1,label:'JAVA',version:0},
      skill2: {id:2,label:'J2EE',version:0},
      version:0
    };

    expect(vmAddSkillsPage.linkPositionX()).not.toEqual(0);
  });

  it('should link PositionY when selected link is empty',function () {
    vmAddSkillsPage.selectedlink = '';
    console.log(vmAddSkillsPage.linkPositionY());
    expect(vmAddSkillsPage.linkPositionY()).toEqual(0);
  });

  it('should link PositionY when selected link is not empty',function () {

    vmAddSkillsPage.selectedlink = {
      id:10,
      skill1: {id:1,label:'JAVA',version:0},
      skill2: {id:2,label:'J2EE',version:0},
      version:0
    };

    expect(vmAddSkillsPage.linkPositionY()).not.toEqual(0);
  });

  it('should check if add a new circle',function () {
    vmAddSkillsPage.label = "JAVA";
    vmAddSkillsPage.addCircle();

    expect(vmAddSkillsPage.newSkillClicked).toBe(false);
    expect(vmAddSkillsPage.label).toEqual('Nouvelle');
  });

  it('should check if not add circle',function () {
    vmAddSkillsPage.label = "";
    vmAddSkillsPage.addCircle();

    expect(vmAddSkillsPage.newSkillClicked).toBe(false);
    expect(vmAddSkillsPage.label).toEqual('');
  });

  it('should check showIcon',function () {
    var skillId = 1;
    vmAddSkillsPage.selectedSkill = {
      skill1: {id:1,label:'JAVA',version:0},
      skill2: {id:2,label:'J2EE',version:0}
    };

    expect(vmAddSkillsPage.showIcon(skillId)).toBe(true);
  });

  it('should check showIcon',function () {
    var skillId = 2;
    vmAddSkillsPage.selectedSkill = {
      skill1: {id:1,label:'JAVA',version:0},
      skill2: {id:2,label:'J2EE',version:0}
    };

    expect(vmAddSkillsPage.showIcon(skillId)).toBe(false);
  });

  it('should check showIcon',function () {
    vmAddSkillsPage.skills = [
      {id:1,label:'JAVA',version:0},
      {id:2,label:'J2EE',version:0},
    ];

    vmAddSkillsPage.selectedSkill = {
      skill1: {id:1,label:'JAVA',version:0},
      skill2: {id:2,label:'JAVA',version:0}
    };
    vmAddSkillsPage.cancelUpdate();

    expect(vmAddSkillsPage.selectedSkill.skill1).toEqual('');
  });


  it('should get all skills', function(done){
    let allSkills =  [
      {"id":4,"version":0,"label":"C++"},
      {"id":5,"version":0,"label":"CSS"},
      {"id":18,"version":0,"label":"HTML"},
      {"id":15,"version":0,"label":"Java"},
      {"id":2,"version":0,"label":"Android"}
    ];
    mock.onGet(config.server + "/api/skills/").reply(200, allSkills);
    // let containerSVG = vmAddSkillsPage.$el.querySelector('.svg-container');
    // document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(containerSVG);
    vmAddSkillsPage.getAllSkills();
    setTimeout(function() {
      expect(vmAddSkillsPage.skills.length).toBe(5);
      expect(vmAddSkillsPage.skills[0].label).toBe("Android");
      expect(vmAddSkillsPage.myViewBox).toEqual("0 0 1250 200");
     // expect(containerSVG.style.height).toBe("360px");
      done();
    },0)
  });

  it('should fail to get all skills and links', function() {
    mock.onGet(config.server + "/api/skills/").reply(500);
    expect(vmAddSkillsPage.skills.length).toBe(0);

    mock.onGet(config.server + "/api/links/").reply(500);
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

  });

  it('should check if one skill is not selected',function () {
    vmAddSkillsPage.selectedSkill = {
      skill1: '',
      skill2: ''
    };
    var skill = {id:1,label:'JAVA',version:0};

    let containerSVG = vmAddSkillsPage.$el.querySelector('g');
    document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(containerSVG);

    vmAddSkillsPage.selectSkill(skill);
    expect(vmAddSkillsPage.selectedSkill.skill1).toEqual(skill);
  });

  it('should check if one skill is selected and add in database with response success',function () {
    vmAddSkillsPage.selectedSkill = {
      skill1: {id:1,label:'J2EE',version:0},
      skill2: ''
    };
    var skill = {id:2,label:'JAVA',version:0};

    let containerSVG = vmAddSkillsPage.$el.querySelector('g');
    document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(containerSVG);

    mock.onPost(config.server + '/api/addlink').reply(200);
    vmAddSkillsPage.selectSkill(skill);
    expect(vmAddSkillsPage.selectedSkill.skill2).toEqual(skill);
  });

  it('should check if one skill is selected and add in database with response error',function (done) {
    vmAddSkillsPage.selectedSkill = {
      skill1: {id:1,label:'J2EE',version:0},
      skill2: ''
    };
    var skill = {id:2,label:'JAVA',version:0};

    let containerSVG = vmAddSkillsPage.$el.querySelector('g');
    document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(containerSVG);

    mock.onPost(config.server + '/api/addlink').reply(500);
    vmAddSkillsPage.selectSkill(skill);
    setTimeout(function() {
      expect(vmAddSkillsPage.selectedSkill.skill1).toEqual('');
      expect(vmAddSkillsPage.selectedSkill.skill2).toEqual('');
      done();
    },0);
  });

  it('should check if one skill is not selected',function (done) {
    vmAddSkillsPage.selectedSkill = {
      skill1: {id:2,label:'JAVA',version:0},
      skill2: ''
    };
    var skill = {id:2,label:'JAVA',version:0};

    vmAddSkillsPage.selectSkill(skill);
    setTimeout(function() {
      expect(vmAddSkillsPage.skillOldValue).toEqual(skill.label);
      done();
    },0);

  });

  it('should check add skill in database with response success',function (done) {
    mock.onPost(config.server + '/api/addskill/').reply(200);
    vmAddSkillsPage.addSkill();
    setTimeout(function() {
      done();
    },0);
  });

  it('should update skill with response success',function (done) {
    var skill = {id:2,label:'JAVA',version:0};
    mock.onPut(config.server + '/api/updateskill').reply(200);
    vmAddSkillsPage.updateSkill(skill);
    setTimeout(function() {
      expect(vmAddSkillsPage.selectedSkill.skill1).toEqual('');
      expect(vmAddSkillsPage.selectedSkill.skill2).toEqual('');
      done();
    },0);
  });

  it('should update skill with response error',function (done) {
    var skill = {id:2,label:'JAVA',version:0};
    mock.onPut(config.server + '/api/updateskill').reply(500);
    vmAddSkillsPage.updateSkill(skill);
    setTimeout(function() {
      done();
    },0);
  });

  it('should add a add wish', function(done) {
    var wish = {id:2,label:'JAVA',version:0};
    vmAddSkillsPage.addWish(wish);
    setTimeout(function () {
      expect(vmAddSkillsPage.label).toEqual('Nouvelle');
      done();
    });


  });

});
