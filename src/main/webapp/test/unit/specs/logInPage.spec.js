import Vue from 'vue'
import axios from 'axios'
import config from '@/config/config'
import LogInPage from '@/components/logIn/logInPage'
import MockAdapter from 'axios-mock-adapter'
import Vuex from 'vuex'
import storeVuex from '@/vuex/store'

require('jasmine-ajax');
Vue.use(Vuex);


var mock = new MockAdapter(axios);
var vmLogInPage;


describe('test logInPage.vue', function() {
  const vm = new Vue({
    template: '<div><logInPage></logInPage></div>',
    components: {
      'logInPage': LogInPage
    },
    store: storeVuex
  }).$mount();
  let Token = "eyJhbGciOiJIUzUxMiJ9.eyJmaXJzdE5hbWUiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJpc0FkbWluIjpmYWxzZSwiaWQiOjEsImVtYWlsIjoibGhvdGVAdmlzZW8uY29tIiwidmVyc2lvbiI6MCwiZGVmYXVsdHBpY3R1cmUiOnRydWV9.eguO54P8MHmWrwSREJu5-vCHkhA2Tj995efuHc4twdw";
  beforeEach(function () {
    vmLogInPage = vm.$children[0];
    mock = new MockAdapter(axios);
  });

  afterEach(function () {
    Object.assign(vmLogInPage.$data, vmLogInPage.$options.data());
  });

  it('should verify if the user is already authenticated',function () {
    localStorage.setItem('token', Token);
    expect(vmLogInPage.isAlreadyAuthenticated()).toBe(true);
  });

  it('should verify if the user is an administrator',function () {
    localStorage.setItem('token', Token);
    vmLogInPage.isAdministratorAuthenticated();
  });

  it('should verify if email is empty',function () {
    vmLogInPage.email = "";
    vmLogInPage.isEmailEmpty();
    expect(vmLogInPage.emailEmpty).toBe(true);
  });

  it('should verify if password is empty',function () {
    vmLogInPage.password = "";
    vmLogInPage.isPasswordEmpty();
    expect(vmLogInPage.passwordEmpty).toBe(true);
  });

  it('should verify if the user can connect with his/her email & password',function (done) {
    vmLogInPage.email = "xiangzhe.meng@outlook.com";
    vmLogInPage.password = "123456";
    var collaboratorToLogIn = {
      "email":"xiangzhe.meng@outlook.com",
      "password":"123456"
    };
    var response = {"userConnected":"eyJhbGciOiJIUzUxMiJ9.eyJmaXJzdE5hbWUiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJpc0FkbWluIjpmYWxzZSwiaWQiOjEsImVtYWlsIjoibGhvdGVAdmlzZW8uY29tIiwidmVyc2lvbiI6MCwiZGVmYXVsdHBpY3R1cmUiOnRydWV9.eguO54P8MHmWrwSREJu5-vCHkhA2Tj995efuHc4twdw"};
    mock.onPost(config.server + '/api/user').reply(200,response);
    vmLogInPage.verifyFormBeforeLogIn();
    setTimeout(function() {
      expect(vmLogInPage.collaboratorToLogIn).toEqual(collaboratorToLogIn);
      done();
    },0);
  });

  it('should fail to connect with login',function () {
    vmLogInPage.collaboratorToLogIn = {
      "email":"xiangzhe.meng@outlook.com",
      "password":"123456"
    };
    mock.onPost(config.server + '/api/user').reply(400);
    vmLogInPage.logIn();
  });

  it('should fail to connect with login',function () {
    vmLogInPage.redirectIfAlreadyAuthenticated();
    Token = "eyJhbGciOiJIUzUxMiJ9.eyJmaXJzdE5hbWUiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJpc0FkbWluIjp0cnVlLCJpZCI6MSwiZW1haWwiOiJsaG90ZUB2aXNlby5jb20iLCJ2ZXJzaW9uIjowLCJkZWZhdWx0cGljdHVyZSI6dHJ1ZX0.HEnnSMlLVao1ARGD66uh281OG3ggXLxqdVv5K5wFS8w";
    localStorage.setItem('token', Token);
    vmLogInPage.redirectIfAlreadyAuthenticated();
  });



});

