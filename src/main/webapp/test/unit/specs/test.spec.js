/**
 * Created by CLH3623 on 22/06/2017.
 */
import Vue from 'vue'
import RegistrationPage from '@/components/registration/registrationPage'

describe('test RegistrationPage.vue', function() {

  it("says hello", function() {
    const Constructor = Vue.extend(RegistrationPage);
    const vmRegistrationPage = new Constructor().$mount();
    vmRegistrationPage.lastName = 'DUPUNN';
    expect(vmRegistrationPage.lastName).toBe('DUPUNN');
  })

});
