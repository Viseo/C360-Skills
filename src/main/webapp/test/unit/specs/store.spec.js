/**
 * Created by SJO3662 on 30/06/2017.
 */

import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import config from '@/config/config'
import storeVuex from '@/vuex/store'
import routerConfig from '@/config/router'
var jwtDecode = require('jwt-decode');

// Vue.use(Vuex)
var mock;

describe('test store.vue', function() {

  beforeEach(function () {
    mock = new MockAdapter(axios);
    //storeVuex.commit('resetStore');
    storeVuex.commit('clearToken');
    storeVuex.commit('clearStayConnected');
  });

  afterEach(function () {

  });

  it('should call the store with value initial', function (done) {
    //storeVuex.commit('resetStore');
    setTimeout(function () {
      expect(storeVuex.state.stayConnected).toBeNull();
      expect(storeVuex.state.token).toBeNull();

      done();
    });

   /*expect(storeVuex.state.collaboratorLoggedIn.id).toBeNull();
   expect(storeVuex.state.collaboratorLoggedIn.lastName).toBeNull();
    expect(storeVuex.state.collaboratorLoggedIn.isAdmin).toBeNull();
    expect(storeVuex.state.collaboratorLoggedIn.firstName).toBeNull();
    expect(storeVuex.state.collaboratorLoggedIn.defaultPicture).toBeNull();
    expect(storeVuex.state.collaboratorLoggedIn.email).toBeNull();
    expect(storeVuex.state.collaboratorLoggedIn.version).toBeNull();
    expect(storeVuex.state.collaboratorLoggedIn.foundedSkillsLabel).toBeNull();*/

  });

  it('should check if the token is absent ', function (done) {
    let Token = null;
    storeVuex.commit('setToken',Token);
    storeVuex.commit('setStayConnected',null);
    storeVuex.commit('setTokenFromLocalStorage');
    storeVuex.commit('clearToken');

    mock.onPost(config.server + '/api/sendtoken').reply(200);
    storeVuex.dispatch('isTokenValid', routerConfig);
    setTimeout(function () {
      expect(storeVuex.getters.stayConnected).toBeNull();
      expect(storeVuex.state.token).toBeNull();
      done();
    });
  });

  it('should check if the token is present and valide', function (done) {
    let Token = "eyJhbGciOiJIUzUxMiJ9.eyJmaXJzdE5hbWUiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJpc0FkbWluIjpmYWxzZSwiaWQiOjEsImVtYWlsIjoibGhvdGVAdmlzZW8uY29tIiwidmVyc2lvbiI6MCwiZGVmYXVsdHBpY3R1cmUiOnRydWV9.eguO54P8MHmWrwSREJu5-vCHkhA2Tj995efuHc4twdw";

    storeVuex.commit('setToken',Token);
    storeVuex.commit('setStayConnected',true);

    mock.onPost(config.server + '/api/sendtoken').reply(200,Token);
    storeVuex.dispatch('isTokenValid', routerConfig);
    setTimeout(function () {
      expect(storeVuex.getters.stayConnected).toBe(true);
      expect(storeVuex.getters.foundedSkillsLabel).toBe(false);
      done();
    });

  });


});
