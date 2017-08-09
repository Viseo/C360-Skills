import Vue from 'vue'
import axios from 'axios'
import config from '@/config/config'
import SkillsHeader from '@/components/layout/skillsHeader'
import MockAdapter from 'axios-mock-adapter'
import storeVuex from '@/vuex/store'
import routerConfig from '@/config/router'
import Router from 'vue-router'
var $ = window.jQuery = require('jquery');

var mock = new MockAdapter(axios);
var vmSkillsHeader;
Vue.use(Router);

describe('test skillsHeader.vue', function() {
  let Token = "eyJhbGciOiJIUzUxMiJ9.eyJmaXJzdE5hbWUiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJpc0FkbWluIjpmYWxzZSwiaWQiOjEsImVtYWlsIjoibGhvdGVAdmlzZW8uY29tIiwidmVyc2lvbiI6MCwiZGVmYXVsdHBpY3R1cmUiOnRydWV9.eguO54P8MHmWrwSREJu5-vCHkhA2Tj995efuHc4twdw";
  localStorage.setItem('token', Token);
  const vm = new Vue({
    template: '<div><skillsHeader></skillsHeader></div>',
    components: {
      'skillsHeader': SkillsHeader
    },
    store: storeVuex,
    router: routerConfig
  }).$mount();


  beforeEach(function () {
    vmSkillsHeader = vm.$children[0];
    mock = new MockAdapter(axios);
  });

  afterEach(function () {
    Object.assign(vmSkillsHeader.$data, vmSkillsHeader.$options.data());
  });

  it('should set disconnected to true',function () {
    vmSkillsHeader.setDisconnectedToTrue();
    expect(vmSkillsHeader.disconnect).toBe(true);
  });

  it('should set disconnected to false',function () {
    vmSkillsHeader.setDisconnectedToFalse();
    expect(vmSkillsHeader.disconnect).toBe(false);
  });

  it('should disconnect user',function () {
    mock.onPost(config.server + '/api/userdisconnect').reply(200);
    vmSkillsHeader.disconnectUser();
  });

  it('should fail to disconnect user',function () {
    mock.onPost(config.server + '/api/userdisconnect').reply(400);
    vmSkillsHeader.disconnectUser();
  });


  it('should check if is an admin', function () {
    vmSkillsHeader.$store.state.collaboratorLoggedIn.isAdmin = true;
    vmSkillsHeader.$store.state.token = "eyJhbGciOiJIUzUxMiJ9.eyJmaXJzdE5hbWUiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJpc0FkbWluIjp0cnVlLCJpZCI6MSwiZW1haWwiOiJsaG90ZUB2aXNlby5jb20iLCJ2ZXJzaW9uIjowLCJkZWZhdWx0cGljdHVyZSI6dHJ1ZX0.HEnnSMlLVao1ARGD66uh281OG3ggXLxqdVv5K5wFS8w";
    vmSkillsHeader.isAdminOrCollabPath();
    expect(vmSkillsHeader.$store.getters.isAuthenticated).not.toBeNull();
  });

  it('should check admin path', function(done){
    vmSkillsHeader.$store.state.collaboratorLoggedIn.isAdmin = true;
    vmSkillsHeader.$store.state.token = "eyJhbGciOiJIUzUxMiJ9.eyJmaXJzdE5hbWUiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJpc0FkbWluIjp0cnVlLCJpZCI6MSwiZW1haWwiOiJsaG90ZUB2aXNlby5jb20iLCJ2ZXJzaW9uIjowLCJkZWZhdWx0cGljdHVyZSI6dHJ1ZX0.HEnnSMlLVao1ARGD66uh281OG3ggXLxqdVv5K5wFS8w";
    //vmSkillsHeader.$router.push('/searchSkillCollabByAdmin');
    //routerConfig.push({path :'/searchSkillCollabByAdmin'});
    //vmSkillsHeader.$router.currentRoute.push('/searchSkillCollabByAdmin');
    //this.$route.path = '/searchSkillCollabByAdmin';
    vmSkillsHeader.$router.push('/searchSkillCollabByAdmin');
    console.log("vmSkillsHeader.$router: " +vmSkillsHeader.$route.path);
    vmSkillsHeader.isAdminOrCollabPath();
    console.log("vmSkillsHeader.$router:2  " +vmSkillsHeader.$route.path);
    setTimeout(function () {
      done();
    },0);

  });

  it('should check if is a collaborator', function () {
    storeVuex.state.collaboratorLoggedIn.isAdmin = false;
    storeVuex.state.token = "eyJhbGciOiJIUzUxMiJ9.eyJmaXJzdE5hbWUiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJpc0FkbWluIjpmYWxzZSwiaWQiOjEsImVtYWlsIjoibGhvdGVAdmlzZW8uY29tIiwidmVyc2lvbiI6MCwiZGVmYXVsdHBpY3R1cmUiOnRydWV9.eguO54P8MHmWrwSREJu5-vCHkhA2Tj995efuHc4twdw";
    vmSkillsHeader.isAdminOrCollabPath();
    expect(vmSkillsHeader.$store.getters.isAuthenticated).not.toBeNull();
  });

});
