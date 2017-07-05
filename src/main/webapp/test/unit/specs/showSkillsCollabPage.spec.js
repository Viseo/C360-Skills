import Vue from 'vue'
import axios from 'axios'
import config from '@/config/config'
import ShowSkillsCollab from '@/components/pages/showSkillsCollabPage'
import MockAdapter from 'axios-mock-adapter'
import Vuex from 'vuex'
import storeVuex from '@/vuex/store'

Vue.use(Vuex);

//var Constructor = Vue.extend(ShowSkillsCollab);
//var vmShowSkillsCollab;
var mock = new MockAdapter(axios);

var vmShowSkillsCollab;

describe('Test showSkillCollab', function () {
  const vm = new Vue({
    template: '<div><showSkillsCollab></showSkillsCollab></div>',
    components: {
      'showSkillsCollab': ShowSkillsCollab
    },
    store: storeVuex
  }).$mount();
  let collaboratorToken = "eyJhbGciOiJIUzUxMiJ9.eyJmaXJzdE5hbWUiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJpc0FkbWluIjpmYWxzZSwiaWQiOjEsImVtYWlsIjoibGhvdGVAdmlzZW8uY29tIiwidmVyc2lvbiI6MCwiZGVmYXVsdHBpY3R1cmUiOnRydWV9.eguO54P8MHmWrwSREJu5-vCHkhA2Tj995efuHc4twdw";

  beforeEach(function () {
    vmShowSkillsCollab = vm.$children[0];

    mock = new MockAdapter(axios);
  });

  afterEach(function () {
    Object.assign(vmShowSkillsCollab.$data, vmShowSkillsCollab.$options.data());
  });

  it('should get collaborator info', function () {
    storeVuex.commit('setTokenFromLocalStorage');
    console.log("storeVuex.state.token: " + storeVuex.state.token);
    console.log("storeVuex.getters.collaboratorLoggedIn: " + storeVuex.getters.collaboratorLoggedIn.id);
    console.log("vmCollab.posX: " + vmShowSkillsCollab.posX);
    vmShowSkillsCollab.getCollabLogged();
    expect(vmShowSkillsCollab.collabLogged.id).toEqual(1);
    expect(vmShowSkillsCollab.collabLogged.version).toEqual(0);
    expect(vmShowSkillsCollab.collabLogged.lastName).toEqual('Lhote');
    expect(vmShowSkillsCollab.collabLogged.firstName).toEqual('Caroline');
    expect(vmShowSkillsCollab.collabLogged.email).toEqual('lhote@viseo.com');
    expect(vmShowSkillsCollab.collabLogged.defaultPicture).toEqual(undefined);
  });

  it('should update all expertise and all links', function () {
    vmShowSkillsCollab.updateAll();
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
    vmShowSkillsCollab.getAllLinks();
    setTimeout(function () {
      expect(vmShowSkillsCollab.showCross).toBe(false);
      expect(vmShowSkillsCollab.links[0].skill1.label).toBe("Tests");
      expect(vmShowSkillsCollab.links.length).toBe(3);
      done();
    }, 0)
  });

  it('should return x position', function () {

  });

  it('should calculate x position for circles', function () {
    let xPosition = vmShowSkillsCollab.positionX(5);
    expect(xPosition).toBe(850);
  });

  it('should calculate y position for circles', function () {
    let yPosition = vmShowSkillsCollab.positionY(5);
    expect(yPosition).toBe(55);
    let yPositionThirdLine = vmShowSkillsCollab.positionY(22);
    expect(yPositionThirdLine).toBe(355);
  });

  it('should get all expertises', function (done) {
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
    setTimeout(function () {
      expect(vmShowSkillsCollab.expertises.length).toBe(2);
      expect(vmShowSkillsCollab.expertises[0].skill.label).toBe("Tests");
      done();
    }, 0)
  });

  it('should fail to get all expertises', function () {
    vmShowSkillsCollab.collabLogged.id = 3;
    mock.onGet(config.server + '/api/getcollabexpertises/3').reply(500);
    vmShowSkillsCollab.getAllExpertise();
    expect(vmShowSkillsCollab.expertises.length).toBe(0);
  });


  it('should show icons', function () {
    var skillId = 1;
    vmShowSkillsCollab.selectedSkill = {
      skill1: {id: 1, label: 'JAVA', version: 0},
      skill2: {id: 2, label: 'J2EE', version: 0}
    };
    expect(vmShowSkillsCollab.showIcon(skillId)).toBe(true);
  });

  it('should not show icons', function () {
    var skillId = 4;
    vmShowSkillsCollab.selectedSkill = {
      skill1: {id: 1, label: 'JAVA', version: 0},
      skill2: {id: 2, label: 'J2EE', version: 0}
    };
    expect(vmShowSkillsCollab.showIcon(skillId)).toBe(false);
  });

  it('should check wait for element to display', function () {
    var id = 4;

    let containerSVG = vmShowSkillsCollab.$el.querySelector('g');
    document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(containerSVG);

    console.log(vmShowSkillsCollab.waitForElementToDisplay(id, 0, "cx"));
    //expect(vmShowSkillsCollab.showIcon(skillId)).toBe(false);
  })

});



