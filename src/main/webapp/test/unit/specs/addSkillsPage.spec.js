/**
 * Created by SJO3662 on 30/06/2017.
 */
import Vue from 'vue'
import AddSkillsPage from '@/components/pages/addSkillsPage'
require('jasmine-ajax');


var Constructor = Vue.extend(AddSkillsPage);
var vmAddSkillsPage;

describe('test addSkillsPage.vue', function() {
  let collaboratorToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg";
  beforeEach(function () {

    vmAddSkillsPage = new Constructor().$mount();
  });

  afterEach(function () {
    Object.assign(vmAddSkillsPage.$data, vmAddSkillsPage.$options.data());

  });

  it('should verify if show circle is blur when the skill is selected',function () {
    var id = 1;
    vmAddSkillsPage.selectedSkill = {
      skill1: {id:1,label:'JAVA',version:0},
      skill2: {id:2,label:'J2EE',version:0}
    };
   expect(vmAddSkillsPage.showCircleBlurOrNot(id)).toBe(true);
  });

  it('should verify if show circle is not blur when the skill is not selected',function () {
    var id = 2;
    vmAddSkillsPage.selectedSkill = {
      skill1: {id:1,label:'JAVA',version:0},
      skill2: {id:2,label:'JAVA',version:0}
    };
    expect(vmAddSkillsPage.showCircleBlurOrNot(id)).toBe(false);
  });

  it('should displayInput',function () {
    vmAddSkillsPage.displayInput();
    expect(vmAddSkillsPage.newSkillClicked).toBe(true);
    expect(vmAddSkillsPage.label).toEqual('');
  });

  it('should hide Input when the label have skill',function () {
    vmAddSkillsPage.label = 'JAVA';
    vmAddSkillsPage.hideInput();
    expect(vmAddSkillsPage.newSkillClicked).toBe(false);
    expect(vmAddSkillsPage.label).toEqual('JAVA');
  });

  it('should hide Input when the label is empty',function () {
    vmAddSkillsPage.label = '';
    vmAddSkillsPage.hideInput();
    expect(vmAddSkillsPage.newSkillClicked).toBe(false);
    expect(vmAddSkillsPage.label).toEqual('Nouvelle');
  });

  it('should link PositionX when selected link is empty',function () {
    vmAddSkillsPage.selectedlink = '';
    expect(vmAddSkillsPage.linkPositionX()).toEqual(0);
  });

  it('should link PositionX when selected link is not empty',function () {

    vmAddSkillsPage.selectedlink = {
      id:10,
      skill1: {id:1,label:'JAVA',version:0},
      skill2: {id:2,label:'J2EE',version:0},
      version:0
    };

    expect(vmAddSkillsPage.linkPositionX()).not.toEqual(0);
  });

  it('should link PositionY when selected link is empty',function () {
    vmAddSkillsPage.selectedlink = '';
    expect(vmAddSkillsPage.linkPositionY()).toEqual(0);
  });

  it('should link PositionY when selected link is not empty',function () {

    vmAddSkillsPage.selectedlink = {
      id:10,
      skill1: {id:1,label:'JAVA',version:0},
      skill2: {id:2,label:'J2EE',version:0},
      version:0
    };

    expect(vmAddSkillsPage.linkPositionY()).not.toEqual(0);
  });

  it('should check if one skill is selected',function () {
    /*vmAddSkillsPage.skill = [
      {id:1,label:'JAVA',version:0},
      {id:2,label:'J2EE',version:0},
    ];*/
    vmAddSkillsPage.selectedSkill = {
      skill1: '',
      skill2: ''
    };

    var skill = {id:1,label:'JAVA',version:0};
    vmAddSkillsPage.selectSkill(skill);

    //expect(vmAddSkillsPage.linkPositionY()).not.toEqual(0);
  });

});
