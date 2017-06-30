<template>
  <div>
    <div class="svg-container" id="svg-container">
      <b class="mybstyle">Liste de vos compétences</b>
      <hr class="myhrline">
      <svg version="1.1" viewBox="0 0 1250 1250" preserveAspectRatio="xMinYMin meet">
        <g v-for="link in links">
          <line  :x1="getPositionXById(link.skill1.id)"
                 :y1="getPositionYById(link.skill1.id)"
                 :x2="getPositionXById(link.skill2.id)"
                 :y2="getPositionYById(link.skill2.id)" style="stroke:rgba(0,0,0,0.52);stroke-width:3"/>
        </g>
        <g v-for="(skill,i) in skills">
          <customCircle :id="skill.id" :cx="positionX(i)" :cy="positionY(i)" :content="skill.label" stroke="#E03559" fill="white"/>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
  import CustomCircle from "../customComponent/customcircle.vue"
  import CloseCross from "../customComponent/CloseCross.vue"
  import config from '../../config/config'
  import axios from 'axios'
  var $ = window.jQuery = require('jquery');

  export default {
    data () {
      return {
        skills: [],
        selectedlink: '',
        skillOldValue: '',
        clickOnSkill: false,
        label: 'Nouvelle',
        newSkillClicked: true,
        showCross: false,
        text: [],
        posX: 100,
        posY: 55,
        row: 0,
        links: []
      }
    },

    mounted(){
      this.getAllSkills();
      this.getAllLinks();
    },

    methods: {

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
        console.log()
        return this.posX + ((integ) % 8) * 150;
      },

      positionY(integ){
        return this.posY + Math.floor((integ) / 8) * 150;
      },


      getAllSkills(){
        axios.get(config.server + "/api/skills/").then(response => {
          this.skills = response.data;
          this.skills.sort(function (a, b) {
            return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);
          });
          console.log(this.positionY(this.skills.length));
          document.getElementById("svg-container").style.height = (this.positionY(this.skills.length) + 300 + (Math.floor(this.skills.length / 8) * 10)).toString() + "px";

        }, response => {
          console.log(response);
        });
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

      showIcon(skillId){
        if (this.selectedSkill.skill1.id == skillId) {
          return true;
        }
        else {
          return false;
        }
      }
    },
    components: {customCircle: CustomCircle}
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
