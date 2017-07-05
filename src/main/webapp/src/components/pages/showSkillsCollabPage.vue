<template>
  <div>
    <FindSkills></FindSkills>
    <div class="svg-container" id="svg-container">
      <b class="mybstyle">Liste de vos compétences</b>
      <hr class="myhrline">
      <svg version="1.1" viewBox="0 0 1250 1250" preserveAspectRatio="xMinYMin meet">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4"/>
          </filter>
        </defs>
        <g v-for="link in links">
          <line :x1="getPositionXById(link.skill1.id)"
                :y1="getPositionYById(link.skill1.id)"
                :x2="getPositionXById(link.skill2.id)"
                :y2="getPositionYById(link.skill2.id)" style="stroke:rgba(0,0,0,0.52);stroke-width:3"/>
        </g>
        <g v-for="(expertise,i) in expertises">
          <customCircle @refresh="updateAll" :id="expertise.skill.id" :cx="positionX(i)" :cy="positionY(i)"
                        :content="expertise.skill.label"
                        stroke="#E03559" fill="white" :score="expertise.level" :expertise="expertise"
                        :showCircleBlur="showFocusOnSearch(expertise.skill.id)"/>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
  import CustomCircle from "../customComponent/customcircle.vue"
  import CloseCross from "../customComponent/CloseCross.vue"
  import FindSkills from "../pages/findSkill.vue"
  import config from '../../config/config'
  import axios from 'axios'
  import * as Vuex from "vuex";
  var $ = window.jQuery = require('jquery');

  export default {
    data () {
      return {
        skills: [],
        text: [],
        posX: 100,
        posY: 60,
        row: 0,
        expertises: [],
        links: [],
        collabLogged: {},
      }
    },

    computed: {
      foundedSkillsTypeahead: function () {
        console.log("test");
        return this.$store.state.foundedSkillsLabel;
      },
    },

    mounted(){
      this.getCollabLogged();
      this.getAllExpertise();
      this.getAllLinks();
    },
    components: {customCircle: CustomCircle, FindSkills: FindSkills},

    methods: {
      updateAll(){
        this.getAllExpertise();
        this.getAllLinks();
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
        this.showCross = false;
        axios.get(config.server + "/api/links/").then(response => {
          this.links = response.data;

          if (this.selectedlink == '')
            this.showCross = false;
          this.links.sort(function (a, b) {
            return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);
          });
        }, response => {
          console.log(response);
        });
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

      getPositionXById(id){
        return this.waitForElementToDisplay(id, 0, "cx");
      },

      getPositionYById(id){
        return this.waitForElementToDisplay(id, 0, "cy");
      },

      positionX(integ){
        return this.posX + ((integ) % 8) * 150;
      },

      positionY(integ){
        return this.posY + Math.floor((integ) / 8) * 150;
      },

      getAllExpertise(){
        axios.get(config.server + '/api/getcollabexpertises/'+this.collabLogged.id).then(
          response => {
          this.expertises = response.data;
        this.getAllLinks();
        this.expertises.sort(function (a, b) {
          return (a.skill.id > b.skill.id) ? 1 : ((b.skill.id > a.skill.id) ? -1 : 0);
        });
      }, response => {
          console.log(response);
        });
      },

      showIcon(skillId){
        if (this.selectedSkill.skill1.id == skillId) {
          return true;
        }
        else {
          return false;
        }
      },

      showFocusOnSearch(id){
        if (this.foundedSkillsTypeahead) {
            if(this.foundedSkillsTypeahead[0]){
              if (this.foundedSkillsTypeahead[0].id == id) {
                document.getElementById(id).getElementsByTagName("circle")[0].setAttribute("filter", "url(#blurMe)");
                return true;
              }
              return false;
            }
          return false;
        }
return false;
      }
    }
  }

</script>

<style>

  .svg-container {
    display: inline-block;
    position: relative;
    width: 100%;
    vertical-align: middle;
    overflow: hidden;
  }

  .defaultSize {
    font-size: 24px;
  }

  .smallSize {
    font-size: 17px;
  }

  body {
    color: #075338;
    margin: 0;
    font-family: 'Lato', sans-serif;
  }

  h1 {
    color: white;
    text-align: center;
    margin: 0;
  }

  .header {
    background-color: #09aa76;
    height: 80px;
    margin: 0px 0px 25px 0px;
  }

  hr.myhrline {
    border-top: 1px solid #8c8b8b;
    margin-left: 50px;
    margin-right: 50px;
  }

  b.mybstyle {
    margin-left: 50px;
    margin-right: 50px;
  }

  input[type=text].inputCircle:focus {
    outline: none !important;
    border: none;
  }

  .inputCircle {
    width: 88px;
    text-align: center;
    border: none;
  }
</style>
