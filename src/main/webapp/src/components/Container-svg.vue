<template>
  <div>
    <div class="svg-container" id="svg-container">
      <b class="mybstyle">Administration des compétences</b>
      <hr class="myhrline">
      <svg version="1.1" viewBox="0 0 1250 1250" preserveAspectRatio="xMinYMin meet">
        <g v-for="link in links">
          <line  @mouseover="selectedlink = link;showCross = true;" :x1="getPositionXById(link.skill1.id)"
                :y1="getPositionYById(link.skill1.id)"
                :x2="getPositionXById(link.skill2.id)"
                :y2="getPositionYById(link.skill2.id)" style="stroke:rgba(0,0,0,0.52);stroke-width:3"/>
        </g>
        <g v-for="(skill,i) in skills">
          <customCircle :id="skill.id" :cx="positionX(i)" :cy="positionY(i)" :content="skill.label" stroke="red" fill="white"
                        @click="selectSkill(skill)"/>
        </g>
        <customCircle @click="displayInput" :cx="positionX(skills.length)" :cy="positionY(skills.length)" :content="label" stroke="#09aa76" fill="white"/>
        <foreignObject v-show="newSkillClicked" :x="positionX(skills.length) - 44" :y="positionY(skills.length)-10">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <form @submit.prevent="addCircle">
            <input ref="inputCircle" id="inputCircle" @blur="hideInput"  style="width: 88px;text-align:center; border-color: rgba(0,0,0,0.52);" maxlength="10" type="text" v-model="label"/>
            </form>
          </div>
        </foreignObject>
        <circle style="cursor: pointer" r="10" :cx="positionX(skills.length) - 30" :cy="positionY(skills.length) + 65" fill="orange"></circle>
        <text @click="newSkillClicked = false; label = 'Nouvelle'" text-anchor="middle" :x="positionX(skills.length) - 30"  :y="positionY(skills.length) + 70" style="fill: white;cursor: pointer">X</text>
        <circle style="cursor: pointer" r="10" :cx="positionX(skills.length) + 30" :cy="positionY(skills.length) + 65" fill="green"></circle>
        <text @click="addCircle" text-anchor="middle" :x="positionX(skills.length) + 30"  :y="positionY(skills.length) + 70" style="fill: white;cursor: pointer">✔</text>
        <CloseCross v-show="showCross" style="cursor: pointer;"@click="removeLink(selectedlink)":x1="linkPositionX()" :y1="linkPositionY()"></CloseCross>
      </svg>
    </div>
  </div>
</template>

<script>
  import CustomCircle from "./customcircle.vue"
  import CloseCross from "./CloseCross.vue"
  import config from '../config/config'
  import axios from 'axios'

  export default {

//    name: 'container-svg',
    data () {
      return {
        selectedSkill: {
            skill1:'',
            skill2:''
        },
        skills: [],
        selectedlink: '',
        label: 'Nouvelle',
        newSkillClicked:false,
        showCross : false,
        text: [],
        posX: 100,
        posY: 55,
        row: 0,
        links:[]
      }
    },
    mounted(){
      this.getAllSkills();
      this.getAllLinks();
    },
    methods: {
        displayInput() {
          this.newSkillClicked = true;
          this.label='';
          setTimeout(function(){
            $('#inputCircle').focus();
          });
        },
        hideInput(){
          this.newSkillClicked = false;
          document.getElementById("inputCircle").removeAttribute("autofocus");

        },
      removeLink(link){
        axios.post(config.server + '/api/removelink', link).then(
          response => {
            console.log(response);
            this.getAllLinks();
          }, response => {
            console.log(response);
          })
      },
      linkPositionX(){
        if (this.selectedlink != '') {
          var x1 = parseFloat(this.getPositionXById(this.selectedlink.skill1.id))-3;
          var x2 = parseInt(this.getPositionXById(this.selectedlink.skill2.id))-3;
          var total = (x1 + x2) / 2;
          return total
        }
        else
          return 0
      },
      linkPositionY(){
        if (this.selectedlink != '') {
          var y1 = parseInt(this.getPositionYById(this.selectedlink.skill1.id)) - 3;
          var y2 = parseInt(this.getPositionYById(this.selectedlink.skill2.id)) - 3;
          var somme = y1+y2;
          return somme/2
        }
        else
          return 0;
      },

      waitForElementToDisplay(selector, time, position){
        let self = this;
        if(document.getElementById(selector)!=null) {
          return document.getElementById(selector).getElementsByTagName("circle")[0].getAttribute(position);
        }
        else {
          setTimeout(function() {
            self.waitForElementToDisplay(selector, time);
          }, time);
        }
      },

      getPositionXById(id){
        return this.waitForElementToDisplay(id,0,"cx");
      },

      getPositionYById(id){
       return this.waitForElementToDisplay(id,0,"cy");
      },
      selectSkill(skill){
        let self = this;
        if (self.selectedSkill.skill1 == '')
          self.selectedSkill.skill1 = skill;
        else {
          self.selectedSkill.skill2 = skill;
          axios.post(config.server + '/api/addlink', self.selectedSkill).then(
          response => {
                console.log(response);
          }, response => {
            console.log(response);
          }).then(
            function () {
              self.selectedSkill = {
                skill1:'',
                skill2:''
              };
              self.getAllSkills();
              self.getAllLinks();
            }
          );
        }
      },
      positionX(integ){
          console.log()
        return this.posX + ((integ) % 8) * 150;
      },
      positionY(integ){
        return this.posY + Math.floor((integ) / 8) * 150;
      },
      addCircle() {
        if(this.label != '' && this.label != 'Nouvelle') {
          this.addSkill();
          this.text.push(this.text1);
          this.newSkillClicked = false;
          this.label = 'Nouvelle';
        }
      },
      addSkill(){
        var skill = {"label": this.label};
        axios.post(config.server + '/api/addskill/', skill).then(response => {
          this.getAllSkills();
        }, response => {
          console.log(response);
        });
      },
      getAllSkills(){
        axios.get(config.server + "/api/skills/").then(response => {
          this.skills = response.data;
          this.skills.sort(function (a, b) {
            return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);
          });
          console.log(this.positionY(this.skills.length));
          document.getElementById("svg-container").style.height = (this.positionY(this.skills.length) + 300 + (Math.floor(this.skills.length/8)*10)).toString()+"px";

        }, response => {
          console.log(response);
        });
      },
      getAllLinks(){
        this.showCross=false;
        axios.get(config.server + "/api/links/").then(response => {
          this.links = response.data;
          if(this.selectedlink=='')
              this.showCross =false;
          this.links.sort(function (a, b) {
            return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);
          });
        }, response => {
          console.log(response);
        });
      }
    },
    components: {customCircle: CustomCircle, CloseCross: CloseCross}

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



  hr.myhrline{
    border-top: 1px solid #8c8b8b;
    margin-left: 50px;
    margin-right: 50px;
  }

  b.mybstyle {
    margin-left: 50px;
    margin-right: 50px;
  }

  input[type=text]:focus {
    outline: none !important;
    box-shadow: 0 0 5px #09aa76;
    border: 1px solid #09aa76;
  }

  @keyframes mymove {
    from {
      opacity: 0
    }
    to {
      opacity: 1
    }
  }
</style>
