<template>
  <div class="container" style="margin:0 20px">
    <div class="row">
      <div class="col-lg-2">
        <img class=" img-responsive center-block" src="../../../static/lion.jpg"
             style="width:130px; border-radius:50%;">
      </div>
    </div>
    <div class="row">
      <p class="col-lg-2" style="margin-top:0.5em; margin-bottom:1em; text-align: center">Caroline L'hote</p>
    </div>
    
  </div>
</template>

<script>
  import axios from 'axios';
  import config from '../../config/config';

  export default {
    data (){
      return {
          colorCircle: "greenCircle"
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
  .levelCircle {
    border-radius: 50%;

    width: 36px;
    height: 36px;
    padding: 8px;

    background: #46ffcd;
    border: 2px solid #666;
    color: #666;
    text-align: center;

    font: 32px Arial, sans-serif;
  }

  .level1Circle {
    background: #0c8700;
  }
  .level2Circle {
    background: #00d466;
  }
  .level3Circle {
    background: #d66d25;
  }
  .level4Circle {
    background: #0c8700;
  }
  .level5Circle {
    background: #0c8700;
  }
</style>
