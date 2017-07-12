import Vue from 'vue'
import axios from 'axios'
import config from '@/config/config'
import searchSkillCollabByAdmin from '@/components/pages/searchSkillCollabByAdmin'
import MockAdapter from 'axios-mock-adapter'
import storeVuex from '@/vuex/store'
import VueStrap from 'vue-strap'

var mock = new MockAdapter(axios);

var vmSearchSkillCollabByAdmin;
Vue.component('typeahead', VueStrap.typeahead);


fdescribe('Test searchSkillCollabByAdmin', function () {

  const vm = new Vue({
    template: '<div><searchSkillCollabByAdmin></searchSkillCollabByAdmin></div>',
    components: {
      'searchSkillCollabByAdmin': searchSkillCollabByAdmin
    },
    store: storeVuex
  }).$mount();


  let collaboratorToken = "eyJhbGciOiJIUzUxMiJ9.eyJmaXJzdE5hbWUiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJpc0FkbWluIjpmYWxzZSwiaWQiOjEsImVtYWlsIjoibGhvdGVAdmlzZW8uY29tIiwidmVyc2lvbiI6MCwiZGVmYXVsdHBpY3R1cmUiOnRydWV9.eguO54P8MHmWrwSREJu5-vCHkhA2Tj995efuHc4twdw";

  beforeEach(function () {
      vmSearchSkillCollabByAdmin = vm.$children[0];
    mock = new MockAdapter(axios);
    let allCollabs =
          [{"id":1, "version":0,"lastName":"Bourakkadi","firstName":"Hamza","email":"hamza.bourakkadi@gmail.com","defaultPicture":true},
              {"id":2,"version":0,"lastName":"Caroline","firstName":"Lhote","email":"caroline.lhote@gmail.com","defaultPicture":true}];
    let allSkills =  [
          {"id":4,"version":0,"label":"C++"},
          {"id":5,"version":0,"label":"CSS"},
          {"id":18,"version":0,"label":"HTML"},
          {"id":15,"version":0,"label":"Java"},
          {"id":2,"version":0,"label":"Android"}
      ];
    mock.onGet(config.server + "/api/collaborateurs").reply(200, allCollabs);
    mock.onGet(config.server + "/api/skills/").reply(200, allSkills);
  });

  afterEach(function () {
    Object.assign(vmSearchSkillCollabByAdmin.$data, vmSearchSkillCollabByAdmin.$options.data());
    storeVuex.commit('resetStore');
  });

  it('should check if specific collaborator and skills are displayed when administrator is typing some specifics letter in the typeahead', function () {
     console.log(vmSearchSkillCollabByAdmin.skills);
  });

  it('should check if only collaborators are displayed with profile picture when administrator is typing some specifics collaborator firstname/lastname in the typeahead', function () {

  });

  it('should check if only skills are displayed without profile picture when administrator is typing some specifics skills in the typeahead', function () {

  });

  it('should check if specific skill is highlighted when administrator click on a specifics skills in the typeahead', function () {

  });

  it('should check if specific skill and previous selected skills are highlighted when administrator click on a specifics skills in the typeahead', function () {

  });

  it('should check if specific collaborator is displayed in the panel with all his skills when administrator click on a specifics collaborator in the typeahead', function () {

  });

  it('should check if error message is displayed when administrator is searching a specific collaborator/skills and there is no matching', function () {

  });

  it('should check if error message is displayed when administrator is searching a specific collaborator and there is no collaborator matching', function () {

  });

  it('should check if error message is displayed when administrator is searching a specific skill and there is no skill matching', function () {

  });

  });
