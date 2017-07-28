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
var $ = window.jQuery = require('jquery');

var vmProfilToUpdate;
var mock;

describe('test profilToUpdatePage.vue', function () {
  let Token = "eyJhbGciOiJIUzUxMiJ9.eyJmaXJzdE5hbWUiOiJlcmljIiwibGFzdE5hbWUiOiJEVVBPTlQiLCJpc0FkbWluIjpmYWxzZSwiaWQiOjEsImVtYWlsIjoiZXJpYy5kdXBvbnRAdmlzZW8uY29tIiwidmVyc2lvbiI6MCwiZGVmYXVsdHBpY3R1cmUiOnRydWV9.e_Shd2hw3VYpECxxbiptCEu-z5fM815wpcxtdDqkhL0";
  localStorage.setItem('token', Token);
  const vm = new Vue({
    template: '<div><profil-to-update></profil-to-update></div>',
    components: {
      'profil-to-update': ProfilToUpdate
    },
    store: storeVuex,
    router: routerConfig.$children
  }).$mount();

  beforeEach(function () {

    vmProfilToUpdate = vm.$children[0];
    mock = new MockAdapter(axios);
  });

  afterEach(function () {
    Object.assign(vmProfilToUpdate.$data, vmProfilToUpdate.$options.data());
  });

  it('it should verify if the first name is valid when collaborator is filling the first name field', function (done) {
    vmProfilToUpdate.firstName = 'Eric';
    setTimeout(function () {
      expect(vmProfilToUpdate.isFirstNameValid).toBe(true);
      expect(vmProfilToUpdate.errorMessageFirstName).toBe('');
      done();
    }, 0);
  });

  it('it should verify if the first name is not valid when collaborator is filling a wrong name in the first name field', function (done) {
    vmProfilToUpdate.firstName = 'Eric96';
    setTimeout(function () {
      expect(vmProfilToUpdate.isFirstNameValid).toBe(false);
      expect(vmProfilToUpdate.errorMessageFirstName).toBe('Veuillez entrer un prénom valide');
      done();
    }, 0);
  });

  it('it should verify if the last name is valid when collaborator is filling the last name field', function (done) {
    vmProfilToUpdate.lastName = 'DUPONT';
    setTimeout(function () {
      expect(vmProfilToUpdate.isLastNameValid).toBe(true);
      expect(vmProfilToUpdate.errorMessageLastName).toBe('');
      done();
    }, 0);
  });

  it('it should verify if the last name is not valid when collaborator is filling a wrong name in the last name field', function (done) {
    vmProfilToUpdate.lastName = 'DUPONT96';
    setTimeout(function () {
      expect(vmProfilToUpdate.isLastNameValid).toBe(false);
      expect(vmProfilToUpdate.errorMessageLastName).toBe('Veuillez entrer un nom valide');
      done();
    }, 0);
  });

  it('it should verify if email is valid when the collaborator is filling the email field', function (done) {
    vmProfilToUpdate.email = 'eric@viseo.com';
    setTimeout(function () {
      expect(vmProfilToUpdate.isEmailValid).toBe(true);
      expect(vmProfilToUpdate.errorMessageEmail).toBe('');
      done();
    }, 0);
  });

  it('it should verify if email is nit valid when the collaborator is filling a wrong email in the email field', function (done) {
    vmProfilToUpdate.email = 'eric@viseo';
    setTimeout(function () {
      expect(vmProfilToUpdate.isEmailValid).toBe(false);
      expect(vmProfilToUpdate.errorMessageEmail).toBe('Veuillez entrer un email valide');
      done();
    }, 0);
  });

  it('it should verify if the character number of old password is valid when collaborator is filling a 6 character password', function (done) {
    vmProfilToUpdate.password = '123456';
    setTimeout(function () {
      expect(vmProfilToUpdate.errorMessageOldPassword).toBe('');
      expect(vmProfilToUpdate.isOldPasswordValid).toBe(true);
      expect(vmProfilToUpdate.isValidOldPassword).toBe(true);
      expect(vmProfilToUpdate.isNotValidOldPassword).toBe(false);
      done();
    }, 0);
  });

  it('it should verify if the character number of old password is not valid when collaborator is filling a 4 character password', function (done) {
    vmProfilToUpdate.password = '123';
    setTimeout(function () {
      expect(vmProfilToUpdate.errorMessageOldPassword).toBe('Le mot de passe doit avoir au minimum 6 caractères');
      expect(vmProfilToUpdate.isOldPasswordValid).toBe(false);
      expect(vmProfilToUpdate.isValidOldPassword).toBe(false);
      expect(vmProfilToUpdate.isNotValidOldPassword).toBe(true);
      done();
    }, 0);
  });

  it('it should verify confirm password is not valid', function (done) {
    vmProfilToUpdate.newPassword = '123';
    vmProfilToUpdate.confirmPassword = '456';
    setTimeout(function () {
      expect(vmProfilToUpdate.errorMessageConfirmPassword).toBe('La confirmation du mot de passe n\'est pas valide');
      expect(vmProfilToUpdate.isConfirmPasswordValid).toBe(false);
      expect(vmProfilToUpdate.isValidConfirmPassword).toBe(false);
      expect(vmProfilToUpdate.isNotValidConfirmPassword).toBe(true);
      done();
    }, 0);
  });

  it('it should verify confirm password is valid', function (done) {
    vmProfilToUpdate.newPassword = '123456';
    vmProfilToUpdate.confirmPassword = '123456';
    setTimeout(function () {
      expect(vmProfilToUpdate.errorMessageConfirmPassword).toBe('');
      expect(vmProfilToUpdate.isConfirmPasswordValid).toBe(true);
      expect(vmProfilToUpdate.isValidConfirmPassword).toBe(true);
      expect(vmProfilToUpdate.isNotValidConfirmPassword).toBe(false);
      done();
    }, 0);
  });

  it('it should test if the first name is empty', function () {
    vmProfilToUpdate.isFirstNameEmpty();
    expect(vmProfilToUpdate.firstNameEmpty).toBe(true);
  });

  it('it should test if the first name is not empty', function () {
    vmProfilToUpdate.firstName = 'Eric';
    vmProfilToUpdate.isFirstNameEmpty();
    expect(vmProfilToUpdate.firstNameEmpty).not.toBe(true);
  });

  it('it should test if the last name is empty', function () {
    vmProfilToUpdate.isLastNameEmpty();
    expect(vmProfilToUpdate.lastNameEmpty).toBe(true);
  });

  it('it should test if the last name is not empty', function () {
    vmProfilToUpdate.lastName = 'DUPONT';
    vmProfilToUpdate.isLastNameEmpty();
    expect(vmProfilToUpdate.lastNameEmpty).not.toBe(true);
  });

  it('it should test if the email is empty', function () {
    vmProfilToUpdate.isEmailEmpty();
    expect(vmProfilToUpdate.emailEmpty).toBe(true);
  });

  it('it should test if the email is not empty', function () {
    vmProfilToUpdate.email = 'eric.dupont@viseo.com';
    vmProfilToUpdate.isEmailEmpty();
    expect(vmProfilToUpdate.emailEmpty).not.toBe(true);
  });

  it('it should test if the old password is empty', function () {
    vmProfilToUpdate.isOldPasswordEmpty();
    expect(vmProfilToUpdate.oldPasswordEmpty).toBe(true);
    expect(vmProfilToUpdate.isValidOldPassword).toBe(false);
    expect(vmProfilToUpdate.isNotValidOldPassword).toBe(false);
  });

  it('it should test if the old password is not empty', function () {
    vmProfilToUpdate.password = '123456';
    vmProfilToUpdate.isOldPasswordEmpty();
    expect(vmProfilToUpdate.oldPasswordEmpty).toBe(false);
    expect(vmProfilToUpdate.isValidOldPassword).toBe(false);
    expect(vmProfilToUpdate.isNotValidOldPassword).toBe(false);
  });

  it('it should test if the password is empty', function () {
    vmProfilToUpdate.isPasswordEmpty();
    expect(vmProfilToUpdate.passwordEmpty).toBe(true);
    expect(vmProfilToUpdate.isValidPassword).toBe(false);
    expect(vmProfilToUpdate.isNotValidPassword).toBe(false);
  });

  it('it should test if the password is not empty', function () {
    vmProfilToUpdate.newPassword  = '987654';
    vmProfilToUpdate.isPasswordEmpty();
    expect(vmProfilToUpdate.passwordEmpty).toBe(false);
    expect(vmProfilToUpdate.isValidPassword).toBe(false);
    expect(vmProfilToUpdate.isNotValidPassword).toBe(false);
  });

  it('it should test if the confirm password is empty', function () {
    vmProfilToUpdate.isConfirmPasswordEmpty();
    expect(vmProfilToUpdate.confirmPasswordEmpty).toBe(true);
    expect(vmProfilToUpdate.isValidConfirmPassword).toBe(false);
    expect(vmProfilToUpdate.isNotValidConfirmPassword).toBe(true);
  });

  it('it should test if the confirm password is not empty', function () {
    vmProfilToUpdate.confirmPassword   = '987654';
    vmProfilToUpdate.isConfirmPasswordEmpty();
    expect(vmProfilToUpdate.confirmPasswordEmpty).toBe(false);
    expect(vmProfilToUpdate.isValidConfirmPassword).toBe(false);
    expect(vmProfilToUpdate.isNotValidConfirmPassword).toBe(false);
  });

  it('it should the collaborator information empty pass false', function () {
    vmProfilToUpdate.setLastNameEmptyToFalse();
    vmProfilToUpdate.setFirstNameEmptyToFalse();
    vmProfilToUpdate.setEmailAlreadyExistToTrue();
    vmProfilToUpdate.setOldPasswordEmptyToFalse();
    vmProfilToUpdate.setPasswordEmptyToFalse();
    vmProfilToUpdate.setConfirmPasswordEmptyToFalse();
    vmProfilToUpdate.toggleShowPassword();

    expect(vmProfilToUpdate.lastNameEmpty).toBe(false);
    expect(vmProfilToUpdate.firstNameEmpty).toBe(false);
    expect(vmProfilToUpdate.emailEmpty).toBe(false);
    expect(vmProfilToUpdate.oldPasswordEmpty).toBe(false);
    expect(vmProfilToUpdate.passwordEmpty).toBe(false);
    expect(vmProfilToUpdate.confirmPasswordEmpty).toBe(false);
    expect(vmProfilToUpdate.showPass).toBe(true);
  });

  it('it should test saveUpdateCollaborator()', function (done) {

    var response = {userConnected: Token};
    vmProfilToUpdate.CollabToUpdate = {
      email: "eric.dupont@viseo.com",
      admin: false,
      businessUnit: null,
      firstName: "Eric",
      function: null,
      id: 1,
      isAdmin: false,
      lastName: "DUPONT",
      password: "987654",
      personnalIdNumber: "AAB1234",
      version: 0
    };
    mock.onPut(config.server + "/api/updatecollaborator", vmProfilToUpdate.CollabToUpdate).reply(200,response);

    vmProfilToUpdate.saveUpdateCollaborator();

    setTimeout(function () {
      done();
    }, 100);
  });

  it('it should collect all information of collaborator in database with success response', function (done) {
    var response = [{
      email: "eric.dupont@viseo.com",
      admin: false,
      businessUnit: null,
      firstName: "Eric",
      function: null,
      id: 1,
      isAdmin: false,
      lastName: "DUPONT",
      password: "987654",
      personnalIdNumber: "AAB1234",
      version: 0
    }];
    vmProfilToUpdate.collaborator_id = 1;
    mock.onGet(config.server + "/api/collabdescriptionbyid/1").reply(200, response);
    vmProfilToUpdate.getCollabDescription();
    setTimeout(function () {
      expect(vmProfilToUpdate.collabDescription).toEqual(response);

      expect(vmProfilToUpdate.firstName).toEqual(vmProfilToUpdate.collabDescription.firstName);
      expect(vmProfilToUpdate.lastName).toEqual(vmProfilToUpdate.collabDescription.lastName);
      expect(vmProfilToUpdate.email).toEqual(vmProfilToUpdate.collabDescription.email);
      expect(vmProfilToUpdate.fonction).toEqual(vmProfilToUpdate.collabDescription.function);
      done();
    }, 0);
  });

    it('it should update collaborator password when collaborator changed his password with the picture profil not changed and click on the save button', function (done) {

      vmProfilToUpdate.collabDescription = {
        email: "eric.dupont@viseo.com",
        admin: false,
        businessUnit: null,
        firstName: "Eric",
        function: null,
        id: 1,
        isAdmin: false,
        lastName: "DUPONT",
        password: "123456",
        personnalIdNumber: "AAB1234",
        defaultPicture: true,
        version: 0
      };

      vmProfilToUpdate.newPassword = '987654';
      vmProfilToUpdate.confirmPassword = '987654';
      vmProfilToUpdate.password = '123456';
      vmProfilToUpdate.imageHasBeenChanged = true;

      mock.onPost(config.server + '/fileUpload').reply(200);

      vmProfilToUpdate.updateCollaboratorInfo();

      setTimeout(function () {
        expect(vmProfilToUpdate.CollabToUpdate.defaultPicture).toBe(false);
        expect(vmProfilToUpdate.oldPasswordEmpty).toBe(false);
        expect(vmProfilToUpdate.isRightOldPassword).toBe(true);
        expect(vmProfilToUpdate.passwordEmpty).toBe(false);
        done();
      }, 0);
    });

  it('it should update collaborator password when collaborator changed his password with a new picture profil and click on the save button', function (done) {
    var response = [{userConnected: Token}];
    vmProfilToUpdate.collabDescription = {
      email: "eric.dupont@viseo.com",
      admin: false,
      businessUnit: null,
      firstName: "Eric",
      function: null,
      id: 1,
      isAdmin: false,
      lastName: "DUPONT",
      password: "123456",
      personnalIdNumber: "AAB1234",
      defaultPicture: true,
      version: 0
    };
    var CollabToUpdate = {
      email: "eric.dupont@viseo.com",
      admin: false,
      businessUnit: null,
      firstName: "Eric",
      function: null,
      id: 1,
      isAdmin: false,
      lastName: "DUPONT",
      password: "123456",
      personnalIdNumber: "AAB1234",
      defaultPicture: true,
      version: 0
    };

    vmProfilToUpdate.newPassword = '987654';
    vmProfilToUpdate.confirmPassword = '987654';
    vmProfilToUpdate.password = '123456';
    vmProfilToUpdate.imageHasBeenChanged = false;

    //mock.onPut(config.server + "/api/updatecollaborator",CollabToUpdate).reply(200,response);

    vmProfilToUpdate.updateCollaboratorInfo();
    setTimeout(function () {
      expect(vmProfilToUpdate.oldPasswordEmpty).toBe(false);
      expect(vmProfilToUpdate.isRightOldPassword).toBe(true);
      expect(vmProfilToUpdate.passwordEmpty).toBe(false);
      done();
    }, 0);
  });

  it('it should update collaborator password when collaborator changed his password but the newPassword is diffrente confirmPassword and click on the save button', function (done) {

    vmProfilToUpdate.collabDescription = {
      email: "eric.dupont@viseo.com",
      admin: false,
      businessUnit: null,
      firstName: "Eric",
      function: null,
      id: 1,
      isAdmin: false,
      lastName: "DUPONT",
      password: "123456",
      personnalIdNumber: "AAB1234",
      defaultPicture: true,
      version: 0
    };

    vmProfilToUpdate.newPassword = '987654';
    vmProfilToUpdate.confirmPassword = '987674';
    vmProfilToUpdate.password = '123456';
    vmProfilToUpdate.imageHasBeenChanged = false;

    vmProfilToUpdate.updateCollaboratorInfo();
    setTimeout(function () {
      expect(vmProfilToUpdate.oldPasswordEmpty).toBe(false);
      expect(vmProfilToUpdate.isRightOldPassword).toBe(true);
      expect(vmProfilToUpdate.passwordEmpty).toBe(false);
      done();
    }, 0);
  });

  it('it should update collaborator password when collaborator changed his password with the newPassword is not different and click on the save button', function (done) {

    vmProfilToUpdate.collabDescription = {
      email: "eric.dupont@viseo.com",
      admin: false,
      businessUnit: null,
      firstName: "Eric",
      function: null,
      id: 1,
      isAdmin: false,
      lastName: "DUPONT",
      password: "123456",
      personnalIdNumber: "AAB1234",
      defaultPicture: true,
      version: 0
    };

    vmProfilToUpdate.newPassword = '123456';
    vmProfilToUpdate.confirmPassword = '';
    vmProfilToUpdate.password = '123456';
    vmProfilToUpdate.imageHasBeenChanged = false;

    vmProfilToUpdate.updateCollaboratorInfo();
    setTimeout(function () {
      expect(vmProfilToUpdate.oldPasswordEmpty).toBe(false);
      expect(vmProfilToUpdate.isRightOldPassword).toBe(false);
      expect(vmProfilToUpdate.passwordEmpty).toBe(false);
      expect(vmProfilToUpdate.errorMessageOnSubmit).toEqual("Votre nouveau mot de passe doit être différent de votre ancien mot de passe.");
      done();
    }, 0);
  });

  it('it should update collaborator password when collaborator changed his password with the password is different and click on the save button', function (done) {

    vmProfilToUpdate.collabDescription = {
      email: "eric.dupont@viseo.com",
      admin: false,
      businessUnit: null,
      firstName: "Eric",
      function: null,
      id: 1,
      isAdmin: false,
      lastName: "DUPONT",
      password: "123456",
      personnalIdNumber: "AAB1234",
      defaultPicture: true,
      version: 0
    };

    vmProfilToUpdate.newPassword = '';
    vmProfilToUpdate.confirmPassword = '';
    vmProfilToUpdate.password = '123459';
    vmProfilToUpdate.imageHasBeenChanged = false;

    vmProfilToUpdate.updateCollaboratorInfo();
    setTimeout(function () {
      expect(vmProfilToUpdate.oldPasswordEmpty).toBe(false);
      expect(vmProfilToUpdate.isRightOldPassword).toBe(false);
      expect(vmProfilToUpdate.passwordEmpty).toBe(false);
      expect(vmProfilToUpdate.errorMessageOnSubmit).toEqual("Ancien mot de passe incorrect.");
      done();
    }, 0);
  });

  it('it should update collaborator password when collaborator changed his password but fields empty with the picture profil not changed and click on the save button', function (done) {

    vmProfilToUpdate.collabDescription = {
      email: "eric.dupont@viseo.com",
      admin: false,
      businessUnit: null,
      firstName: "Eric",
      function: null,
      id: 1,
      isAdmin: false,
      lastName: "DUPONT",
      password: "123456",
      personnalIdNumber: "AAB1234",
      defaultPicture: true,
      version: 0
    };

    vmProfilToUpdate.newPassword = '';
    vmProfilToUpdate.confirmPassword = '';
    vmProfilToUpdate.password = '';
    vmProfilToUpdate.imageHasBeenChanged = true;

    vmProfilToUpdate.updateCollaboratorInfo();
    setTimeout(function () {
      expect(vmProfilToUpdate.oldPasswordEmpty).toBe(false);
      expect(vmProfilToUpdate.passwordEmpty).toBe(false);
      expect(vmProfilToUpdate.confirmPasswordEmpty).toBe(false);
      expect(vmProfilToUpdate.isRightOldPassword).toBe(true);
      expect(vmProfilToUpdate.CollabToUpdate.defaultPicture).toBe(false);
      done();
    }, 0);
  });

  it('it should update collaborator password when collaborator changed his password but fields empty with the picture change ', function (done) {

    vmProfilToUpdate.collabDescription = {
      email: "eric.dupont@viseo.com",
      admin: false,
      businessUnit: null,
      firstName: "Eric",
      function: null,
      id: 1,
      isAdmin: false,
      lastName: "DUPONT",
      password: "123456",
      personnalIdNumber: "AAB1234",
      defaultPicture: true,
      version: 0
    };

    vmProfilToUpdate.newPassword = '';
    vmProfilToUpdate.confirmPassword = '';
    vmProfilToUpdate.password = '';
    vmProfilToUpdate.imageHasBeenChanged = false;

    vmProfilToUpdate.updateCollaboratorInfo();
    setTimeout(function () {
      expect(vmProfilToUpdate.oldPasswordEmpty).toBe(false);
      expect(vmProfilToUpdate.passwordEmpty).toBe(false);
      expect(vmProfilToUpdate.confirmPasswordEmpty).toBe(false);
      expect(vmProfilToUpdate.isRightOldPassword).toBe(true);
      done();
    }, 0);
  });
});
