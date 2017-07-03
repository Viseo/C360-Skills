<template>
  <g>
    <circle v-show="showCircleBlur" @click="handleClick()" class="circleSkill" :id="cx+''+cy" :cx="cx" :cy="cy" r="50" :fill="fill" :stroke="stroke" stroke-width="10"></circle>
    <circle @click="handleClick()" class="circleSkill" :cx="cx" :cy="cy" r="53" :fill="fill" :stroke="stroke" stroke-width="2"></circle>
    <text @click="handleClick()" class="textSkill" text-anchor="middle" :x="cx" :y="cy" style="fill: rgba(0,0,0,0.52);">{{content}}</text>
    <foreignObject :x="cx-45" :y="cy+5">
      <div v-show="!admin">
        <star-rating @rating-selected ="setRating" v-model="rating" :show-rating="false" :star-size="18"></star-rating>
      </div>
    </foreignObject>
  </g>
</template>

<script>
  import store from "../../vuex/store"
  import axios from 'axios'
  import config from '../../config/config'
  import StarRating from 'vue-star-rating'
  export default {


    components: {
      StarRating
    },
    props:["admin","cx","cy", "content","fill","stroke","showCircleBlur","score","expertise"],
    data () {
      return {
        selectedExpertise:this.expertise,
        rating: this.score,
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
        this.updateExpertise(this.selectedExpertise,raiting);
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

  /* Star rating */
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
</style>
