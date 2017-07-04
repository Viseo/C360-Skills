/**
 * Created by SJO3662 on 29/06/2017.
 */
import Vue from 'vue'
import CustomCircle from '@/components/customComponent/customcircle'
//import storeVuex from '@/vuex/store'
var Constructor = Vue.extend(CustomCircle);
var vmCustomCircle;
//const store = new Vuex.Store(storeVuex);


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

  it('should check add a score',function () {
    vmCustomCircle.score = 4;
    expect(vmCustomCircle.rating).toEqual(4);
  });

 /* it('should check the position top of circle',function () {

    spyOn(vmCustomCircle, 'cx');

    Vue.nextTick(() => {
      expect(vmCustomCircle.store).toHaveBeenCalled()
      done()
    });

    //vmCustomCircle.store.state.cy = 150;
    vmCustomCircle.cy = 0;
    var cxLine = 0;
    var cyLine = 0;
    vmCustomCircle.calculatePosition(cxLine,cyLine);
    var cxLine = 10;
    var cyLine = 10;
    vmCustomCircle.calculatePosition(cxLine,cyLine);
  });*/


});
