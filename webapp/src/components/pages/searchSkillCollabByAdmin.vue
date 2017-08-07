<template>
  <div class="container-fluid">
    <div class="col-lg-offset-4 col-lg-4 searchField typeaheadSkills">
      <span class="squareForglyphiconSearch">
      <span class="glyphicon glyphicon-search" ref="searchSkill " @click="typeAheadSearch()"></span>
        </span>
      <typeahead
        class="inputForm "
        v-model="value"
        :data="searchResult"
        placeholder="Chercher une compétence"
        :template="typeaheadTemplate">
      </typeahead>
    </div>
    <div class="svg-container" id="svg-container">
      <h4 class="mystyle">Rechercher des compétences</h4>
      <hr class="myhrline">
    </div>
    <svg version="1.1" :viewBox="myViewBox" preserveAspectRatio="xMinYMin meet">
      <defs>
        <filter id="blurMe">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4"/>
        </filter>
      </defs>
      <g v-for="link in links">
        <line @mouseover="selectedlink = link;showCross = true;" :x1="getPositionXById(link.skill1.id)"
              :y1="getPositionYById(link.skill1.id)"
              :x2="getPositionXById(link.skill2.id)"
              :y2="getPositionYById(link.skill2.id)" style="stroke:rgba(0,0,0,0.52);stroke-width:3"/>
      </g>

      <g v-for="(expertise,i) in expertises">
        <customCircle :id="expertise.skill.id" :cx="positionX(i)" :cy="positionY(i)" :content="expertise.skill.label"
                      stroke="#E03559" fill="white" @click="selectedExpertise = expertise; selectedSkills();"
                      :showCircleBlur="isFound(expertise.skill.label)" :score="expertise.level" :expertise="expertise"
                      @clicked="onClickChild" @getExpertise="setExpertise"/>
      </g>
    </svg>
    <p id="noResult" v-show="noCollabFound">Aucun résultat ne correspond à votre recherche.</p>
    <ShowCollab :expertises="listCollaboratorsExpertises"></ShowCollab>
  </div>
</template>

<script>
  import Vue from 'vue'
  import CustomCircle from "../customComponent/customcircle.vue";
  import axios from "axios";
  import config from '../../config/config';
  import ShowCollab from "../pages/showCollab.vue";
  import VueStrap from 'vue-strap';


  var $ = window.jQuery = require('jquery');
  Vue.component('typeahead', VueStrap.typeahead);

  export default {
    data(){
      return {
        typeaheadTemplate: `<div v-if="this.$parent.$parent.CollabExist(item)"><img style="border-radius:50%; margin-right:10px;" width="25px" height="25px" src="/static/lion.jpg">
        <span>{{item}}</span></div>
        <span v-else>{{item}}</span>`,
        value: '',
        levelSelected: 0,
        searchResult: [],
        selectedExpertise: {},
        links: [],
        selectedSkill: {
          skill1: '',
          skill2: ''
        },
        collabs: [],
        myViewBox: "0 0 1250 1250",
        posX: 100,
        posY: 60,
        skills: [],
        row: 0,
        foundSkills: [],
        expertises: [],
        collaboratorsByExpertise: [],
        collabLogged: {},
        inductExpertiseByCollaborators: [],
        foundCollab: {},
        collabExpertises: [],
        CollabSkillChosenAndInduit: {
          collaborator: {},
          expertisesChosen: [],
          expertisesInduit: []
        },
        noCollabFound: false,
        inductedExpertiseCollab: [],
        listCollaboratorsExpertises: [], //variable pour recherche par compétence
        CollaboratorExpertises: { //variable pour typeheader
          collaborator: {},
          expertisesChosen: [],
          expertisesInduit: []
        }

      }
    },
    mounted(){
      this.getCollabLogged();
      this.getAllLinks();
      this.getAllSkills();
      this.getAllExpertise();

    },

    methods: {
      typeAheadSearch(){
        for (var i in this.collabs) {
          if (this.value.indexOf(this.collabs[i].lastName) != -1 || this.value.indexOf(this.collabs[i].firstName) != -1) {
            this.foundCollab = this.collabs[i];
            for (var i in this.foundSkills) {
              this.foundSkills = [];
            }
            this.getFoundCollabExpertises();
          }
        }
        for (var i in this.expertises) {
          if (this.expertises[i].skill.label == this.value) {
            this.selectedExpertise = this.expertises[i];
            this.selectedSkills();
          }
        }
      },

      onClickChild (value) {
        console.log(value);
        this.levelSelected = value;
      },
      setExpertise (value) {
        console.log(value);
        this.selectedExpertise = value;
        this.selectedSkills();
      },
      getAllExpertise(){
        axios.get(config.server + '/api/getcollabexpertises/' + this.collabLogged.id).then(
          response => {
            this.expertises = response.data;
            this.getAllLinks();
            this.expertises.sort(function (a, b) {
              return (a.skill.id > b.skill.id) ? 1 : ((b.skill.id > a.skill.id) ? -1 : 0);
            });
            this.myViewBox = "0 0 1250 " + parseInt((Math.floor(this.expertises.length / 8) * 150) + 200);
          }, response => {
            console.log(response);
          });
      },

      getFoundCollabExpertises(){
        axios.get(config.server + '/api/getcollabexpertises/' + this.foundCollab.id).then(
          response => {
            this.collabExpertises = response.data;
            for (var index = 0; index < this.collabExpertises.length; index++) {
              if (this.collabExpertises[index].noted == false) {
                this.collabExpertises.splice(index, 1);
                index--;
              }
            }
            this.collabExpertises.sort(function (a, b) {
              return (a.level < b.level) ? 1 : ((b.level < a.level) ? -1 : 0);
            });
            if (this.collabExpertises.length > 3) {
              this.collabExpertises.splice(3, this.collabExpertises.length - 3);
            }
            this.CollaboratorExpertises = {
              collaborator: {},
              expertisesChosen: [],
              expertisesInduit: []
            };
            this.CollaboratorExpertises.collaborator = this.collabExpertises[0].collaborator;
            for (var i = 0; i < this.collabExpertises.length; i++) {
              this.CollaboratorExpertises.expertisesChosen.push(this.collabExpertises[i]);
            }
          }, response => {
            console.log(response);
          }).then(response => {
            axios.post(config.server + '/api/expertisebycollaborator', this.collabExpertises).then(response => {
                this.inductedExpertiseCollab = response.data;
                this.inductedExpertiseCollab.sort(function (a, b) {
                  return (a.level < b.level) ? 1 : ((b.level < a.level) ? -1 : 0);
                });
                for (var i = 0; i < this.inductedExpertiseCollab.length; i++) {
                  for (var j = 0; j < this.collabExpertises.length; j++) {
                    if (this.collabExpertises[j].id == this.inductedExpertiseCollab[i].id) {
                      this.inductedExpertiseCollab.splice(i, 1);
                      i--;
                      break;
                    }
                  }
                }
                if (this.inductedExpertiseCollab.length > 3) {
                  this.inductedExpertiseCollab.splice(3, this.inductedExpertiseCollab.length - 3);
                }
                for (var i = 0; i < this.inductedExpertiseCollab.length; i++) {
                  this.CollaboratorExpertises.expertisesInduit.push(this.inductedExpertiseCollab[i]);
                }
                this.listCollaboratorsExpertises = [];
                this.listCollaboratorsExpertises.push(this.CollaboratorExpertises);
              },
              response => {
                console.log(response);
              })
          }
        );
      },
      isFound(name){
        for (var i in this.foundSkills) {
          if (this.foundSkills[i].skill.label == name)
            return true;
        }
      },
      getCollabLogged(){
        this.collabLogged.id = this.$store.getters.collaboratorLoggedIn.id;
        this.collabLogged.version = this.$store.getters.collaboratorLoggedIn.version;
        this.collabLogged.lastName = this.$store.getters.collaboratorLoggedIn.lastName;
        this.collabLogged.firstName = this.$store.getters.collaboratorLoggedIn.firstName;
        this.collabLogged.email = this.$store.getters.collaboratorLoggedIn.email;
        this.collabLogged.defaultPicture = this.$store.getters.collaboratorLoggedIn.defaultPicture;
      },
      getAllLinks(){
        axios.get(config.server + "/api/links/").then(response => {
          this.links = response.data;
          this.links.sort(function (a, b) {
            return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);
          });
        }, response => {
          console.log(response);
        });
      },

      getAllSkills(){
        axios.get(config.server + "/api/skills/").then(response => {
          this.skills = response.data;
          console.log(JSON.stringify(this.skills));
          this.skills.sort(function (a, b) {
            return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);
          });
          this.myViewBox = "0 0 1250 " + parseInt((Math.floor(this.skills.length / 8) * 150) + 200);
          console.log(this.myViewBox);
          this.getCollabs();

        }, response => {
          console.log(response);
        })

      },

      selectedSkills(){
        this.foundCollab = '';
        for (var i in this.foundSkills) {
          if (this.foundSkills[i].skill.id == this.selectedExpertise.skill.id) {
            document.getElementById(this.foundSkills[i].skill.id).getElementsByTagName("circle")[0].removeAttribute("filter");
            this.foundSkills.splice(i, 1);
            if (this.levelSelected == 0) {
              this.selectedExpertise.level = 0;
              this.listCollaboratorsExpertises.splice(0, this.listCollaboratorsExpertises.length)
              if (this.foundSkills.length != 0)
                this.getCollaboratorsByExpertises(this.foundSkills);
              return;
            }
          }
        }
        this.selectedExpertise.level = this.levelSelected;
        this.foundSkills.push(this.selectedExpertise);
        document.getElementById(this.selectedExpertise.skill.id).getElementsByTagName("circle")[0].setAttribute("filter", "url(#blurMe)");
        this.collaboratorsByExpertise.splice(0, this.collaboratorsByExpertise.length);
        if (this.foundCollab == "")
          this.getCollaboratorsByExpertises(this.foundSkills);
        this.levelSelected = 0;
      },

      positionX(integ){
        return this.posX + ((integ) % 8) * 150;
      },

      positionY(integ){
        return this.posY + Math.floor((integ) / 8) * 150;
      },

      getPositionXById(id){
        return this.waitForElementToDisplay(id, 0, "cx");
      },

      getPositionYById(id){
        return this.waitForElementToDisplay(id, 0, "cy");
      },
//
//      showCircleBlurOrNot(id){
//        if (this.selectedSkill.skill1.id == id) {
//          return true
//        }
//        return false;
//      },

      linkPositionX(){
        if (this.selectedlink != '') {
          var x1 = parseFloat(this.getPositionXById(this.selectedlink.skill1.id)) - 6;
          var x2 = parseInt(this.getPositionXById(this.selectedlink.skill2.id)) - 6;
          var total = (x1 + x2) / 2;
          return total
        }
        else
          return 0
      },

      waitForElementToDisplay(selector, time, position){
        let self = this;
        if (document.getElementById(selector) != null) {
          return document.getElementById(selector).getElementsByTagName("circle")[0].getAttribute(position);
        }
        else {
          setTimeout(function () {
            self.waitForElementToDisplay(selector, time);
          }, time);
        }
      },

      linkPositionY(){
        if (this.selectedlink != '') {
          var y1 = parseInt(this.getPositionYById(this.selectedlink.skill1.id)) - 5;
          var y2 = parseInt(this.getPositionYById(this.selectedlink.skill2.id)) - 5;
          var somme = y1 + y2;
          return somme / 2
        }
        else
          return 0;
      },
//
//      showCircleBlurOrNot(id){
//        if (this.selectedSkill.skill1.id == id) {
//          return true
//        }
//        return false;
//      },

      getCollabs(){
        this.searchResult.splice(0, this.searchResult.length);
        axios.get(config.server + '/api/collaborateurs').then(response => {
            this.collabs = response.data;
            for (var index in this.skills) {
              this.searchResult.push(this.skills[index].label);
            }
            for (var index in this.collabs) {
              this.searchResult.push(this.collabs[index].firstName + ' ' + this.collabs[index].lastName);
            }
          },
          response => {
            console.log(response);
          })
      },
      getCollaboratorsByExpertises(listExpertises){

        axios.post(config.server + '/api/collaboratorsexpertises', listExpertises).then(response => {
            this.collaboratorsByExpertise = response.data;
            this.collaboratorsByExpertise.sort(function (a, b) {
              return (a.collaborator.id > b.collaborator.id) ? 1 : ((b.collaborator.id > a.collaborator.id) ? -1 : 0);
            });
            this.listCollaboratorsExpertises = [];
            this.CollabSkillChosenAndInduit = {
              collaborator: {},
              expertisesChosen: [],
              expertisesInduit: []
            };
            if (this.collaboratorsByExpertise.length != 0) {
              this.noCollabFound = false;
              this.CollabSkillChosenAndInduit.collaborator = this.collaboratorsByExpertise[0].collaborator;
            } else {
              this.noCollabFound = true;
            }
            this.CollabSkillChosenAndInduit.expertisesChosen.push(this.collaboratorsByExpertise[0]);
            if (this.collaboratorsByExpertise.length == 1) {
              this.listCollaboratorsExpertises.push(this.CollabSkillChosenAndInduit);
            }
            else {
              for (var i = 1; i < this.collaboratorsByExpertise.length; i++) {

                if (this.CollabSkillChosenAndInduit.collaborator.id == this.collaboratorsByExpertise[i].collaborator.id) {
                  this.CollabSkillChosenAndInduit.expertisesChosen.push(this.collaboratorsByExpertise[i]);
                }
                else {
                  this.listCollaboratorsExpertises.push(this.CollabSkillChosenAndInduit);
                  this.CollabSkillChosenAndInduit = {
                    collaborator: {},
                    expertisesChosen: [],
                    expertisesInduit: []
                  };
                  this.CollabSkillChosenAndInduit.collaborator = this.collaboratorsByExpertise[i].collaborator;
                  this.CollabSkillChosenAndInduit.expertisesChosen.push(this.collaboratorsByExpertise[i]);
                }
                if (i == this.collaboratorsByExpertise.length - 1) {
                  this.listCollaboratorsExpertises.push(this.CollabSkillChosenAndInduit);
                }
              }
            }

          },
          response => {
            console.log(response);
          }).then(response => {

          axios.post(config.server + '/api/expertisebycollaborator', this.collaboratorsByExpertise).then(response => {
              this.inductExpertiseByCollaborators = response.data;
              for (var i = 0; i < this.inductExpertiseByCollaborators.length; i++) {
                for (var j = 0; j < this.listCollaboratorsExpertises.length; j++) {
                  if (this.listCollaboratorsExpertises[j].collaborator.id == this.inductExpertiseByCollaborators[i].collaborator.id) {
                    this.listCollaboratorsExpertises[j].expertisesInduit.push(this.inductExpertiseByCollaborators[i]);
                    break;
                  }
                }
              }
              for (var m = 0; m < this.listCollaboratorsExpertises.length; m++) {
                this.listCollaboratorsExpertises[m].expertisesInduit.sort(function (a, b) {
                  return (a.level < b.level) ? 1 : ((b.level < a.level) ? -1 : 0);
                });
                if (this.listCollaboratorsExpertises[m].expertisesInduit.length > 3) {
                  this.listCollaboratorsExpertises[m].expertisesInduit.splice(3, this.listCollaboratorsExpertises[m].expertisesInduit.length - 3);
                }
              }
        for (var i = 0; i < this.listCollaboratorsExpertises.length; i++) {
                this.listCollaboratorsExpertises[i].expertisesChosen.sort(function (a, b) {
                  return (a.skill.label > b.skill.label) ? 1 : ((b.skill.label > a.skill.label) ? -1 : 0);
                });
                console.log("hello: "  +this.listCollaboratorsExpertises[i].expertisesChosen[0])
                var tmp = [this.listCollaboratorsExpertises[i].expertisesChosen[0]];
                for (var j = 0; j < this.listCollaboratorsExpertises[i].expertisesChosen.length; j++) {
                  if (this.listCollaboratorsExpertises[i].expertisesChosen[j].skill.label != tmp[tmp.length - 1].skill.label) {
                    tmp.push(this.listCollaboratorsExpertises[i].expertisesChosen[j]);
                  }
                }
                this.listCollaboratorsExpertises[i].expertisesChosen = tmp;

                this.listCollaboratorsExpertises[i].expertisesInduit.sort(function (a, b) {
                  return (a.skill.label > b.skill.label) ? 1 : ((b.skill.label > a.skill.label) ? -1 : 0);
                });
                tmp = [];
                if (this.listCollaboratorsExpertises[i].expertisesInduit.length >= 1) {
                  tmp = [this.listCollaboratorsExpertises[i].expertisesInduit[0]];
                }
                for (var j = 0; j < this.listCollaboratorsExpertises[i].expertisesInduit.length; j++) {
                  if (this.listCollaboratorsExpertises[i].expertisesInduit[j].skill.label != tmp[tmp.length - 1].skill.label) {
                    tmp.push(this.listCollaboratorsExpertises[i].expertisesInduit[j]);
                  }
                }
                if (tmp.length >= 1) {
                  this.listCollaboratorsExpertises[i].expertisesInduit = tmp;
                } else {
                  this.listCollaboratorsExpertises[i].expertisesInduit = [];
                }


                this.listCollaboratorsExpertises[i].expertisesChosen.reverse();
                this.listCollaboratorsExpertises[i].expertisesInduit.reverse();

              }

            },
            response => {
              console.log(response);
            })
        })
      },

      CollabExist(name){
        for (var i in this.collabs) {
          if (name.indexOf(this.collabs[i].firstName) != -1) {
            console.log("true");
            return true;
          }
        }
        return false;
    },
  }
  ,

  components: {
    customCircle: CustomCircle, ShowCollab
  :
    ShowCollab
  }
  ,
  }


</script>

<style>
  .svg-container {
    display: inline-block;
    position: relative;
    width: 100%;
    height: 100%;
    vertical-align: middle;
    overflow: hidden;
  }

  body {
    color: #075338;
    margin: 0;
  }

  hr {
    height: 10px;
    border: 0;
    box-shadow: 0 10px 2px -10px #8c8c8c inset;
    margin-right: 50px;
    margin-left: 50px;
  }

  h4.mystyle {
    text-align: center;
    font-size: 1.75rem;
  }

  hr.myhrline {
    border-top: 1px solid #b7b7b7;
    margin-left: 50px;
    margin-right: 50px;
  }

  .typeaheadSkills {
    height: 90px;
    box-sizing: border-box;
  }

  .typeaheadSkills .dropdown-menu {
    position: static;
    z-index: 1000;
    width: 100%;
    padding: 12px 20px;
    background-color: #fff;
    margin: 8px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    max-height: 150px;
    overflow-y: auto;
  }

  .typeaheadSkills .dropdown-menu > .active > a {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.42857143;
    color: #333;
    background-color: #efefef;
    text-decoration: #3032ff;
  }

  .typeaheadSkills .dropdown-menu > li > a {
    display: block;
  }

  .inputForm {
    bottom: 20px;
    z-index: 5;
  }

  .inputForm .form-control:focus {
    outline: none !important;
    border: 1px solid #ff9ebe;
    box-shadow: 0 0 10px #76071b;
  }

  .squareForglyphiconSearch {
    position: relative;
    display: block;
    top: 21px;
    width: 41.5px;
    height: 41px;
    left: 94.5%;
    z-index: 6;

    cursor: pointer;
    background-color: gainsboro;
  }

  .glyphicon-search {
    position: absolute;
    cursor: pointer;
    top: 11px;
    z-index: 6;
    left: 20%;
    font-size: 26px;
    color: white;

  }

  p#noResult {
    text-align: center;
    color: #e03559;
    font-size: 1.2em;
  }


</style>
