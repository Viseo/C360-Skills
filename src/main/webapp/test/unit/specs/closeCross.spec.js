/**
 * Created by SJO3662 on 29/06/2017.
 */
import Vue from 'vue'
import CloseCross from '@/components/customComponent/CloseCross'

var Constructor = Vue.extend(CloseCross);
var vmCloseCross;

describe('test CloseCross.vue', function() {
  beforeEach(function () {
    vmCloseCross = new Constructor().$mount();
  });

  afterEach(function () {
    Object.assign(vmCloseCross.$data, vmCloseCross.$options.data());
  });

  it('should if click close cross',function () {
    vmCloseCross.handleClick();
  });


});
