<template>
  <div>
  <HeaderSkills></HeaderSkills>
  <router-view></router-view>
  </div>
</template>

<script>
import HeaderSkills from './layout/skillsHeader.vue'

  export default {
    components: { HeaderSkills: HeaderSkills},
  }


</script>
<style>
  /*body {*/

    /*margin:0;*/
    /*padding:0;*/
    /*background: url("../assets/image-2.jpeg") no-repeat center center fixed;*/
    /*background-size: cover;*/

  /*}*/
</style>
