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

  it('should fail to get all skills', function() {
    mock.onGet(config.server + "/api/skills/").reply(400);
  })
});
