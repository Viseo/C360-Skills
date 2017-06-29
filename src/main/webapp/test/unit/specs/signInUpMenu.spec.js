/**
 * Created by SJO3662 on 29/06/2017.
 */
import Vue from 'vue'
import SignInUpMenu from '@/components/layout/signInUpMenu'
require('jasmine-ajax');

var Constructor = Vue.extend(SignInUpMenu);
var vmSignInUpMenu;
let collaboratorToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg";

describe('test signInUpMenu.vue', function() {
   beforeEach(function () {

    vmSignInUpMenu = new Constructor().$mount();
    document.cookie = "token=" + collaboratorToken;
  });

  afterEach(function () {
    Object.assign(vmSignInUpMenu.$data, vmSignInUpMenu.$options.data());

  });

  it('should check variable initialization from navigation-menu component', function () {
    expect(vmSignInUpMenu.color_connexion).toBe('color-red');
    expect(vmSignInUpMenu.color_inscription).toBe('color-red');
    expect(vmSignInUpMenu.tabconnexion).toBe('tab active');
    expect(vmSignInUpMenu.tabinscription).toBe('tab');
  });

  it('should go to inscription form', function () {
    vmSignInUpMenu.$refs.inscriptionButton.click();
    expect(vmSignInUpMenu.tabconnexion).toBe('tab');
    expect(vmSignInUpMenu.tabinscription).toBe('tab active');
    expect(vmSignInUpMenu.newCollab).toBe(true);
  });

  it('should go to connexion form', function () {
    vmSignInUpMenu.$refs.connexionButton.click();
    expect(vmSignInUpMenu.tabconnexion).toBe('tab active');
    expect(vmSignInUpMenu.tabinscription).toBe('tab');
    expect(vmSignInUpMenu.newCollab).toBe(false);
  });

});
document.cookie = "token=" + collaboratorToken + "; expires=Thu, 18 Dec 2013 12:00:00 UTC";
