/**
 * Created by HBO3676 on 05/07/2017.
 */
import Vue from 'vue'
import axios from 'axios'
import config from '@/config/config'
import findSkill from '@/components/pages/findSkill.vue'
import MockAdapter from 'axios-mock-adapter'
import Vuex from 'vuex'
import storeVuex from '@/vuex/store'

Vue.use(Vuex);


var mock = new MockAdapter(axios);

var vmfindSkill;

describe('Test findSkill', function () {
  const vm = new Vue({
    template: '<div><findSkill></findSkill></div>',
    components: {
      'findSkill': findSkill
    },
    store: storeVuex
  }).$mount();
  let collaboratorToken = "eyJhbGciOiJIUzUxMiJ9.eyJmaXJzdE5hbWUiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJpc0FkbWluIjpmYWxzZSwiaWQiOjEsImVtYWlsIjoibGhvdGVAdmlzZW8uY29tIiwidmVyc2lvbiI6MCwiZGVmYXVsdHBpY3R1cmUiOnRydWV9.eguO54P8MHmWrwSREJu5-vCHkhA2Tj995efuHc4twdw";

  beforeEach(function () {
    vmfindSkill = vm.$children[0];

    mock = new MockAdapter(axios);
  });

  afterEach(function () {
    Object.assign(vmfindSkill.$data, vmfindSkill.$options.data());
  });
  it("should return uppercase value",function () {
    vmfindSkill.value = 'hello';
    expect(vmfindSkill.capitalizeSearch).toBe("HELLO");
  });
  it("should return null value",function () {
    vmfindSkill.value = null;
    expect(vmfindSkill.capitalizeSearch).toBe(null);
  });

  it("should get skills from database",function (done) {
    let skills = [{id:1,label:'JAVA',version:0},{id:2,label:'C++',version:0},{id:3,label:'JAVASCRIPT',version:0}]
    mock.onGet(config.server + "/api/skills").reply(200, skills);
    vmfindSkill.checkSkillsFromDatabase();
    setTimeout(function () {
      expect(vmfindSkill.skills.length).toBe(3);
      expect(vmfindSkill.allSkillsName.length).toBe(3);
      done();
    }, 0)
  });

  it("should find the skills containing the search value",function (done) {
    let skills = [{id:1,label:'JAVA',version:0},{id:2,label:'C++',version:0},{id:3,label:'JAVASCRIPT',version:0}]
    mock.onGet(config.server + "/api/skills").reply(200, skills);
    vmfindSkill.checkSkillsFromDatabase();
    setTimeout(function () {
      console.log(vmfindSkill.skills);
      vmfindSkill.storeSkillsFound('JAVA');
      expect(vmfindSkill.skillsFound.length).toBe(2);
      done();
    }, 0)
  });

  it("shouldn't find the skills containing the search value and stock it",function (done) {
    let skills = [{id:1,label:'JAVA',version:0},{id:2,label:'C++',version:0},{id:3,label:'JAVASCRIPT',version:0}]
    mock.onGet(config.server + "/api/skills").reply(200, skills);
    vmfindSkill.checkSkillsFromDatabase();
    setTimeout(function () {
      console.log(vmfindSkill.skills);
      vmfindSkill.value='HAHA';
      vmfindSkill.storeSkillsFound('HAHA');
      expect(vmfindSkill.skillsFound.length).toBe(0);
      expect(vmfindSkill.valueStock).toBe('HAHA');
      done();
    }, 0)
  });

  it("should send wish to database",function (done) {
    let wish = {"label": "Android"};
    vmfindSkill.value = 'Android';
    mock.onPost(config.server + "/api/addwish").reply(200, wish);
    vmfindSkill.sendWish('Android');
    setTimeout(function () {
      expect(vmfindSkill.savedValue).toEqual("");
      expect(vmfindSkill.wishSent).toBe(false);
      done();
    },3005);
  });

  it("should fail to send wish to database",function (done) {
    vmfindSkill.valueStock = 'Android';
    mock.onPost(config.server + "/api/addwish").reply(400);
    vmfindSkill.sendWish('Android');
    setTimeout(function () {
      expect(vmfindSkill.savedValue).toEqual("");
      done();
    },0);
  });

  /*it("should store the value",function (done) {
    vmfindSkill.value = 'JAVA';
    setTimeout(function () {
      expect(vmfindSkill.savedValue).toEqual(vmfindSkill.value);
      done();
    })
  });*/



  });

