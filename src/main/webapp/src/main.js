// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import Vuex from 'vuex'
import VueStrap from 'vue-strap'
import Router from 'vue-router'
import store from './vuex/store'
import router from './config/router'
import VTooltip from 'v-tooltip'
require('../node_modules/bootstrap/dist/css/bootstrap.css');
require('../node_modules/simplebar/dist/simplebar.css');
require('../node_modules/simplebar/dist/simplebar.js');

Vue.use(Vuex);
Vue.use(Router);
Vue.use(VTooltip);
Vue.config.productionTip = false;
Vue.component('dropdown', VueStrap.dropdown);

new Vue({
  el: '#app',
  store,
  router,
  template: `<div><router-view></router-view></div>`,
});
