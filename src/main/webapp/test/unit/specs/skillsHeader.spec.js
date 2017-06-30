/**
 * Created by SJO3662 on 29/06/2017.
 */
import Vue from 'vue'
import SkillsHeader from '@/components/layout/skillsHeader'
require('jasmine-ajax');

var Constructor = Vue.extend(SkillsHeader);
var vmSkillsHeader;

describe('test skillsHeader.vue', function() {
  let collaboratorToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg";
  beforeEach(function () {

    vmSkillsHeader = new Constructor().$mount();
  });

  afterEach(function () {
    Object.assign(vmSkillsHeader.$data, vmSkillsHeader.$options.data());

  });

  it('',function () {

  });
});
