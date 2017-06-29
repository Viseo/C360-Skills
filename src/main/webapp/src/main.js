// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import store from './vuex/store'
import router from './config/router'
var dropdown = require('vue-strap').dropdown;

require('../node_modules/bootstrap/dist/css/bootstrap.css');

Vue.use(Vuex);
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  store,
  router,
  template: `<div><router-view></router-view></div>`,
  components: {
    dropdown
  }
});
