<template>
  <div>
    <div class="svg-container" id="test">
      <b class="mybstyle">Administration des compétences</b>
      <hr class="myhrline">
      <svg version="1.1" viewBox="0 0 1250 1250"  class="svg-content">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5"/>
          </filter>
        </defs>
        <g v-for="link in links">
          <line  @mouseover="selectedlink = link;showCross = true;" :x1="getPositionXById(link.skill1.id)"
                :y1="getPositionYById(link.skill1.id)"
                :x2="getPositionXById(link.skill2.id)"
                :y2="getPositionYById(link.skill2.id)" style="stroke:rgba(0,0,0,0.52);stroke-width:3"/>
        </g>
        <g v-for="(skill,i) in skills">
          <customCircle :id="skill.id" :cx="positionX(i)" :cy="positionY(i)" :content="skill.label" stroke="#E03559" fill="white"
                        @click="selectSkill(skill)"/>
        </g>
        <customCircle @click="newSkillClicked = true;label=''":cx="positionX(skills.length)" :cy="positionY(skills.length)" :content="label" stroke="#09aa76" fill="white"/>
        <foreignObject v-show="newSkillClicked" :x="positionX(skills.length) - 46" :y="positionY(skills.length)-7">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <form @submit.prevent="addCircle">
            <input @blur="newSkillClicked = false" style="width: 88px;text-align:center; border-color: rgba(0,0,0,0.52);" maxlength="10" type="text" v-model="label"/>
            </form>
          </div>
        </foreignObject>
        <circle style="cursor: pointer" r="10" :cx="positionX(skills.length) - 30" :cy="positionY(skills.length) + 65" fill="orange"></circle>
        <text @click="newSkillClicked = false; label = 'Nouvelle'" text-anchor="middle" :x="positionX(skills.length) - 30"  :y="positionY(skills.length) + 70" style="fill: white;cursor: pointer">X</text>
        <circle style="cursor: pointer" r="10" :cx="positionX(skills.length) + 30" :cy="positionY(skills.length) + 65" fill="#09aa76"></circle>
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
        posY: 100,
        numberOfCircle: 0,
        row: 0,
        links:[]
      }
    },
    mounted(){
      this.getAllSkills();
      this.getAllLinks();
    },
    methods: {
      removeLink(link){
          let self = this;
        axios.post(config.server + '/api/removelink', link)
          .then(function (response){

            console.log(response);
            self.getAllLinks();
          }, response => {
            console.log(response);
          })
      },
      linkPositionX(){
        let self = this;
        if (self.selectedlink != '') {
          var x1 = parseFloat(self.getPositionXById(self.selectedlink.skill1.id))-3;
          var x2 = parseInt(self.getPositionXById(self.selectedlink.skill2.id))-3;
          var total = (x1 + x2) / 2;
          return total
        }
        else
          return 0
      },
      linkPositionY(){
        let self = this;
        if (this.selectedlink != '') {
          var y1 = parseInt(self.getPositionYById(self.selectedlink.skill1.id)) - 3;
          var y2 = parseInt(self.getPositionYById(self.selectedlink.skill2.id)) - 3;
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
        let self = this;
        return self.waitForElementToDisplay(id,0,"cx");
      },

      getPositionYById(id){
        let self = this;
        return self.waitForElementToDisplay(id,0,"cy");
      },
      selectSkill(skill){
        let self = this;
        if (self.selectedSkill.skill1 == '')
          self.selectedSkill.skill1 = skill;
        else {
          self.selectedSkill.skill2 = skill;
          axios.post(config.server + '/api/addlink', self.selectedSkill)
           .then( function () {
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
        let self = this;
        console.log()
        return self.posX + ((integ) % 8) * 150;
      },
      positionY(integ){
        let self = this;
        return self.posY + Math.floor((integ) / 8) * 150;
      },
      addCircle() {
        let self = this;
        if(this.label != '' && self.label != 'Nouvelle') {
          self.addSkill();
          self.text.push(self.text1);
          self.newSkillClicked = false;
          self.numberOfCircle++;
          self.label = 'Nouvelle';
        }
      },
      addSkill(){
        let self = this;
        var skill = {"label": self.label};
        axios.post(config.server + '/api/addskill/', skill)
          .then(function (response)
          {
          self.getAllSkills();
        })
      },
      getAllSkills(){
        let self = this;
        axios.get(config.server + "/api/skills/").then(function (response){
          self.skills = response.body;
          self.skills.sort(function (a, b) {
            return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);
          });
        }, response => {
          console.log(response);
        });
      },
      getAllLinks(){
        let self = this;
        self.showCross=false;
        axios.get(config.server + "/api/links/").then(function (response){
          self.links = response.body;
          if(self.selectedlink=='')
            self.showCross =false;
          self.links.sort(function (a, b) {
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

  svg-container {
    display: inline-block;
    position: relative;
    width: 100%;
    padding-bottom: 100%;
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

  .test {
    animation: mymove 0.5s 1;
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

  @keyframes mymove {
    from {
      opacity: 0
    }
    to {
      opacity: 1
    }
  }
</style>
