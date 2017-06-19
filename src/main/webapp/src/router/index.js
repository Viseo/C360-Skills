import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import mainPage from '../mainPage.vue'
import navigationMenu from '../components/layout/navigationMenu.vue'

Vue.use(VueResource);
Vue.use(Router);

export default new Router({
  mode: 'hash',
   routes: [
     {
       path: '/login',
       name: 'mainPage',
       component: mainPage,
       children: [{
         name: 'mainPage',
         path: "/login",
         component: navigationMenu
       }]
     },
     {
       path: "/",
       redirect: "/login"
     }
   ]
 })
