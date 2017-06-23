import Vue from 'vue'
import Router from 'vue-router'
import mainPage from '../components/customComponent/mainPage.vue'
import containerSVG from '../components/pages/addSkillsPage.vue'
import navigationMenu from '../components/layout/signInUpMenu.vue'

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
     },
     {
       path: '/addSkills',
       name: 'addSkills',
       component: mainPage,
       children: [{
         name: 'mainPage',
         path: "/addSkills",
         component: containerSVG
       }]
     }
   ]
 })
