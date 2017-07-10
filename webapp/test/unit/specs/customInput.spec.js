/**
 * Created by SJO3662 on 29/06/2017.
 */

import Vue from 'vue'
import CustomInput from '@/components/customComponent/customInput'
require('jasmine-ajax');

var Constructor = Vue.extend(CustomInput);
var vmCustomInput;

describe('test customInput.vue', function() {
 beforeEach(function () {

   vmCustomInput = new Constructor().$mount();
  });

  afterEach(function () {});

  it('should check function updateValue', function() {
    vmCustomInput.updateValue('HELLO');
  });

  it('should check function handleFocus', function() {
    vmCustomInput.handleFocus();
  });

  it('should check function handleBlur', function() {
    vmCustomInput.handleBlur();
  });
});
