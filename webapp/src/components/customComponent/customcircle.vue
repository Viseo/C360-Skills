<template>
  <g>
    <circle v-show="showCircleBlur" @click="handleClick()" class="circleSkill" :id="cx+''+cy" :cx="cx" :cy="cy" r="50" :fill="fill" :stroke="stroke" stroke-width="10"></circle>
    <circle @click="handleClick()" class="circleSkill" :cx="cx" :cy="cy" r="53" :fill="fill" :stroke="stroke" stroke-width="2"></circle>
    <text @click="handleClick()" class="textSkill" text-anchor="middle" :x="cx" :y="cy" style="fill: rgba(0,0,0,0.52);">{{content}}</text>
    <foreignObject :x="cx-45" :y="cy+5" class="myclass" width="100%" height="100%">
      <div v-show="!star">
        <p><span v-tooltip.bottom="currentLevel">
        <star-rating @rating-selected="setRating" @current-rating="showCurrentRating" v-model="rating" :show-rating="false"
                     :star-size="18">
          </star-rating>
          <p id="testt">Hello</p>
        </span></p>
      </div>
    </foreignObject>
  </g>
</template>

<script>
  import store from "../../vuex/store"
  import axios from 'axios'
  import config from '../../config/config'
  import StarRating from 'vue-star-rating'
  var $ = window.jQuery = require('jquery');

  export default {

    components: {
      StarRating
    },

    props:["star","cx","cy", "content","fill","stroke","showCircleBlur","score","expertise"],

    data () {
      return {
        selectedExpertise:this.expertise,
        rating: this.score,
        ratingSaved: 0,
        currentRating: 0,
        currentLevel: null,
        cx1: "",
        cy1: "",
        cx2: "",
        cy2: "",
        cx3: "",
        cy3: "",
        cyLine1:"",
        cxLine1:"",
        cyLine2:"",
        cxLine2:"",
        cyLine3:"",
        cxLine3:"",
      }
    },

    mounted: function () {
      $("div.star-rating span.pointer:first-child polygon:nth-child(3)").hover(function(){
        $("#testt").css("background-color", "yellow");
      }, function(){
        $("#testt").css("background-color", "pink");
      });
      $('foreignObject').ready(function(){

        $('foreignObject').find('div').mousemove(function(e){
          window.mouseXPos = e.pageX;
          window.mouseYPos = e.pageY;
          $(".tooltip-inner").css("position", "absolute !important");
          $(".tooltip-inner").css("left", window.mouseXPos +5);
          $(".tooltip-inner").css("top",window.mouseYPos);
          $(".tooltip").css("transform","none");
        });
      });
    },

    watch:{
      score: function(newValue){
        this.rating = newValue;
      },

      expertise:function(newValue){
        this.selectedExpertise = newValue;
      }
    },

    methods: {
      setRating: function(raiting){
        if(this.ratingSaved == this.rating) {
            raiting = 0;
            this.rating=0;
        }
        this.ratingSaved = raiting;
          if(!this.$store.getters.collaboratorLoggedIn.isAdmin)
              this.updateExpertise(this.selectedExpertise,raiting);
          else
            this.$emit('clicked', raiting);
            this.$emit('getExpertise', this.selectedExpertise);
      },

      showCurrentRating: function(rating) {
        this.currentRating = rating;
//        if(rating==5){
//          this.currentLevel = "Expert";
//          $(".tooltip-inner").css("background","#0c8700");
//        }
//        if(rating==4){
//          this.currentLevel = "Avancé";
//          $(".tooltip-inner").css("background","#00d466");
//        }
//        if(rating==3){
//          this.currentLevel = "Confirmé";
//          $(".tooltip-inner").css("background","#d66d25");
//
//        }
//        if(rating==2){
//          this.currentLevel = "Débutant";
//          $(".tooltip-inner").css("background","#e17155");
//
//        }
//        if(rating==1){
//          this.currentLevel = "Élémentaire";
//          $(".tooltip-inner").css("background","#97253d");
//
//        }
      },

      updateExpertise(expertise,value){
        this.selectedExpertise.level = value;
        axios.put(config.server + '/api/expertise', expertise).then(

          response => {
            this.$emit('refresh');
            console.log(response);
          }, response => {
            console.log(response);
          });
      },

      handleClick(){
        this.$emit('click');
      },

      divPosition(cx,cy){
        return 'z-index:1;position:relative;left:'+cx+'px;top:'+cy+'px;'
      }
    }
  }
</script>

<style>
  .textSkill, .circleSkill {
    cursor: pointer;
  }

  p#testt {
    background-color: pink;
    display: inline-block;
    margin: 15px 0px 0px 25px;
    border-radius: 50px;
    padding: 0px 5px;
  }

  div.star-rating svg polygon:nth-child(3):hover{

  }

  /* Star rating */
  div.star-rating {
    width: 0px;
    height:0px;
    padding-top:7px;
  }

  .stars {
    cursor: pointer;
    width: 90px;
  }

  .stars:hover .star polygon {
    fill: #ffd055 !important;
  }

  .stars .star {
    float: left;
  }

  .stars .star polygon {
    fill: #d8d8d8;
  }

  .stars .star:hover ~ .star polygon {
    fill: #d8d8d8 !important;
  }

  .stars[data-stars] .star polygon {
    fill: #ffd055;
  }

  .stars[data-stars="1"] .star:nth-child(1) ~ .star polygon {
    fill: #d8d8d8;
  }

  .stars[data-stars="2"] .star:nth-child(2) ~ .star polygon {
    fill: #d8d8d8;
  }

  .stars[data-stars="3"] .star:nth-child(3) ~ .star polygon {
    fill: #d8d8d8;
  }

  .stars[data-stars="4"] .star:nth-child(4) ~ .star polygon {
    fill: #d8d8d8;
  }

  .stars[data-stars="5"] .star:nth-child(5) ~ .star polygon {
    fill: #d8d8d8;
  }

  .tooltip {
    position:absolute;
    display: block !important;
    pointer-events: none;
    padding: 4px;
    z-index: 10000;
  }

  /*margin-left: -5em;*/
  /*margin-top: -3em;*/

  .tooltip .tooltip-inner {
    position:absolute;
    background: #00CD63;
    color: white;
    border-radius: 16px;
    padding: 5px 10px 4px;
  }

  .tooltip tooltip-arrow{
    display: none;
  }

  .tooltip[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity .15s, visibility .15s;
  }

  .tooltip[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity .15s;
  }
</style>
