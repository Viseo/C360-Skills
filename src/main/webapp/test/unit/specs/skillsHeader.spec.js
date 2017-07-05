import Vue from 'vue'
import axios from 'axios'
import config from '@/config/config'
import SkillsHeader from '@/components/layout/skillsHeader'
import MockAdapter from 'axios-mock-adapter'
import storeVuex from '@/vuex/store'
import routerConfig from '@/config/router'



var mock = new MockAdapter(axios);
var vmSkillsHeader;


describe('test logInPage.vue', function() {
  let Token = "eyJhbGciOiJIUzUxMiJ9.eyJmaXJzdE5hbWUiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJpc0FkbWluIjpmYWxzZSwiaWQiOjEsImVtYWlsIjoibGhvdGVAdmlzZW8uY29tIiwidmVyc2lvbiI6MCwiZGVmYXVsdHBpY3R1cmUiOnRydWV9.eguO54P8MHmWrwSREJu5-vCHkhA2Tj995efuHc4twdw";
  localStorage.setItem('token', Token);
  const vm = new Vue({
    template: '<div><skillsHeader></skillsHeader></div>',
    components: {
      'skillsHeader': SkillsHeader
    },
    store: storeVuex,
    route: routerConfig
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




});
