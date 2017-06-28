<template>
  <div>
    <div class="wish-request" id="wish-request">
      <b class="mybstyle">Demande de création</b>
      <hr class="myhrline">
    </div>
    <div>
      <svg version="1.1" viewBox="0 0 1250 1250" preserveAspectRatio="xMinYMin meet">
        <g v-for="(wish,i) in wishes">
        <customCircle :id="wish.id" :cx="positionX(i)" :cy="55" :content="wish.label" stroke="#E03559" fill="white"/>
          <circle @click="validWish(wish)" style="cursor: pointer" r="10" :cx="positionX(i) + 25" cy="120" fill="#09aa76"></circle>
          <text @click="validWish(wish)" text-anchor="middle" :x="positionX(i) + 25"  y="125" style="fill: white;cursor: pointer">✔</text>
          <circle @click="rejectWish(wish)" style="cursor: pointer" r="10" :cx="positionX(i) - 25" cy="120" fill="#a90909"></circle>
          <text @click="rejectWish(wish)" text-anchor="middle" :x="positionX(i) - 25"  y="125" style="fill: white;cursor: pointer">&#128465</text>
        </g>
      </svg>
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
            posX: 100,
            wishes: []
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

</style>
