import Vue from 'vue'
import axios from 'axios'
import config from '@/config/config'
import RegistrationPage from '@/components/registration/registrationPage'
import MockAdapter from 'axios-mock-adapter'
require('jasmine-ajax');


var Constructor = Vue.extend(RegistrationPage);
var vmRegistrationPage;

var mock = new MockAdapter(axios);
describe('test registrationPage.vue', function() {
 // let resource = { id: 5, name: 'foo' };


  let dispatch = jasmine.createSpy('dispatch');
  beforeEach(function () {
    vmRegistrationPage = new Constructor().$mount();
    mock = new MockAdapter(axios);
  });

  afterEach(function () {
    Object.assign(vmRegistrationPage.$data, vmRegistrationPage.$options.data());
  });

  it('it should verify if the last name is valid when collaborator is filling the last name field', function (done) {
    vmRegistrationPage.lastName = 'DUPUNN';
    setTimeout(function () {
      expect(vmRegistrationPage.isLastNameValid).toBe(true);
      expect(vmRegistrationPage.errorMessageLastName).toBe('');
      done();
    },0);
  });

  it('it should verify if the last name is not valid when collaborator is filling a wrong name in the last name field', function (done) {
    vmRegistrationPage.lastName = 'DUPUNN96';
    setTimeout(function () {
      expect(vmRegistrationPage.isLastNameValid).toBe(false);
      expect(vmRegistrationPage.errorMessageLastName).toBe('Veuillez entrer un nom valide');
      done();
    },0);
  });

  it('it should verify if the first name is valid when collaborator is filling the first name field', function (done) {
    vmRegistrationPage.firstName = 'Eric';
    setTimeout(function () {
      expect(vmRegistrationPage.isFirstNameValid).toBe(true);
      expect(vmRegistrationPage.errorMessageFirstName).toBe('');
      done();
    },0);
  });

  it('it should verify if the first name is not valid when collaborator is filling a wrong name in the first name field', function (done) {
    vmRegistrationPage.firstName = 'Eric96';
    setTimeout(function () {
      expect(vmRegistrationPage.isFirstNameValid).toBe(false);
      expect(vmRegistrationPage.errorMessageFirstName).toBe('Veuillez entrer un prénom valide');
      done();
    },0);
  });

  it('it should verify if email is valid when the collaborator is filling the email field', function (done) {
    vmRegistrationPage.email = 'eric@viseo.com';
    setTimeout(function () {
      expect(vmRegistrationPage.isEmailValid).toBe(true);
      expect(vmRegistrationPage.errorMessageEmail).toBe('');
      done();
    },0);
  });

  it('it should verify if email is nit valid when the collaborator is filling a wrong email in the email field', function (done) {
    vmRegistrationPage.email = 'eric@viseo';
    setTimeout(function () {
      expect(vmRegistrationPage.isEmailValid).toBe(false);
      expect(vmRegistrationPage.errorMessageEmail).toBe('Veuillez entrer un email valide');
      done();
    },0);
  });

  it('it should verify number character password is valid', function (done) {
    vmRegistrationPage.password = '123456';
    setTimeout(function () {
      expect(vmRegistrationPage.errorMessagePassword).toBe('');
      expect(vmRegistrationPage.isPasswordValid).toBe(true);
      done();
    },0);

  });

  it('it should verify number character password is not valid', function (done) {
    vmRegistrationPage.password = '123';
    setTimeout(function () {
      expect(vmRegistrationPage.errorMessagePassword).toBe('Le mot de passe doit avoir au minimum 6 caractères');
      expect(vmRegistrationPage.isPasswordValid).toBe(false);
      done();
    },0);
  });

  it('it should verify confirm password is not valid', function (done) {
    vmRegistrationPage.password = '123456';
    vmRegistrationPage.confirmPassword = '654321';
    setTimeout(function () {
      expect(vmRegistrationPage.errorMessageConfirmPassword).toBe('La confirmation du mot de passe n\'est pas valide');
      expect(vmRegistrationPage.isConfirmPasswordValid).toBe(false);
      done();
    },0);
  });

  it('it should verify confirm password is valid', function (done) {
    vmRegistrationPage.password = '123456';
    vmRegistrationPage.confirmPassword = '123456';
    setTimeout(function () {
      expect(vmRegistrationPage.errorMessageConfirmPassword).toBe('');
      expect(vmRegistrationPage.isConfirmPasswordValid).toBe(true);
      done();
    },0);
  });

  it('it should verify confirm password is not valid', function (done) {
    vmRegistrationPage.password = '123456';
    vmRegistrationPage.confirmPassword = '654321';
    setTimeout(function () {
      expect(vmRegistrationPage.errorMessageConfirmPassword).toBe('La confirmation du mot de passe n\'est pas valide');
      expect(vmRegistrationPage.isConfirmPasswordValid).toBe(false);
      done();
    },0);
  });

  it('it should verify personnal id number is valid', function (done) {
    vmRegistrationPage.personnalIdNumber = 'ABC1234';
    setTimeout(function () {
      expect(vmRegistrationPage.personalIdNumberAlreadyExist).toBe(false);
      expect(vmRegistrationPage.loginEmpty).toBe(false);
      expect(vmRegistrationPage.errorMessageLogin).toBe('');
      expect(vmRegistrationPage.isLoginValid).toBe(true);
      done();
    },0);
  });

  it('it should verify personnal id number is not valid', function (done) {
    vmRegistrationPage.personnalIdNumber = 'ABC12';
    setTimeout(function () {
      expect(vmRegistrationPage.personalIdNumberAlreadyExist).toBe(false);
      expect(vmRegistrationPage.loginEmpty).toBe(false);
      expect(vmRegistrationPage.errorMessageLogin).toBe('Veuillez entrer un code de login valide');
      expect(vmRegistrationPage.isLoginValid).toBe(false);
      done();
    },0);
  });

  it('it should verify form is not empty', function (done) {
    vmRegistrationPage.personnalIdNumber = 'ABC1234';
    vmRegistrationPage.lastName = 'DUPONT';
    vmRegistrationPage.firstName = 'Eric';
    vmRegistrationPage.email = 'eric@viseo.com';
    vmRegistrationPage.password = '123456';
    vmRegistrationPage.confirmPassword = '123456';
    vmRegistrationPage.verifyForm();
    setTimeout(function () {
      expect(vmRegistrationPage.personalIdNumberAlreadyExist).toBe(false);
      expect(vmRegistrationPage.emailAlreadyExist).toBe(false);
      done();
    },0);
  });

  it('it should verify form is empty', function (done) {
    vmRegistrationPage.personnalIdNumber = '';
    vmRegistrationPage.lastName = '';
    vmRegistrationPage.firstName = '';
    vmRegistrationPage.email = '';
    vmRegistrationPage.password = '';
    vmRegistrationPage.confirmPassword = '';
    vmRegistrationPage.setLoginEmptyToFalse();
    vmRegistrationPage.setLastNameEmptyToFalse();
    vmRegistrationPage.setFirstNameEmptyToFalse();
    vmRegistrationPage.setEmailAlreadyExistToFalse();
    vmRegistrationPage.setPasswordEmptyToFalse();
    vmRegistrationPage.setConfirmPasswordEmptyToFalse();
    vmRegistrationPage.verifyForm();
    setTimeout(function () {
      expect(vmRegistrationPage.personalIdNumberAlreadyExist).toBe(false);
      expect(vmRegistrationPage.emailAlreadyExist).toBe(false);
      done();
    },0);
  });

  it('it should verify form is empty', function (done) {
    vmRegistrationPage.toggleShowPassword();
    vmRegistrationPage.toggleShowPasswordConfirmation();
    setTimeout(function () {
      expect(vmRegistrationPage.showPass).toBe(true);
      expect(vmRegistrationPage.showPassConf).toBe(true);
      done();
    },0);
  });

  it('it should add a collaborator',function (done) {
    vmRegistrationPage.collaboratorToRegister = {
      personnalIdNumber:'ABC1234',
      lastName:'DUPONT',
      firstName:'Eric',
      email:'eric@viseo.com',
      password:'123456',
    };
    var response = "success";
    mock.onPost(config.server + '/api/collaborateurs').reply(200,response);
    vmRegistrationPage.addCollaborator();
    setTimeout(function() {
      expect(vmRegistrationPage.personalIdNumberAlreadyExist).toBe(false);
      expect(vmRegistrationPage.emailAlreadyExist).toBe(false);
      done();
    },0);
  });

  it('should fail to add a collaborator because of email',function (done) {
    var response = "personnalIdNumber";
    mock.onPost(config.server + '/api/collaborateurs').reply(200,response);
    vmRegistrationPage.addCollaborator();
    setTimeout(function() {
      expect(vmRegistrationPage.personalIdNumberAlreadyExist).toBe(true);
      expect(vmRegistrationPage.emailAlreadyExist).toBe(false);
      done();
    },0);
  });

  it('should fail to add a collaborator because of personnalIdNumber',function (done) {
    var response = "email";
    mock.onPost(config.server + '/api/collaborateurs').reply(200,response);
    vmRegistrationPage.addCollaborator();
    setTimeout(function() {
      expect(vmRegistrationPage.personalIdNumberAlreadyExist).toBe(false);
      expect(vmRegistrationPage.emailAlreadyExist).toBe(true);
      done();
    },0);
  });

  it('should verify if the user can connect with his/her email & password',function (done) {
    vmRegistrationPage.email = "xiangzhe.meng@outlook.com";
    vmRegistrationPage.password = "123456";
    var collaboratorToLogIn = {
      "email":"xiangzhe.meng@outlook.com",
      "password":"123456"
    };
    var response = {"userConnected":"eyJhbGciOiJIUzUxMiJ9.eyJmaXJzdE5hbWUiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJpc0FkbWluIjpmYWxzZSwiaWQiOjEsImVtYWlsIjoibGhvdGVAdmlzZW8uY29tIiwidmVyc2lvbiI6MCwiZGVmYXVsdHBpY3R1cmUiOnRydWV9.eguO54P8MHmWrwSREJu5-vCHkhA2Tj995efuHc4twdw"};
    mock.onPost(config.server + '/api/user').reply(200,response);
    vmRegistrationPage.logIn();
    setTimeout(function() {
      expect(vmRegistrationPage.collaboratorToLogIn).toEqual(collaboratorToLogIn);
      done();
    },0);
  });

  it('should fail to connect with login',function () {
    vmRegistrationPage.collaboratorToLogIn = {
      "email":"xiangzhe.meng@outlook.com",
      "password":"123456"
    };
    mock.onPost(config.server + '/api/user').reply(400);
    vmRegistrationPage.logIn();
  });

});
