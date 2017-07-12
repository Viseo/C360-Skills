<template>
  <div>
    <div class=" col-lg-4 col-lg-offset-4 col-lg-4 searchField typeaheadSkills">
      <span class="glyphicon glyphicon-search" ref="searchSkill " @click="selectedSkills(value)"></span>
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
                      stroke="#E03559" fill="white" @click="selectedSkills(expertise.skill.label)"
                      :showCircleBlur="isFound(expertise.skill.label)" :score="expertise.level" :expertise="expertise" @clicked="onClickChild"/>
      </g>
    </svg>
    <ShowCollab></ShowCollab>
  </div>
</template>

<script>
  import CustomCircle from "../customComponent/customcircle.vue";
  import axios from "axios";
  import config from '../../config/config';
  import ShowCollab from "../pages/showCollab.vue";


  var $ = window.jQuery = require('jquery');

  export default {
    data(){
      return {
        typeaheadTemplate: `<div v-if="this.$parent.$parent.CollabExist(item)"><img width="18px" height="18px" src="data:image/jpeg;base64,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">
        <span>{{item}}</span></div>
        <span v-else>{{item}}</span>`,
        value: '',
        levelSelected:0,
        searchResult: [],
        links: [],
        selectedSkill: {
          skill1: '',
          skill2: ''
        },
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
        CollabSkillChosenAndInduit:{
          collaborator:{},
          expertisesChosen:[],
          expertisesInduit:[]
        },
        inductedExpertiseCollab: [],
        listCollaboratorsExpertises:[], ////variable pour recherche par compétence
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
      onClickChild (value) {
        this.levelSelected=value;
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
            var length = this.collabExpertises.length;
            for (var index = 0; index < length; index++) {
              if (this.collabExpertises[index].noted == false) {
                console.log("in");
                this.collabExpertises.splice(index, 1);
                length = this.collabExpertises.length;
                index--;
              }
            }
            this.collabExpertises.sort(function (a, b) {
              return (a.level > b.level) ? 1 : ((b.level > a.level) ? -1 : 0);
            });
            this.collabExpertises.splice(3, this.collabExpertises.length);

            this.CollaboratorExpertises = {
              collaborator: {},
              expertisesChosen: [],
              expertisesInduit: []
            };
            this.CollaboratorExpertises.collaborator = this.collabExpertises[0].collaborator;
            for(var i = 0; i < this.collabExpertises.length; i++){
                this.CollaboratorExpertises.expertisesChosen.push(this.collabExpertises[i]);
            }
          }, response => {
            console.log(response);
          }).then(response => {
            axios.post(config.server + '/api/expertisebycollaborator', this.collabExpertises).then(response => {
                this.inductedExpertiseCollab = response.data;

                if(this.inductedExpertiseCollab.length > 3){
                  this.inductedExpertiseCollab.splice(3,this.inductedExpertiseCollab.length-3);
                }
                for(var i = 0; i < this.inductedExpertiseCollab.length; i++){
                  this.CollaboratorExpertises.expertisesInduit.push(this.inductedExpertiseCollab[i]);
                }
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

      selectedSkills(name){
        this.foundCollab = '';
        for (var i in this.foundSkills) {
          if (this.foundSkills[i].skill.label == name) {
            document.getElementById(this.foundSkills[i].skill.id).getElementsByTagName("circle")[0].removeAttribute("filter");
            this.foundSkills.splice(i, 1);
            return;
          }
        }
        for (var index in this.expertises) {
          if (this.expertises[index].skill.label == name) {
              this.expertises[index].level = this.levelSelected;
            this.foundSkills.push(this.expertises[index]);
            document.getElementById(this.expertises[index].skill.id).getElementsByTagName("circle")[0].setAttribute("filter", "url(#blurMe)");
          }

        }
        this.collaboratorsByExpertise.splice(0, this.collaboratorsByExpertise.length);
        for(var i in this.collabs){
            if(this.value != null){
              if(this.value.indexOf(this.collabs[i].lastName) != -1){
                this.foundCollab =this.collabs[i];}}
        }
        if(this.foundCollab != ""){
          this.getFoundCollabExpertises();
        }
        else
        this.getCollaboratorsByExpertises(this.foundSkills);

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

      showCircleBlurOrNot(id){
        if (this.selectedSkill.skill1.id == id) {
          return true
        }
        return false;
      },

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

      showCircleBlurOrNot(id){
        if (this.selectedSkill.skill1.id == id) {
          return true
        }
        return false;
      },

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
              collaborator:{},
              expertisesChosen:[],
              expertisesInduit:[]
            };
            this.CollabSkillChosenAndInduit.collaborator = this.collaboratorsByExpertise[0].collaborator;
            this.CollabSkillChosenAndInduit.expertisesChosen.push(this.collaboratorsByExpertise[0]);
            if(this.collaboratorsByExpertise.length == 1){
              this.listCollaboratorsExpertises.push(this.CollabSkillChosenAndInduit);
            }
            else{
              for(var i = 1; i<this.collaboratorsByExpertise.length;i++){
                if(this.CollabSkillChosenAndInduit.collaborator.id == this.collaboratorsByExpertise[i].collaborator.id){
                    console.log("hello1");
                  this.CollabSkillChosenAndInduit.expertisesChosen.push(this.collaboratorsByExpertise[i]);
                  if(i == this.collaboratorsByExpertise.length -1){
                    console.log("hello2");
                    this.listCollaboratorsExpertises.push(this.CollabSkillChosenAndInduit);
                  }
                }
                else{
                  this.listCollaboratorsExpertises.push(this.CollabSkillChosenAndInduit);
                  this.CollabSkillChosenAndInduit = {
                    collaborator:{},
                    expertisesChosen:[],
                    expertisesInduit:[]
                  };
                  this.CollabSkillChosenAndInduit.collaborator = this.collaboratorsByExpertise[i].collaborator;
                  this.CollabSkillChosenAndInduit.expertisesChosen.push(this.collaboratorsByExpertise[i]);
                }
              }
            }

          },
          response => {
            console.log(response);
          }).then(response => {

          axios.post(config.server + '/api/expertisebycollaborator', this.collaboratorsByExpertise).then(response => {
              this.inductExpertiseByCollaborators = response.data;
              for(var i = 0;i < this.inductExpertiseByCollaborators.length;i++){
                  for(var j = 0;j < this.listCollaboratorsExpertises.length;j++){
                      if(this.listCollaboratorsExpertises[j].collaborator.id == this.inductExpertiseByCollaborators[i].collaborator.id){
                          this.listCollaboratorsExpertises[j].expertisesInduit.push(this.inductExpertiseByCollaborators[i]);
                          break;
                      }
                  }
              }
              for(var m = 0;m < this.listCollaboratorsExpertises.length;m++){
                  this.listCollaboratorsExpertises[m].expertisesInduit.sort(function (a, b) {
                    return (a.level > b.level) ? 1 : ((b.level > a.level) ? -1 : 0);
                  });
                  if(this.listCollaboratorsExpertises[m].expertisesInduit.length > 3){
                      this.listCollaboratorsExpertises[m].expertisesInduit.splice(3,this.listCollaboratorsExpertises[m].expertisesInduit.length-3);
                  }
              }
            },
            response => {
              console.log(response);
            })
        })
      },

      CollabExist(name){
        for (var i in this.collabs) {
          if (name.indexOf(this.collabs[i].lastName) != -1) {
            return true;
          }
          else
            return false;
        }

      },


    },

    components: {customCircle: CustomCircle, ShowCollab: ShowCollab},
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
    width: 800px;
    margin-left: 400px;
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
    background-color: #fff;
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

  .glyphicon-search {
    top: 12px;
    z-index: 6;
    left: 95%;
    font-size: 20px;
    color: tan;
  }


</style>
