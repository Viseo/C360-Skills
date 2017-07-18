import Vue from 'vue';

import showCollab from '@/components/pages/showCollab'

require('jasmine-ajax');

var Constructor = Vue.extend(showCollab);
var vmShowCollab;

describe('test showCollab.vue', function () {

  beforeEach(function(){

    vmShowCollab = new Constructor().$mount();
  });

  afterEach(function(){});

  it('should function skillInducedExists', function () {
    vmShowCollab.skillInducedExists();
  })

  it('should check function showLevel, rating = 5 ', function () {
    var rating = 5;
    expect(vmShowCollab.showLevel(rating)).toEqual('E');
  });

  it('should check function showLevel rating = 4', function () {
    var rating = 4;
    expect(vmShowCollab.showLevel(rating)).toEqual('A');
  });

  it('should check function showLevel rating = 3', function () {
    var rating = 3;
    expect(vmShowCollab.showLevel(rating)).toEqual('C');
  });

  it('should check function showLevel rating = 2', function () {
    var rating = 2;
    expect(vmShowCollab.showLevel(rating)).toEqual('D');
  });

  it('should check function showLevel rating = 3', function () {
    var rating = 1;
    expect(vmShowCollab.showLevel(rating)).toEqual('E');
  });

  it('should check function showLevel rating = 0', function () {
    var rating = 0;
    expect(vmShowCollab.showLevel(rating)).toEqual('E');
  })


})
