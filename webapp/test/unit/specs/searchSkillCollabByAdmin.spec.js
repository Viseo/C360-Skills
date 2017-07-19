import Vue from 'vue'
import axios from 'axios'
import config from '@/config/config'
import searchSkillCollabByAdmin from '@/components/pages/searchSkillCollabByAdmin'
import MockAdapter from 'axios-mock-adapter'
import storeVuex from '@/vuex/store'

var mock = new MockAdapter(axios);

var vmSearchSkillCollabByAdmin;


describe('Test searchSkillCollabByAdmin', function () {

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
      let allFunctionOnPageLoad = () =>  {
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
        vmSearchSkillCollabByAdmin.getAllSkills();

      };

      allFunctionOnPageLoad();

  });

  afterEach(function () {
    Object.assign(vmSearchSkillCollabByAdmin.$data, vmSearchSkillCollabByAdmin.$options.data());
    storeVuex.commit('resetStore');
  });

  it('should check if typeahead is initialize with all skills and all collaborators when page is loaded', function (done) {
      let allSkillsAndCollabName = ['Android','C++','CSS','Java','HTML','Hamza Bourakkadi','Lhote Caroline'];
      setTimeout(function(){
          expect(vmSearchSkillCollabByAdmin.searchResult).toEqual(allSkillsAndCollabName);
          done();
      }, 0);
  });

  it('should check if specific collaborator and skills are displayed when administrator is typing some specifics letter in the typeahead', function (done) {
      vmSearchSkillCollabByAdmin.value = "J";
      setTimeout(function(){

          console.log("coucou"+vmSearchSkillCollabByAdmin.$children[0].val);
          console.log("coucou"+vmSearchSkillCollabByAdmin.$children[0].data);
          console.log("coucou"+vmSearchSkillCollabByAdmin.$children[0].showDropdown);
             console.log("coucou"+vmSearchSkillCollabByAdmin.$children[0].items);

          done();
      }, 0);
  });

  it('should check expertises in the typeahead', function () {
    vmSearchSkillCollabByAdmin.expertises= [{id:1,level:0,noted: false, skill:[{id: 3, label:"coucou", version:0}],version:0},
                                            {id:99,level:5,noted: false, skill:[{id: 6, label:"vuejs", version:0}],version:0},
                                            {id:78,level:2, noted: false, skill:[{id: 9, label:"React", version:0}],version:0}];
    let containerSVG = vmSearchSkillCollabByAdmin.$el.querySelector('div');
    document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(containerSVG);
    vmSearchSkillCollabByAdmin.selectedExpertise= [{id:1,level:0,noted: false, skill:{id: 3, label:"coucou", version:0},version:0}];

    vmSearchSkillCollabByAdmin.value = "coucou";
    vmSearchSkillCollabByAdmin.expertises[0].skill.label = vmSearchSkillCollabByAdmin.value;

    vmSearchSkillCollabByAdmin.typeAheadSearch();
     expect(vmSearchSkillCollabByAdmin.selectedExpertise).toEqual(vmSearchSkillCollabByAdmin.expertises[0]);

  });

  it('should check if level is selected', function(){
    vmSearchSkillCollabByAdmin.value = 5;
    vmSearchSkillCollabByAdmin.onClickChild(vmSearchSkillCollabByAdmin.value);
    expect(vmSearchSkillCollabByAdmin.levelSelected).toBe(vmSearchSkillCollabByAdmin.value)

  });

  it('should check if ', function(){
    vmSearchSkillCollabByAdmin.value = [{id:1,level:0,noted: false, skill:{id: 3, label:"coucou", version:0},version:0}]
    vmSearchSkillCollabByAdmin.setExpertise(vmSearchSkillCollabByAdmin.value);
    expect(vmSearchSkillCollabByAdmin.selectedExpertise ).toBe(vmSearchSkillCollabByAdmin.value)

  });

  it('should check all expertises from database', function(done){
    let expertises = [{collaborator: [{defaultPicture: true, email:"nihel.bengamra@viseo.com",firstName:"Nihel", id:"2",lastName:"Ben Gamra", version:0}],id:1,level:0,noted: false, skill:[{id: 3, label:"coucou", version:0}],version:0},
      {collaborator: [{defaultPicture: true, email:"benjamin.batista@viseo.com",firstName:"Benjamin", id:"4",lastName:"Batista", version:0}], id:99,level:5,noted: false, skill:[{id: 6, label:"vuejs", version:0}],version:0},
      {collaborator: [{defaultPicture: true, email:"caroline.lhote@viseo.com",firstName:"Caroline", id:"8",lastName:"Lhote", version:0}],id:78,level:2, noted: false, skill:[{id: 9, label:"React", version:0}],version:0}];
    vmSearchSkillCollabByAdmin.collabLogged = {defaultPicture: true, email:"benjamin.batista@viseo.com",firstName:"Benjamin", id:"4",lastName:"Batista", version:0};
    mock.onGet(config.server + '/api/getcollabexpertises/4').reply(200, expertises);
    vmSearchSkillCollabByAdmin.getAllExpertise();
    setTimeout(function () {
      done();
    },0)
  });

  it('should check all expertises found from database success with noted = false', function(done){
    let expertises = [{collaborator: [{defaultPicture: true, email:"nihel.bengamra@viseo.com",firstName:"Nihel", id:"2",lastName:"Ben Gamra", version:0}],id:1,level:0,noted: false, skill:[{id: 3, label:"coucou", version:0}],version:0},
      {collaborator: [{defaultPicture: true, email:"benjamin.batista@viseo.com",firstName:"Benjamin", id:"4",lastName:"Batista", version:0}], id:99,level:5,noted: false, skill:[{id: 6, label:"vuejs", version:0}],version:0},
      {collaborator: [{defaultPicture: true, email:"caroline.lhote@viseo.com",firstName:"Caroline", id:"8",lastName:"Lhote", version:0}],id:78,level:2, noted: false, skill:[{id: 9, label:"React", version:0}],version:0}];
    vmSearchSkillCollabByAdmin.foundCollab = {defaultPicture: true, email:"nihel.bengamra@viseo.com",firstName:"Nihel", id:"2",lastName:"Ben Gamra", version:0};
    mock.onGet(config.server + '/api/getcollabexpertises/2').reply(200, expertises);
    vmSearchSkillCollabByAdmin.getFoundCollabExpertises();
    setTimeout(function () {
      done();
    },0)
  });

  it('should check all expertises found from database success with noted = true', function(done){
    let expertises = [{collaborator: [{defaultPicture: true, email:"nihel.bengamra@viseo.com",firstName:"Nihel", id:"2",lastName:"Ben Gamra", version:0}],id:1,level:3,noted: true, skill:[{id: 3, label:"coucou", version:0}],version:0},
      {collaborator: [{defaultPicture: true, email:"soline.john",firstName:"Soline", id:"71",lastName:"John", version:0}], id:8,level:3,noted: true, skill:[{id: 6, label:"vuejs", version:0}],version:0},
      {collaborator: [{defaultPicture: true, email:"benjamin.batista@viseo.com",firstName:"Benjamin", id:"4",lastName:"Batista", version:0}], id:99,level:1,noted: true, skill:[{id: 6, label:"vuejs", version:0}],version:0},
      {collaborator: [{defaultPicture: true, email:"caroline.lhote@viseo.com",firstName:"Caroline", id:"8",lastName:"Lhote", version:0}],id:78,level:2, noted: true, skill:[{id: 9, label:"React", version:0}],version:0}];
    vmSearchSkillCollabByAdmin.foundCollab = {defaultPicture: true, email:"nihel.bengamra@viseo.com",firstName:"Nihel", id:"2",lastName:"Ben Gamra", version:0};
    mock.onGet(config.server + '/api/getcollabexpertises/2').reply(200, expertises);
    vmSearchSkillCollabByAdmin.getFoundCollabExpertises();
    setTimeout(function () {
      done();
    },0)
  });
  it('should check if expertisebycollaborator is posted on database error', function(done){
    let expertises = [{collaborator: [{defaultPicture: true, email:"nihel.bengamra@viseo.com",firstName:"Nihel", id:"2",lastName:"Ben Gamra", version:0}],id:1,level:3,noted: true, skill:[{id: 3, label:"coucou", version:0}],version:0},
      {collaborator: [{defaultPicture: true, email:"soline.john",firstName:"Soline", id:"71",lastName:"John", version:0}], id:8,level:3,noted: true, skill:[{id: 6, label:"vuejs", version:0}],version:0},
      {collaborator: [{defaultPicture: true, email:"benjamin.batista@viseo.com",firstName:"Benjamin", id:"4",lastName:"Batista", version:0}], id:99,level:1,noted: true, skill:[{id: 6, label:"vuejs", version:0}],version:0},
      {collaborator: [{defaultPicture: true, email:"caroline.lhote@viseo.com",firstName:"Caroline", id:"8",lastName:"Lhote", version:0}],id:78,level:2, noted: true, skill:[{id: 9, label:"React", version:0}],version:0}];

    vmSearchSkillCollabByAdmin.collabExpertises = [{collaborator: [{defaultPicture: true, email:"soline.john",firstName:"Soline", id:"71",lastName:"John", version:0}], id:8,level:3,noted: true, skill:[{id: 6, label:"vuejs", version:0}],version:0}];
    mock.onGet(config.server + '/api/getcollabexpertises/2').reply(200, expertises);
    mock.onPost(config.server + '/api/expertisebycollaborator').reply(200, expertises);

    vmSearchSkillCollabByAdmin.getFoundCollabExpertises();
    setTimeout(function () {
      done();
    },0)
  });

  it('should check if expertisebycollaborator is posted on database error', function(done){
    let expertises = [{collaborator: [{defaultPicture: true, email:"nihel.bengamra@viseo.com",firstName:"Nihel", id:"2",lastName:"Ben Gamra", version:0}],id:1,level:3,noted: true, skill:[{id: 3, label:"coucou", version:0}],version:0},
      {collaborator: [{defaultPicture: true, email:"soline.john",firstName:"Soline", id:"71",lastName:"John", version:0}], id:8,level:3,noted: true, skill:[{id: 6, label:"vuejs", version:0}],version:0},
      {collaborator: [{defaultPicture: true, email:"benjamin.batista@viseo.com",firstName:"Benjamin", id:"4",lastName:"Batista", version:0}], id:99,level:1,noted: true, skill:[{id: 6, label:"vuejs", version:0}],version:0},
      {collaborator: [{defaultPicture: true, email:"caroline.lhote@viseo.com",firstName:"Caroline", id:"8",lastName:"Lhote", version:0}],id:78,level:2, noted: true, skill:[{id: 9, label:"React", version:0}],version:0}];

    mock.onGet(config.server + '/api/getcollabexpertises/2').reply(200, expertises);
    mock.onPost(config.server + '/api/expertisebycollaborator').reply(200, expertises);

    vmSearchSkillCollabByAdmin.getFoundCollabExpertises();
    setTimeout(function () {
      done();
    },0)
  });

  it('it should check if expertises are choses from collaborator expertises', function (done) {
    vmSearchSkillCollabByAdmin.collabExpertises =
      [ {collaborator: [{defaultPicture: true, email:"hamza.bourakadi@viseo.com",firstName:"Hamza", id:"12",lastName:"ourakadi", version:0}],id:78,level:2, noted: false, skill:[{id: 9, label:"React", version:0}],version:0},
        {collaborator: [{defaultPicture: true, email:"soline.john@viseo.com",firstName:"Soline", id:"10",lastName:"John", version:0}], id:99,level:5,noted: false, skill:[{id: 6, label:"vuejs", version:0}],version:0},
        {collaborator: [{defaultPicture: true, email:"ouahib.adli@viseo.com",firstName:"Ouahib", id:"65",lastName:"Adli", version:0}], id:99,level:4,noted: false, skill:[{id: 6, label:"vuejs", version:0}],version:0},];
    vmSearchSkillCollabByAdmin.getFoundCollabExpertises();
    setTimeout(function () {
      done();
    },0)
  });
  
  it('should check if collaborator Expertise from database success with one collaborator', function (done) {
    vmSearchSkillCollabByAdmin.collaboratorsByExpertise =
      [{collaborator: {defaultPicture: true, email:"benjamin.batista@viseo.com",firstName:"Benjamin", id:"4",lastName:"Batista", version:0},
        id:99,
        level:5,
        noted: false,
        skill:[{id: 6, label:"vuejs", version:0}],
        version:0}
      ];
    mock.onPost(config.server + '/api/collaboratorsexpertises').reply(200, vmSearchSkillCollabByAdmin.collaboratorsByExpertise);
    vmSearchSkillCollabByAdmin.getCollaboratorsByExpertises();
    setTimeout(function () {
      done();
    },0)
  });


  it('should check if collaborator Expertise from database success with all collaborators ', function (done) {
      let test =
        [{collaborator: {defaultPicture: true, email:"benjamin.batista@viseo.com",firstName:"Benjamin", id:"4",lastName:"Batista", version:0},
          id:99,
          level:5,
          noted: false,
          skill:[{id: 6, label:"vuejs", version:0}],
          version:0},
          {collaborator: {defaultPicture: true, email:"ouaib.adli@viseo.com",firstName:"Ouahib", id:"4",lastName:"Adli", version:0},
            id:73,
            level:5,
            noted: false,
            skill:[{id: 4, label:"javascript", version:0}],
            version:0},
          {collaborator: {defaultPicture: true, email:"soline.john",firstName:"soline", id:"85",lastName:"john", version:0},
            id:52,
            level:5,
            noted: false,
            skill:[{id: 4, label:"react", version:0}],
            version:0}
        ];
      mock.onPost(config.server + '/api/collaboratorsexpertises').reply(200, test);
      vmSearchSkillCollabByAdmin.getCollaboratorsByExpertises(test);
      setTimeout(function () {
        done();
      },0)
  });

  it('sr', function (done) {
    let test =
      [{collaborator: {defaultPicture: true, email:"benjamin.batista@viseo.com",firstName:"Benjamin", id:"4",lastName:"Batista", version:0},
        id:99,
        level:5,
        noted: false,
        skill:[{id: 6, label:"vuejs", version:0}],
        version:0},
        {collaborator: {defaultPicture: true, email:"ouaib.adli@viseo.com",firstName:"Ouahib", id:"45",lastName:"Adli", version:0},
          id:73,
          level:5,
          noted: false,
          skill:[{id: 4, label:"javascript", version:0}],
          version:0},
        {collaborator: {defaultPicture: true, email:"soline.john",firstName:"soline", id:"85",lastName:"john", version:0},
          id:52,
          level:5,
          noted: false,
          skill:[{id: 4, label:"react", version:0}],
          version:0}
      ];

    // vmSearchSkillCollabByAdmin.CollabSkillChosenAndInduit.expertisesChosen =
    //   [{collaborator: [{defaultPicture: true, email:"ouaib.adli@viseo.com",firstName:"Ouahib", id:"85",lastName:"Adli", version:0}],
    //     id:73,
    //     level:5,
    //     noted: false,
    //     skill:[{id: 4, label:"javascript", version:0}],
    //     version:0}];
    mock.onPost(config.server + '/api/collaboratorsexpertises').reply(200, test);
    vmSearchSkillCollabByAdmin.getCollaboratorsByExpertises(test);
    setTimeout(function () {
      expect(vmSearchSkillCollabByAdmin.collaboratorsByExpertise).toEqual(test);
      done();
    },0)
  });


  it('should check collaborator Expertise from database', function (done) {
    let test2  =
      [{collaborator: {defaultPicture: true, email:"ouaib.adli@viseo.com",firstName:"Ouahib", id:"45",lastName:"Adli", version:0},
        id:73,
        level:5,
        noted: false,
        skill:[{id: 4, label:"javascript", version:0}],
        version:0},
        {collaborator: {defaultPicture: true, email:"soline.john@viseo.com",firstName:"Soline", id:"98",lastName:"John", version:0},
          id:65,
          level:5,
          noted: false,
          skill:[{id: 74, label:"java", version:0}],
          version:0},
        {collaborator: {defaultPicture: true, email:"nihel.bengamra",firstName:"Nihel", id:"32",lastName:"Ben Gamra", version:0},
          id:74,
          level:5,
          noted: false,
          skill:[{id: 10, label:"hibernate", version:0}],
          version:0},
      ];

    vmSearchSkillCollabByAdmin.listCollaboratorsExpertises = [{
      collaborator: {defaultPicture: true, email:"ouaib.adli@viseo.com",firstName:"Ouahib", id:"45",lastName:"Adli", version:0},
      expertisesChosen: [{collaborator: {defaultPicture: true, email:"ouaib.adli@viseo.com",firstName:"Ouahib", id:"45",lastName:"Adli", version:0},
        id:74,
        level:5,
        noted: false,
        skill:{id: 10, label:"hibernate", version:0},
        version:0},
        {collaborator: {defaultPicture: true, email:"xiangzhe.mang@viseo.com",firstName:"xiangzhe", id:"66",lastName:"Mang", version:0},
          id:89,
          level:5,
          noted: false,
          skill:{id: 10, label:"ajax", version:0},
          version:0}
      ],
      expertisesInduit: [{collaborator: {defaultPicture: true, email:"nihel.bengamra@viseo.com",firstName:"Nihel", id:"32",lastName:"Ben Gamra", version:0},
        id:74,
        level:5,
        noted: false,
        skill:{id: 10, label:"hibernate", version:0},
        version:0},
        {collaborator: {defaultPicture: true, email:"caroline.lhote@viseo.com",firstName:"Caroline", id:"79",lastName:"Lhote", version:0},
          id:14,
          level:5,
          noted: false,
          skill:{id: 20, label:"Spring", version:0},
          version:0},
        {collaborator: {defaultPicture: true, email:"hamza.bourakadi@viseo.com",firstName:"Hamza", id:"22",lastName:"Bourakadi", version:0},
          id:16,
          level:5,
          noted: false,
          skill:{id: 82, label:"eclipse link", version:0},
          version:0},
        {collaborator: {defaultPicture: true, email:"benjamin.batista@viseo.com",firstName:"Binjamin", id:"22",lastName:"Batista", version:0},
          id:16,
          level:5,
          noted: false,
          skill:{id: 77, label:"Top link", version:0},
          version:0}
      ],


    }];
    mock.onPost(config.server + '/api/expertisebycollaborator').reply(200,  test2);
    vmSearchSkillCollabByAdmin.getCollaboratorsByExpertises(test2);
    setTimeout(function () {
      done();
    },0)
  });

  it('should check collaborator Expertise from database', function (done) {

    vmSearchSkillCollabByAdmin.links = [{
      id: 30,
      skill1: {id: 3, label: "javascript", version:0},
      skill2: {id: 27, lable: "vuejs"},
      version:0,
    },
      {id: 30,
        skill1: {id: 3, label: "javascript", version:0},
        skill2: {id: 6, lable: "React"},
        version:0,}
    ];

    mock.onGet(config.server + '/api/links/').reply(200, vmSearchSkillCollabByAdmin.links);
    vmSearchSkillCollabByAdmin.getAllLinks();
    setTimeout(function () {
      done();
    },0)
  });

  it('should link PositionX when selected link is not empty',function () {

    vmSearchSkillCollabByAdmin.selectedlink = {
      id:10,
      skill1: {id:1,label:'JAVA',version:0},
      skill2: {id:2,label:'J2EE',version:0},
      version:0
    };

    let containerSVG = vmSearchSkillCollabByAdmin.$el.querySelector('g');
    document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(containerSVG);

    expect(vmSearchSkillCollabByAdmin.linkPositionX()).not.toEqual(0);
  });

  it('should link PositionX when selected link is empty',function () {
    vmSearchSkillCollabByAdmin.selectedlink = '';
    expect(vmSearchSkillCollabByAdmin.linkPositionX()).toEqual(0);
  });

  it('should link PositionX when selected link is not empty',function () {

    vmSearchSkillCollabByAdmin.selectedlink = {
      id:10,
      skill1: {id:1,label:'JAVA',version:0},
      skill2: {id:2,label:'J2EE',version:0},
      version:0
    };

    let containerSVG = vmSearchSkillCollabByAdmin.$el.querySelector('g');
    document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(containerSVG);

    expect(vmSearchSkillCollabByAdmin.linkPositionY()).not.toEqual(0);
  });

  it('should link PositionX when selected link is empty',function () {
    vmSearchSkillCollabByAdmin.selectedlink = '';
    expect(vmSearchSkillCollabByAdmin.linkPositionY()).toEqual(0);
  });





  });
