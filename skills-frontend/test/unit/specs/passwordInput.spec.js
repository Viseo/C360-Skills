/**
 * Created by SJO3662 on 29/06/2017.
 */
import Vue from 'vue'
import PasswordInput from '@/components/customComponent/passwordInput'


var Constructor = Vue.extend(PasswordInput);
var vmPasswordInput;

describe('test passwordInput.vue', function() {
  beforeEach(function () {

    vmPasswordInput = new Constructor().$mount();
  });

  afterEach(function () {
    Object.assign(vmPasswordInput.$data, vmPasswordInput.$options.data());
  });

  it('should check function updateValue', function() {
    vmPasswordInput.updateValue('HELLO');
  });

  it('should check function handleFocus', function() {
    vmPasswordInput.handleFocus();
  });

  it('should check function handleBlur', function() {
    vmPasswordInput.handleBlur();
  });

  it('should check function handleClick', function() {
    vmPasswordInput.handleClick();
  });
});
