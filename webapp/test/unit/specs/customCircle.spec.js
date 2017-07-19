/**
 * Created by SJO3662 on 29/06/2017.
 */
import Vue from 'vue'
import CustomCircle from '@/components/customComponent/customcircle'
import axios from 'axios'
import config from '@/config/config'
import MockAdapter from 'axios-mock-adapter'
import storeVuex from '@/vuex/store'
import routerConfig from '@/config/router'
//import jasmine from 'jasmine-jquery'
import * as $ from 'jquery'

//var Constructor = Vue.extend(CustomCircle);
var vmCustomCircle;
var mock;
//var $ = window.jQuery = require('jquery');
//var $ = window.jQuery = require('jasmine-jquery');

describe('test customcircle.vue', function() {

  const vm = new Vue({
    template: '<div><customcircle></customcircle></div>',
    components: {
      'customcircle': CustomCircle
    },
    store: storeVuex,
    router: routerConfig
  }).$mount();

  beforeEach(function () {
   // vmCustomCircle = new Constructor().$mount();
    vmCustomCircle = vm.$children[0];
    mock = new MockAdapter(axios);

  });

  afterEach(function () {
    Object.assign(vmCustomCircle.$data, vmCustomCircle.$options.data());
  });

  it('should if click on a circle',function () {
    vmCustomCircle.handleClick();
  });

  it('should check add a score',function (done) {
    vmCustomCircle.score = 4;
    setTimeout(function () {
      //expect(vmCustomCircle.rating).toEqual(4);
      done();
    },1);
  });

  it('should check add a expertise',function (done) {
    vmCustomCircle.expertise = {
      id:3,
      level:0,
      noted:false,
      version:0,
      collaborator:{defaultPicture:true,
        email:"eric.dupont@viseo.com",
        firstName:"Eric",
        id:1,
        lastName:"DUPONT",
        version:0},
      skill:{id:2,
        label:"JAVA",
        version:0}
    };
    setTimeout(function () {
      expect(vmCustomCircle.selectedExpertise).toEqual(vmCustomCircle.expertise);
      done();
    },0);
  });

  it('should check update expertise if user is not admin with response success of server',function (done) {
    let TokenCollaborator = "eyJhbGciOiJIUzUxMiJ9.eyJmaXJzdE5hbWUiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJpc0FkbWluIjpmYWxzZSwiaWQiOjEsImVtYWlsIjoibGhvdGVAdmlzZW8uY29tIiwidmVyc2lvbiI6MCwiZGVmYXVsdHBpY3R1cmUiOnRydWV9.eguO54P8MHmWrwSREJu5-vCHkhA2Tj995efuHc4twdw";
    //localStorage.setItem('token', TokenCollaborator);
    storeVuex.commit('setTokenFromLocalStorage',TokenCollaborator);

    mock.onPut(config.server + '/api/expertise').reply(200);
    vmCustomCircle.selectedExpertise = {
      id:3,
      level:0,
      noted:false,
      version:0,
      collaborator:{defaultPicture:true,
            email:"eric.dupont@viseo.com",
            firstName:"Eric",
            id:1,
            lastName:"DUPONT",
            version:0},
      skill:{id:2,
            label:"JAVA",
            version:0}
    };
    vmCustomCircle.ratingSaved = 4;
    vmCustomCircle.rating = 4;
    var rating = 5;

    vmCustomCircle.setRating(4);

    setTimeout(function () {
      expect(vmCustomCircle.rating).toEqual(0);
      expect(vmCustomCircle.ratingSaved ).toEqual(vmCustomCircle.rating);
      storeVuex.commit('clearToken');
      done();
    },0);

  });

  it('should check update expertise if user is not admin with response error of server',function (done) {
    let TokenCollaborator = "eyJhbGciOiJIUzUxMiJ9.eyJmaXJzdE5hbWUiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJpc0FkbWluIjpmYWxzZSwiaWQiOjEsImVtYWlsIjoibGhvdGVAdmlzZW8uY29tIiwidmVyc2lvbiI6MCwiZGVmYXVsdHBpY3R1cmUiOnRydWV9.eguO54P8MHmWrwSREJu5-vCHkhA2Tj995efuHc4twdw";
    storeVuex.commit('setTokenFromLocalStorage',TokenCollaborator);

    mock.onPut(config.server + '/api/expertise').reply(500);
    vmCustomCircle.selectedExpertise = {
      id:3,
      level:0,
      noted:false,
      version:0,
      collaborator:{defaultPicture:true,
        email:"eric.dupont@viseo.com",
        firstName:"Eric",
        id:1,
        lastName:"DUPONT",
        version:0},
      skill:{id:2,
        label:"JAVA",
        version:0}
    };
    vmCustomCircle.ratingSaved = 4;
    vmCustomCircle.rating = 3;
    var rating = 5;
    vmCustomCircle.setRating(4);

    setTimeout(function () {
      expect(vmCustomCircle.rating).toEqual(3);
      expect(vmCustomCircle.ratingSaved ).toEqual(4);
      storeVuex.commit('clearToken');
      done();
    },0);
  });

  it('should check update expertise if user is not admin with response error of server',function (done) {
    let TokenAdmin = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJpc0FkbWluIjp0cnVlLCJpZCI6MSwiZW1haWwiOiJsaG90ZUB2aXNlby5jb20iLCJ2ZXJzaW9uIjowLCJkZWZhdWx0cGljdHVyZSI6dHJ1ZX0.qYCLU_6WU9lCVHIsoX9hUNJqa7JgK0g_vApYrRdkuxg";

    storeVuex.commit('setTokenFromLocalStorage',TokenAdmin);

    mock.onPut(config.server + '/api/expertise').reply(500);
    vmCustomCircle.selectedExpertise = {
      id:3,
      level:0,
      noted:false,
      version:0,
      collaborator:{defaultPicture:true,
        email:"eric.dupont@viseo.com",
        firstName:"Eric",
        id:1,
        lastName:"DUPONT",
        version:0},
      skill:{id:2,
        label:"JAVA",
        version:0}
    };
    vmCustomCircle.ratingSaved = 4;
    vmCustomCircle.rating = 3;
    var rating = 5;

    storeVuex.state.collaboratorLoggedIn.isAdmin = true;
    vmCustomCircle.setRating(4);

    setTimeout(function () {
      expect(vmCustomCircle.rating).toEqual(3);
      expect(vmCustomCircle.ratingSaved ).toEqual(4);
      done();
    },0);
  });

  it('should check the position balise "div" ',function () {
    var cx = 250;
    var cy = 150;
    vmCustomCircle.divPosition(cx,cy);
    expect(vmCustomCircle.divPosition(cx,cy)).toEqual('z-index:1;position:relative;left:250px;top:150px;');
  });

  it('should check the elevel expertise is "Expert"',function () {
    var rating = 5;
    vmCustomCircle.showCurrentRating(rating);
    expect(vmCustomCircle.currentRating).toEqual(rating);
  });


});
