/**
 * Created by SJO3662 on 29/06/2017.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import CustomCircle from '@/components/customComponent/customcircle'
import storeVuex from '@/vuex/store'
var Constructor = Vue.extend(CustomCircle);
var vmCustomCircle;
Vue.use(Vuex)
//const store = new Vuex.Store(storeVuex);
//import { MUT_PROFILE_HTML, initialState } from '@/vuex/store'


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

 /* it('should check the position top of circle',function () {
    var cxLine = 0;
    var cyLine = 0;

    storeVuex.state.cy = 150;
    storeVuex.state.cx = 0;
    storeVuex.state.cy1 = 0;
    storeVuex.state.cx1 = 0;

    console.log("affectation storeVuex.state.cy: " +storeVuex.state.cy);
    console.log("affectation storeVuex.state.cx: " +storeVuex.state.cx);
    console.log("affectation storeVuex.state.cy1: " +storeVuex.state.cy1);
    console.log("affectation storeVuex.state.cx1: " +storeVuex.state.cx1);

    vmCustomCircle.cy = 0;
    vmCustomCircle.cx = 0;

    var resultat = vmCustomCircle.calculatePosition(cxLine,cyLine);
    console.log("apres storeVuex.state.cy: " +storeVuex.state.cy);
      expect(storeVuex.state.cy).toEqual(100);
    console.log(resultat.toString());
    expect(resultat).toEqual([0,50,0,100]);
  });

  it('should check the position bottom of circle',function () {
    var cxLine = 0;
    var cyLine = 0;

    storeVuex.state.cy = 0;
    storeVuex.state.cx = 0;
    storeVuex.state.cy1 = 0;
    storeVuex.state.cx1 = 0;

    console.log("affectation storeVuex.state.cy: " +storeVuex.state.cy);
    console.log("affectation storeVuex.state.cx: " +storeVuex.state.cx);
    console.log("affectation storeVuex.state.cy1: " +storeVuex.state.cy1);
    console.log("affectation storeVuex.state.cx1: " +storeVuex.state.cx1);

    vmCustomCircle.cy = 150;
    vmCustomCircle.cx = 0;

    var resultat = vmCustomCircle.calculatePosition(cxLine,cyLine);
    console.log("apres storeVuex.state.cy: " +storeVuex.state.cy);
    expect(storeVuex.state.cy).toEqual(50);
    console.log(resultat.toString());
    expect(resultat).toEqual([0,100,0,50]);
  });

  it('should check the position left of circle',function () {
    var cxLine = 0;
    var cyLine = 0;

    storeVuex.state.cy = 0;
    storeVuex.state.cx = 150;
    storeVuex.state.cy1 = 0;
    storeVuex.state.cx1 = 0;

    console.log("affectation storeVuex.state.cy: " +storeVuex.state.cy);
    console.log("affectation storeVuex.state.cx: " +storeVuex.state.cx);
    console.log("affectation storeVuex.state.cy1: " +storeVuex.state.cy1);
    console.log("affectation storeVuex.state.cx1: " +storeVuex.state.cx1);

    vmCustomCircle.cy = 0;
    vmCustomCircle.cx = 0;

    var resultat = vmCustomCircle.calculatePosition(cxLine,cyLine);
    console.log("apres storeVuex.state.cx: " +storeVuex.state.cx);
    expect(storeVuex.state.cx).toEqual(100);
    console.log(resultat.toString());
    expect(resultat).toEqual([50,0,100,0]);

  });

  it('should check the position right of circle',function () {
    var cxLine = 0;
    var cyLine = 0;

    storeVuex.state.cy = 0;
    storeVuex.state.cx = 0;
    storeVuex.state.cy1 = 0;
    storeVuex.state.cx1 = 0;

    console.log("affectation storeVuex.state.cy: " +storeVuex.state.cy);
    console.log("affectation storeVuex.state.cx: " +storeVuex.state.cx);
    console.log("affectation storeVuex.state.cy1: " +storeVuex.state.cy1);
    console.log("affectation storeVuex.state.cx1: " +storeVuex.state.cx1);

    vmCustomCircle.cy = 0;
    vmCustomCircle.cx = 150;

    var resultat = vmCustomCircle.calculatePosition(cxLine,cyLine);
    console.log("apres storeVuex.state.cy: " +storeVuex.state.cy);
    expect(storeVuex.state.cx).toEqual(50);
    console.log(resultat.toString());
    expect(resultat).toEqual([100,0,50,0]);
  });

  it('should check the position left top of circle',function () {
    var cxLine = 0;
    var cyLine = 0;

    storeVuex.state.cy = 150;
    storeVuex.state.cx = 150;
    storeVuex.state.cy1 = 0;
    storeVuex.state.cx1 = 0;

    console.log("affectation storeVuex.state.cy: " +storeVuex.state.cy);
    console.log("affectation storeVuex.state.cx: " +storeVuex.state.cx);
    console.log("affectation storeVuex.state.cy1: " +storeVuex.state.cy1);
    console.log("affectation storeVuex.state.cx1: " +storeVuex.state.cx1);

    vmCustomCircle.cy = 0;
    vmCustomCircle.cx = 0;

    var resultat = vmCustomCircle.calculatePosition(cxLine,cyLine);
    console.log("apres storeVuex.state.cy: " +storeVuex.state.cy);
    console.log("apres storeVuex.state.cx: " +storeVuex.state.cx);
    expect(storeVuex.state.cy).toEqual(150 - 50/Math.sqrt(2));
    expect(storeVuex.state.cx).toEqual(150 - 50/Math.sqrt(2));
    console.log(resultat.toString());
    expect(resultat).toEqual([50/Math.sqrt(2),50/Math.sqrt(2),storeVuex.state.cx,storeVuex.state.cy]);
  });

  it('should check the position right top of circle',function () {
    var cxLine = 0;
    var cyLine = 0;

    storeVuex.state.cy = 150;
    storeVuex.state.cx = 0;
    storeVuex.state.cy1 = 0;
    storeVuex.state.cx1 = 0;

    console.log("affectation storeVuex.state.cy: " +storeVuex.state.cy);
    console.log("affectation storeVuex.state.cx: " +storeVuex.state.cx);
    console.log("affectation storeVuex.state.cy1: " +storeVuex.state.cy1);
    console.log("affectation storeVuex.state.cx1: " +storeVuex.state.cx1);

    vmCustomCircle.cy = 0;
    vmCustomCircle.cx = 150;

    var resultat = vmCustomCircle.calculatePosition(cxLine,cyLine);
    console.log("apres storeVuex.state.cy: " +storeVuex.state.cy);
    console.log("apres storeVuex.state.cx: " +storeVuex.state.cx);
    expect(storeVuex.state.cy).toEqual(150 - 50/Math.sqrt(2));
    expect(storeVuex.state.cx).toEqual(0 + 50/Math.sqrt(2));
    console.log(resultat.toString());
    expect(resultat).toEqual([150 - 50/Math.sqrt(2),50/Math.sqrt(2),storeVuex.state.cx,storeVuex.state.cy]);
  });

  it('should check the position left bottom of circle',function () {
    var cxLine = 0;
    var cyLine = 0;

    storeVuex.state.cy = 0;
    storeVuex.state.cx = 150;
    storeVuex.state.cy1 = 0;
    storeVuex.state.cx1 = 0;

    console.log("affectation storeVuex.state.cy: " +storeVuex.state.cy);
    console.log("affectation storeVuex.state.cx: " +storeVuex.state.cx);
    console.log("affectation storeVuex.state.cy1: " +storeVuex.state.cy1);
    console.log("affectation storeVuex.state.cx1: " +storeVuex.state.cx1);

    vmCustomCircle.cy = 150;
    vmCustomCircle.cx = 0;

    var resultat = vmCustomCircle.calculatePosition(cxLine,cyLine);
    console.log("apres storeVuex.state.cy: " +storeVuex.state.cy);
    console.log("apres storeVuex.state.cx: " +storeVuex.state.cx);
    expect(storeVuex.state.cx).toEqual(150 - 50/Math.sqrt(2));
    expect(storeVuex.state.cy).toEqual(0 + 50/Math.sqrt(2));
    console.log(resultat.toString());
    expect(resultat).toEqual([50/Math.sqrt(2),150 - 50/Math.sqrt(2),storeVuex.state.cx,storeVuex.state.cy]);
  });

  it('should check the position right bottom of circle',function () {
    var cxLine = 0;
    var cyLine = 0;

    storeVuex.state.cy = 0;
    storeVuex.state.cx = 0;
    storeVuex.state.cy1 = 0;
    storeVuex.state.cx1 = 0;

    console.log("affectation storeVuex.state.cy: " +storeVuex.state.cy);
    console.log("affectation storeVuex.state.cx: " +storeVuex.state.cx);
    console.log("affectation storeVuex.state.cy1: " +storeVuex.state.cy1);
    console.log("affectation storeVuex.state.cx1: " +storeVuex.state.cx1);

    vmCustomCircle.cy = 150;
    vmCustomCircle.cx = 150;

    var resultat = vmCustomCircle.calculatePosition(cxLine,cyLine);
    console.log("apres storeVuex.state.cy: " +storeVuex.state.cy);
    console.log("apres storeVuex.state.cx: " +storeVuex.state.cx);
    expect(storeVuex.state.cx).toEqual(0 + 50/Math.sqrt(2));
    expect(storeVuex.state.cy).toEqual(0 + 50/Math.sqrt(2));
    console.log(resultat.toString());
    expect(resultat).toEqual([150 - 50/Math.sqrt(2), 150 - 50/Math.sqrt(2),storeVuex.state.cx,storeVuex.state.cy]);
  });

  it('should check the position right bottom of circle',function () {
    var cxLine = 0;
    var cyLine = 0;

    storeVuex.state.cy = 0;
    storeVuex.state.cx = 0;
    storeVuex.state.cy1 = 0;
    storeVuex.state.cx1 = 0;

    console.log("affectation storeVuex.state.cy: " +storeVuex.state.cy);
    console.log("affectation storeVuex.state.cx: " +storeVuex.state.cx);
    console.log("affectation storeVuex.state.cy1: " +storeVuex.state.cy1);
    console.log("affectation storeVuex.state.cx1: " +storeVuex.state.cx1);

    vmCustomCircle.cy = 0;
    vmCustomCircle.cx = 0;

    var resultat = vmCustomCircle.calculatePosition(cxLine,cyLine);
    console.log("apres storeVuex.state.cy: " +storeVuex.state.cy);
    console.log("apres storeVuex.state.cx: " +storeVuex.state.cx);
    expect(storeVuex.state.cx).toEqual(0);
    expect(storeVuex.state.cy).toEqual(0);
    console.log(resultat.toString());
    expect(resultat).toEqual([0, 0,storeVuex.state.cx,storeVuex.state.cy]);
  });

  it('should check the position right bottom of circle',function () {
    var dummyElement = document.createElement('div');
    dummyElement.setAttribute("id", vmCustomCircle.cx +'' +vmCustomCircle.cy);
    document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);

    vmCustomCircle.checkLine();

    expect(storeVuex.state.cx).toEqual(vmCustomCircle.cx);
    expect(storeVuex.state.cy).toEqual(vmCustomCircle.cy);
  });

  /!*it('should check the position right bottom of circle',function () {
    var dummyElement = document.createElement('div');
    dummyElement.setAttribute("id",storeVuex.state.cx+''+storeVuex.state.cy);
    document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);

    vmCustomCircle.checkLine();

    expect(storeVuex.state.cx).toEqual(vmCustomCircle.cx);
    expect(storeVuex.state.cy).toEqual(vmCustomCircle.cy);
  });*!/*/

});
