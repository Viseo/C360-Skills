/**
 * Created by SJO3662 on 29/06/2017.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import CustomCircle from '@/components/customComponent/customcircle'
//import store from "@/vuex/store"
var Constructor = Vue.extend(CustomCircle);
var vmCustomCircle;
Vue.use(Vuex)
describe('test customcircle.vue', function() {
  beforeEach(function () {
    vmCustomCircle = new Constructor().$mount();
  });

  afterEach(function () {
    Object.assign(vmCustomCircle.$data, vmCustomCircle.$options.data());
  });

  it('should if click on a circle',function () {
    vmCustomCircle.handleClick();
  });

  it('should check the position top of circle',function () {
   // vmCustomCircle.store.state.cy = 150;
    vmCustomCircle.cy = 0;
    var cxLine;
    var cyLine;
    vmCustomCircle.calculatePosition(cxLine,cyLine);

  });


});
