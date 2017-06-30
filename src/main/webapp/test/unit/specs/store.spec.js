/**
 * Created by SJO3662 on 30/06/2017.
 */

import Vue from 'vue'
import Vuex from 'vuex'

import storeVuex from '@/vuex/store'

// Vue.use(Vuex)
// const store = new Vuex.Store(storeVuex);
//import { MUT_PROFILE_HTML, initialState } from '@/vuex/store'


describe('test store.vue', function() {
  beforeEach(function () {

  });

  afterEach(function () {

  });

  it('should call the store', function () {

    /*const getterTest = function getter(state, getters) {
      return state.count
    }

    const spy = spyOn({getterTest}, 'getter').and.callThrough();
    const spyCb = jasmine.createSpy();*/

    /*store.watch(spy, spyCb);

    Vue.nextTick(() => {
      //store.commit(TEST);
      expect(store.state.cx).toBe(1);

      Vue.nextTick(() => {
        expect(spy).toHaveBeenCalledWith(store.state, store.getters);
        done();
      })
    })*/
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
