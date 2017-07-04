import Vue from 'vue'
import axios from 'axios'
import config from '@/config/config'
import ShowSkillsCollab from '@/components/pages/showSkillsCollabPage'
import MockAdapter from 'axios-mock-adapter'
import Vuex from 'vuex'
import storeVuex from '@/vuex/store'

Vue.use(Vuex);
const store = new Vuex.Store(storeVuex);
require('jasmine-ajax');

var Constructor = Vue.extend(ShowSkillsCollab);
var vmShowSkillsCollab;

var mock = new MockAdapter(axios);

describe('Test showSkillCollab', function() {
  let collaboratorToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg";
  beforeEach(function () {
    vmShowSkillsCollab = new Constructor().$mount();
    mock = new MockAdapter(axios);
  });

  afterEach(function () {
    Object.assign(vmShowSkillsCollab.$data, vmShowSkillsCollab.$options.data());
  });

  it('should get collaborator info', function () {
    /*    storeVuex.getters.collaboratorLoggedIn.id = 1;
     storeVuex.store.getters.collaboratorLoggedIn.version = 0;
     storeVuex.store.getters.collaboratorLoggedIn.lastName = "Batista";
     storeVuex.store.getters.collaboratorLoggedIn.firstName = "Benjamin";
     storeVuex.store.getters.collaboratorLoggedIn.email = 'benjamin.batista@viseo.com';
     storeVuex.getters.collaboratorLoggedIn.defaultPicture = true;
     storeVuex.getters.collaboratorLoggedIn.llldefaultPicture = true;

     let collab = {
     id: 1,
     version: 0,
     lastName: 'Batista',
     firstName: 'Benjamin',
     email: 'benjamin.batista@viseo.com',
     defaultPicture: true
     };

     vmShowSkillsCollab.getCollabLogged();*/
     })

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
      vmShowSkillsCollab.getAllLinks();
      setTimeout(function () {
        expect(vmShowSkillsCollab.showCross).toBe(false);
        expect(vmShowSkillsCollab.links[0].skill1.label).toBe("Tests");
        expect(vmShowSkillsCollab.links.length).toBe(3);
        done();
      }, 0)
    });

    it('should return x position', function() {

    });

    it('should calculate x position for circles', function() {
      let xPosition = vmShowSkillsCollab.positionX(5);
      expect(xPosition).toBe(850);
    });

    it('should calculate y position for circles', function() {
      let yPosition = vmShowSkillsCollab.positionY(5);
      expect(yPosition).toBe(55);
      let yPositionThirdLine = vmShowSkillsCollab.positionY(22);
      expect(yPositionThirdLine).toBe(355);
    })

    it('should get all expertises', function(done) {
      vmShowSkillsCollab.collabLogged.id = 3;
      let allExpertises = [{
        "id": 21,
        "version": 1,
        "skill": {"id": 10, "version": 0, "label": "Tests"},
        "collaborator": {
          "id": 16,
          "version": 0,
          "lastName": "lhote",
          "firstName": "caroline",
          "email": "caroline.lhote@viseo.com",
          "defaultPicture": true
        },
        "level": 4,
        "noted": true
      }, {
        "id": 22,
        "version": 1,
        "skill": {"id": 12, "version": 0, "label": "Karma"},
        "collaborator": {
          "id": 16,
          "version": 0,
          "lastName": "lhote",
          "firstName": "caroline",
          "email": "caroline.lhote@viseo.com",
          "defaultPicture": true
        },
        "level": 2,
        "noted": false
      }]
      mock.onGet(config.server + '/api/getcollabexpertises/3').reply(200, allExpertises);
      vmShowSkillsCollab.getAllExpertise();
      setTimeout(function() {
        expect(vmShowSkillsCollab.expertises.length).toBe(2);
        expect(vmShowSkillsCollab.expertises[0].skill.label).toBe("Tests");
        done();
      },0)
    });

    it('should fail to get all expertises', function() {
      vmShowSkillsCollab.collabLogged.id = 3;
      mock.onGet(config.server + '/api/getcollabexpertises/3').reply(400);
      expect(vmShowSkillsCollab.expertises.length).toBe(0);
    });

  it('should show icons',function () {
    var skillId = 1;
    vmShowSkillsCollab.selectedSkill = {
      skill1: {id:1,label:'JAVA',version:0},
      skill2: {id:2,label:'J2EE',version:0}
    };
    expect(vmShowSkillsCollab.showIcon(skillId)).toBe(true);
  });

  it('should not show icons', function() {
    var skillId = 4;
    vmShowSkillsCollab.selectedSkill = {
      skill1: {id:1,label:'JAVA',version:0},
      skill2: {id:2,label:'J2EE',version:0}
    };
    expect(vmShowSkillsCollab.showIcon(skillId)).toBe(false);
  })

  });



