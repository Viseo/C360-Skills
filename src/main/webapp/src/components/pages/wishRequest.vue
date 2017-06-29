<template>
  <div>
    <div class="wish-request" id="wish-request">
      <h4 class="mystyle">Demande de création</h4>
      <hr class="myhrline">
    </div>
    <div data-simplebar class="wishContainer">
      <div>
        <svg :viewBox="myViewBox"  height="300">
        <g id="wishSVG" v-for="(wish,i) in wishes">
        <customCircle :id="wish.id" :cx="positionX(i)" :cy="55" :content="wish.label" stroke="#aeaeae" fill="rgba(213, 211, 211, 0.4)"/>
          <circle @click="validWish(wish)" style="cursor: pointer" r="10" :cx="positionX(i) + 25" cy="120" fill="#09aa76"></circle>
          <text @click="validWish(wish)" text-anchor="middle" :x="positionX(i) + 25"  y="125" style="fill: white;cursor: pointer">✔</text>
          <circle @click="rejectWish(wish)" style="cursor: pointer" r="10" :cx="positionX(i) - 25" cy="120" fill="#a90909"></circle>
          <text @click="rejectWish(wish)" text-anchor="middle" :x="positionX(i) - 25"  y="125" style="fill: white;cursor: pointer">&#128465</text>
        </g>
      </svg>
      </div>
    </div>
  </div>


</template>

<script>
  import CustomCircle from "../customComponent/customcircle.vue"
  import config from '../../config/config'
  import axios from 'axios'
  export default{
      data() {
          return {
            posX: 80,
            wishes: [],
            myViewBox: '0 0 2000 250'
          }
      },
      mounted() {
        this.getAllWishes()
      },
      methods: {
        positionX(i) {
            return this.posX + i*150;
        },
        sendWish(wish){
          var wish = {"label": wish};
          axios.post(config.server + "/api/addwish", wish)
            .then(response => {
              console.log(response);
              this.getAllWishes();
            }, response => {
              console.log(response);
            })
        },

        getAllWishes(){
          axios.get(config.server + "/api/wishes")
            .then(response => {
              this.wishes = response.data;
              console.log(response.data);
              this.myViewBox = "0 0 " + parseInt(this.wishes.length*155 - 50) +" 250";
            })

        },

        validWish(wish){
          axios.post(config.server + "/api/removewish", wish)
            .then(response => {
              this.$emit('addWishToSkills', wish);
              this.getAllWishes();
            }, response => {
              console.log(response);
            })
        },

        rejectWish(wish){
          axios.post(config.server + "/api/removewish", wish)
            .then(response => {
              console.log(response);
              this.getAllWishes();
            }, response => {
              console.log(response);
            })

        },
      },
    components: {customCircle: CustomCircle}
  }


</script>

<style>
  .wishContainer {
    overflow: hidden;
    position: relative;
    width:100%;
    height:200px;
    padding-left:30px;
    padding-right:30px;
  }

  .wishContainer .simplebar-track.vertical {
    display: none;
  }

  .wishContainer .simplebar-scroll-content {
    overflow: hidden;
    min-width:90%;
  }

  #wishSVG {
    width:100%;
    height:100%;
  }
</style>

