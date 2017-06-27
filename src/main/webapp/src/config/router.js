import Vue from 'vue'
import Router from 'vue-router'
import mainPage from '../components/customComponent/mainPage.vue'
import containerSVG from '../components/pages/addSkillsPage.vue'
import navigationMenu from '../components/layout/signInUpMenu.vue'
import wishrequest from '../components/pages/wishRequest.vue'

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
     },

     // {
     //   path: '/addSkills',
     //   name: 'addSkills',
     //   component: mainPage,
     //   children: [{
     //     name: 'mainPage',
     //     path: "/addSkills",
     //     component: wishRequest
     //   }]
     // }
   ]
 })
