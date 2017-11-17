<template>
  <div>
    <FindSkills></FindSkills>
    <div class="svg-container collab" id="svg-container">

        <div >
          <legend class="mystyle">
            <h4 style=" margin-top: 2px;">Liste de vos compétences</h4>
          </legend>
        </div>
      <!--<hr class="myhrline">-->
      <svg version="1.1" :viewBox="myViewBox" preserveAspectRatio="xMinYMin meet">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4"/>
          </filter>
        </defs>
        <!--
        <foreignObject :x="cx-45" :y="cy+5" class="myclass" width="100%" height="100%">
          <div v-show="!star">
            <p>
            <span v-tooltip.bottom="currentLevel">
              <star-rating @rating-selected="setRating" @current-rating="showCurrentRating" v-model="rating"
                           :show-rating="false"
                           :star-size="18">
              </star-rating>
              <p class="level"></p>
              </span>
            </p>
          </div>
        </foreignObject> -->
        <g v-for="link in links">
          <line :x1="getPositionXById(link.skill1.id)"
                :y1="getPositionYById(link.skill1.id)"
                :x2="getPositionXById(link.skill2.id)"
                :y2="getPositionYById(link.skill2.id)"
                style="stroke:rgba(0,0,0,0.52);stroke-width:3"/>
        </g>
        <g v-for="(expertise,i) in expertises">
          <customCircle @refresh="updateAll" :id="expertise.skill.id" :cx="positionX(i)" :cy="positionY(i)"
                        :content="expertise.skill.label"
                        stroke="#E03559" fill="white" :score="expertise.level" :expertise="expertise"
                        :showCircleBlur="showFocusOnSearch(expertise.skill.id)"/>
        </g>
      </svg>
      <p id="textLevelCollab">
        <span class="glyphicon glyphicon-info-sign" style="margin-right:5px;"></span>
        Renseignez votre niveau pour chaque compétence
      </p>
    </div>
  </div>
</template>

<script>
  import CustomCircle from "../customComponent/customcircle.vue"
  import CloseCross from "../customComponent/CloseCross.vue"
  import FindSkills from "../pages/findSkill.vue"
  import ShowCollab from '../pages/showCollab.vue'
  import config from '../../config/config'
  import axios from 'axios'
  import StarRating from 'vue-star-rating'
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
        myViewBox: "0 0 1250 1250",
        expertises: [],
        links: [],
        collabLogged: {},
      }
    },

    computed: {
      foundedSkillsTypeahead: function () {
        return this.$store.state.foundedSkillsLabel;
      },
    },

    mounted(){
      this.getCollabLogged();
      this.getAllExpertise();
      this.getAllLinks();
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token;
    },
    components: {customCircle: CustomCircle, FindSkills: FindSkills, StarRating},

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
        axios.get(config.server + '/api/getcollabexpertises/' + this.collabLogged.id).then(
          response => {
            this.expertises = response.data;
            this.getAllLinks();
            this.expertises.sort(function (a, b) {
              return (a.skill.id > b.skill.id) ? 1 : ((b.skill.id > a.skill.id) ? -1 : 0);
            });
            this.myViewBox = "0 0 1250 "+ parseInt((Math.floor(this.expertises.length/8)*150) + 150);
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
        let self = this;

        if (this.foundedSkillsTypeahead) {
          if (this.foundedSkillsTypeahead[0]) {
            if (this.foundedSkillsTypeahead[0].id == id) {
              document.getElementById(id).getElementsByTagName("circle")[0].setAttribute("filter", "url(#blurMe)");
              setTimeout(function () {
                document.getElementById(id).getElementsByTagName("circle")[0].removeAttribute("filter");
                self.$store.commit('setFoundedSkillsLabel', '');
              }, 6000);
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

  .svg-container.collab {
    z-index:0;
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
    border-top: 1px solid #b7b7b7;
    margin-left: 50px;
    margin-right: 50px;
    margin-top:5px;
  }

  .mystyle {
    text-align: center;
    font-size: 1.75rem;
    background-color: #e03559;
    height: 30px;
    margin-bottom: 20px;
    margin-top: 30px;
    margin-left: 20px;
    width: 97.4%;
    border-radius: 6px 6px 0px 0px;
    padding-top: 5px;color: white;
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

  #textLevelCollab {
    text-align:center;
  }
</style>
