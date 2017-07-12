<template>
  <div class="row-fluid" style="margin:0 20px;overflow-x: scroll;">
    <div v-for="i in 13" class="col-lg-2">
      <div class="row">
        <div class="col-lg-12">
          <img class=" img-responsive center-block" src="../../../static/lion.jpg"
               style="width:130px; border-radius:50%;">
        </div>
      </div>

      <div class="row">
        <p class="col-lg-12" style="margin-top:0.5em; margin-bottom:1em; text-align: center">Caroline L'hote</p>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <div v-for="i in 3">
            <div class="levelCircle" :class="colorCircle">A</div>
            <span>Javascript</span>
            <span v-for="i in level" style="margin-left: 2px; padding: 0px; color:#eedd31;">
        <i class="glyphicon glyphicon-star"></i>
      </span>
            <span v-for="i in 5-level" style="margin-right: 2px; padding: 0px;color:#eedd31;">
        <i class="glyphicon glyphicon-star-empty"></i>
      </span>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <p style="margin-top:0.5em;margin-bottom:0; text-align: center">Compétences induites</p>
          <hr>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <div v-for="i in 3">
            <div class="levelCircle" :class="colorCircle">D</div>
            <span>Javascript</span>
            <span v-for="i in level" style="margin-left: 2px; padding: 0px; color:#eedd31;">
        <i class="glyphicon glyphicon-star"></i>
      </span>
            <span v-for="i in 5-level" style="margin-right: 2px; padding: 0px;color:#eedd31;">
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
    data (){
      return {
        colorCircle: "level3Circle",
        level: 2
      };
    },

    mounted(){
    },

    computed: {},

    watch: {},

    methods: {}
  }


</script>
<style>
  .row-fluid {
    white-space: nowrap;
  }

  .row-fluid .col-lg-2 {
    display: inline-block;
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
</style>
