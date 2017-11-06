// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import store from './vuex/store'
import VTooltip from 'v-tooltip'
import router from './config/router.js'
import VueStrap from 'vue-strap'
import sha256 from '../node_modules/js-sha256/src/sha256'

require('../node_modules/bootstrap/dist/css/bootstrap.css');
require('../node_modules/bootstrap/dist/css/bootstrap.css');
require('../node_modules/simplebar/dist/simplebar.css');
require('../node_modules/simplebar/dist/simplebar.js');

Vue.use(Vuex);
Vue.use(Router);
Vue.use(VTooltip);
Vue.config.productionTip = false;
Vue.component('dropdown', VueStrap.dropdown);
Vue.component('typeahead', VueStrap.typeahead);
Vue.component('tooltip', VueStrap.tooltip);
Vue.prototype.$sha256=sha256;


// Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: `<div><router-view></router-view></div>`,
});
