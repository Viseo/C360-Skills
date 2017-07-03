import Vue from 'vue'
import axios from 'axios'
import config from '@/config/config'
import ShowSkillsCollab from '@/components/pages/showSkillsCollabPage'
import MockAdapter from 'axios-mock-adapter'
require('jasmine-ajax');

var Constructor = Vue.extend(ShowSkillsCollab);
var vmShowSkillsCollabPage;

var mock = new MockAdapter(axios);

describe('Test showSkillCollab', function() {
  let collaboratorToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg";
  beforeEach(function () {
    vmAddSkillsPage = new Constructor().$mount();
    mock = new MockAdapter(axios);
  });

  afterEach(function () {
    Object.assign(vmAddSkillsPage.$data, vmAddSkillsPage.$options.data());
  });


});
