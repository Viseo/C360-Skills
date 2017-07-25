/**
 * Created by SJO3662 on 25/07/2017.
 */
import Vue from 'vue'
import axios from 'axios'
import config from '@/config/config'
import ProfilToUpdate from '@/components/pages/profilToUpdatePage'
import MockAdapter from 'axios-mock-adapter'
import storeVuex from '@/vuex/store'
import routerConfig from '@/config/router'
import Router from 'vue-router'
Vue.use(Router);

var vmProfilToUpdate;
var mock;

describe('test profilToUpdatePage.vue', function() {
  let Token = "eyJhbGciOiJIUzUxMiJ9.eyJmaXJzdE5hbWUiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJpc0FkbWluIjpmYWxzZSwiaWQiOjEsImVtYWlsIjoibGhvdGVAdmlzZW8uY29tIiwidmVyc2lvbiI6MCwiZGVmYXVsdHBpY3R1cmUiOnRydWV9.eguO54P8MHmWrwSREJu5-vCHkhA2Tj995efuHc4twdw";
  localStorage.setItem('token', Token);

  beforeEach(function () {
    const vm = new Vue({
      template: '<div><profil-to-update-page></profil-to-update-page></div>',
      components: {
        'profil-to-update': ProfilToUpdate
      },
      store: storeVuex,
      router: routerConfig
    }).$mount();
    vmProfilToUpdate = vm.$children[0];
    mock = new MockAdapter(axios);
  });

  afterEach(function () {
    Object.assign(vmProfilToUpdate.$data, vmProfilToUpdate.$options.data());
  });

 /* it('should set disconnected to true', function () {
    vmSkillsHeader.setDisconnectedToTrue();
    expect(vmSkillsHeader.disconnect).toBe(true);
  });*/

});
