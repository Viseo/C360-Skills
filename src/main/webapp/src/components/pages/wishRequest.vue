<template>
  <div>
    <div class="wish-request" id="wish-request">
      <b class="mybstyle">Demande de création</b>
      <hr class="myhrline">
    </div>
    <div data-simplebar class="wishContainer">
      <div>
        <svg data-simplebar :viewBox="myViewBox"  height="300">

        <g id="wishSVG" v-for="(wish,i) in wishes">
        <customCircle :id="wish.id" :cx="positionX(i)" :cy="55" :content="wish.label" stroke="#E03559" fill="white"/>
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
<link rel="stylesheet" href="https://unpkg.com/simplebar@latest/dist/simplebar.css" />
<script src="https://unpkg.com/simplebar@latest/dist/simplebar.js"></script>
<script>
  import CustomCircle from "../customComponent/customcircle.vue"
  import config from '../../config/config'
  import axios from 'axios'
  export default{
      data() {
          return {
            posX: 100,
            wishes: [],
            myViewBox: '0 0 2000 200'
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
              console.log(this.wishes.length*150);
              this.myViewBox = "0 0 " + parseInt(this.wishes.length*155) +" 200";
              //document.getElementById("wish-request").setAttribute("viewBox", "0,0, "+ 1000+this.wishes.length *150+",200");
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
    overflow-x: scroll;
    position: relative;
    /*height: 300px;*/
    /*width:1900px;*/
    width:100%;
    height:100%;
  }

  #wishSVG {
    overflow-y: hidden;
    width:100%;
    height:100%;
  }

/*.wishContainer {*/
  /*display: inline-block;*/
  /*width: 100%;*/
  /*vertical-align: middle;*/
  /*overflow-x: scroll;*/
/*}*/
  /*.newDiv {*/
    /*overflow:auto;*/
  /*}*/
</style>
