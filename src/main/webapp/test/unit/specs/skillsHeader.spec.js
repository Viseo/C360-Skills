/**
 * Created by SJO3662 on 29/06/2017.
 */
import Vue from 'vue'
import MockAdapter from 'axios-mock-adapter'

import SkillsHeader from '@/components/layout/skillsHeader'

require('jasmine-ajax');

import storeVuex from '@/vuex/store'
var mock;
//const store = new Vuex.Store(storeVuex);

var Constructor = Vue.extend(SkillsHeader);
var vmSkillsHeader;

describe('test skillsHeader.vue', function() {
  let Token = "eyJhbGciOiJIUzUxMiJ9.eyJmaXJzdE5hbWUiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJpc0FkbWluIjpmYWxzZSwiaWQiOjEsImVtYWlsIjoibGhvdGVAdmlzZW8uY29tIiwidmVyc2lvbiI6MCwiZGVmYXVsdHBpY3R1cmUiOnRydWV9.eguO54P8MHmWrwSREJu5-vCHkhA2Tj995efuHc4twdw";
  beforeEach(function () {

    vmSkillsHeader = new Constructor().$mount();
  });

  afterEach(function () {
    Object.assign(vmSkillsHeader.$data, vmSkillsHeader.$options.data());

  });

  it('',function () {

  });
});
