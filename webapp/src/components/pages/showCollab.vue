<template>
  <div class="row-fluid" style="margin:0 20px;overflow-x: auto;">
    <div v-for="expertise in  expertises" class="col-lg-2">
      <div class="row">
        <div class="col-lg-12">
          <img class=" img-responsive center-block" src="../../../static/lion.jpg"
               style="width:130px; border-radius:50%;">
        </div>
      </div>

      <div class="row">
        <p class="col-lg-12" style="margin-top:0.5em; margin-bottom:1em; text-align: center">
          {{expertise.collaborator.firstName}} {{expertise.collaborator.lastName}}</p>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <div v-for="skill in expertise.expertisesChosen">
              <div class="levelCircle" :class="'level'+skill.level+'Circle'">{{ showLevel (skill.level) }}</div>
              <span>{{skill.skill.label }}</span>

              <span v-for="levelStar in skill.level" style="margin-left: 2px; padding: 0px; color:#eedd31;">
                <i class="glyphicon glyphicon-star"></i>
              </span>
              <span v-for="levelStarEmpty in 5-skill.level" style="margin-right: 2px; padding: 0px;color:#eedd31;">
                <i class="glyphicon glyphicon-star-empty"></i>
              </span>
          </div>
        </div>
      </div>

      <div class="row" v-show="skillInducedExists">
        <div class="col-lg-12">
          <p style="margin-top:0.5em;margin-bottom:0; text-align: center">Compétences induites</p>
          <hr>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <div v-for="skillInduit in expertise.expertisesInduit">
            <div class="levelCircle" :class="'level'+skillInduit.level+'Circle'">{{ showLevel (skillInduit.level) }}
            </div>
            <span> {{skillInduit.skill.label}}</span>
            <span v-for="levelStar in skillInduit.level" style="margin-left: 2px; padding: 0px; color:#eedd31;">
        <i class="glyphicon glyphicon-star"></i>
      </span>
            <span v-for="levelStarEmpty in 5-skillInduit.level" style="margin-right: 2px; padding: 0px;color:#eedd31;">
        <i class="glyphicon glyphicon-star-empty"></i>
      </span>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
  import axios from 'axios';
  import config from '../../config/config';

  export default {
    props: ['expertises'],
    data (){
      return {
        listCollaboratorsExpertises: [],
        colorCircle: "level3Circle",
        level: 2
      };
    },

    mounted(){
    },

    computed: {
        skillInducedExists() {
            return this.expertises[0].expertisesInduit.length != 0;
        }
    },

    watch: {},

    methods: {
      showLevel (rating) {
        if (rating == 5) {
          return "E";
        }
        if (rating == 4) {
          return "A";
        }
        if (rating == 3) {
          return "C";
        }
        if (rating == 2) {
          return "D";
        }
        if (rating == 1) {
          return "E";
        }
      }
    }
  }


</script>
<style>
  .row-fluid {
    white-space: nowrap;
  }

  .row-fluid .col-lg-2 {
    display: inline-block;
    vertical-align: top;
    float: none;
  }

  .levelCircle {
    border-radius: 50%;

    width: 30px;
    height: 30px;
    padding: 7px;
    margin: 3px;

    display: inline-block;
    color: #ffffff;
    text-align: center;

    font: 15px Arial, sans-serif;
  }

  .level5Circle {
    background: #0c8700;
  }

  .level4Circle {
    background: #00d466;
  }

  .level3Circle {
    background: #d66d25;
  }

  .level2Circle {
    background: #e17155;
  }

  .level1Circle {
    background: #97253d;
  }

  hr {
    margin: 0px;
  }

  .stars {
    position:relative;
    top:7px;
  }
</style>
