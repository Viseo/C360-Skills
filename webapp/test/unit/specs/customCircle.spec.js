/**
 * Created by SJO3662 on 29/06/2017.
 */
import Vue from 'vue'
import CustomCircle from '@/components/customComponent/customcircle'
import axios from 'axios'
import config from '@/config/config'
import MockAdapter from 'axios-mock-adapter'
var Constructor = Vue.extend(CustomCircle);
var vmCustomCircle;
var mock;
var $ = window.jQuery = require('jquery');

describe('test customcircle.vue', function() {

  beforeEach(function () {
    vmCustomCircle = new Constructor().$mount();
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
      expect(vmCustomCircle.rating).toEqual(4);
      done();
    },0);

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

  it('should check update expertise with response success of server',function (done) {
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

    setTimeout(function () {
      vmCustomCircle.setRating(4);
      expect(vmCustomCircle.selectedExpertise.level).toEqual(4);
      done();
    },0);
  });

  it('should check update expertise with response success of server',function (done) {
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

    setTimeout(function () {
      vmCustomCircle.setRating(4);
      expect(vmCustomCircle.selectedExpertise.level).toEqual(4);
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
    expect(vmCustomCircle.currentLevel).toEqual('Expert');
  });

  it('should check the elevel expertise is "Avancé"',function () {
    var rating = 4;
    vmCustomCircle.showCurrentRating(rating);
    expect(vmCustomCircle.currentLevel).toEqual('Avancé');
  });

  it('should check the elevel expertise is "Confirmé"',function () {
    var rating = 3;
    vmCustomCircle.showCurrentRating(rating);
    expect(vmCustomCircle.currentLevel).toEqual('Confirmé');
  });

  it('should check the elevel expertise is "Débutant"',function () {
    var rating = 2;
    vmCustomCircle.showCurrentRating(rating);
    expect(vmCustomCircle.currentLevel).toEqual('Débutant');
  });

  it('should check the elevel expertise is "Élémentaire"',function () {
    var rating = 1;
    vmCustomCircle.showCurrentRating(rating);
    expect(vmCustomCircle.currentLevel).toEqual('Élémentaire');
  });
});
