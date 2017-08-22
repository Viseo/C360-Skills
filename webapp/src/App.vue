<template>
  <div id="app" class="loginImg">
    <img src="./assets/logo.png">
    <hello></hello>
  </div>
</template>

<script>
import Hello from './components/Hello'

export default {
  name: 'app',
  components: {
    Hello
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

  /*.loginImg{*/
    /*margin:0;*/
    /*padding:0;*/
    /*background: url("assets/image-2.jpeg") no-repeat center center fixed;*/
    /*background-size: cover;*/
  /*}*/
</style>
