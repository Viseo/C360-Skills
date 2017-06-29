import Vue from 'vue'
import Router from 'vue-router'
import mainPage from '../components/mainPage.vue'
import containerSVG from '../components/pages/addSkillsPage.vue'
import navigationMenu from '../components/layout/signInUpMenu.vue'
import error404Page from '../components/pages/error404Page.vue'
var jwtDecode = require('jwt-decode');
Vue.use(Router);

function isAlreadyAuthenticated() {
  var userToken = localStorage.getItem('token');
  return userToken != null;
}

function isAdministratorAuthenticated() {
  var userToken = localStorage.getItem('token');
  var isAdministrator = jwtDecode(userToken).isAdmin;
  return isAdministrator;
}

function requireCollaboratorAuthentification(to, from, next) {
  if (isAlreadyAuthenticated() && !isAdministratorAuthenticated()) {
    next()
  } else {
    next('/login')
  }
}

function requireAdministratorAuthentification(to, from, next) {
  if (isAlreadyAuthenticated() && isAdministratorAuthenticated()) {
    next()
  } else {
    next('/login')
  }
}

function redirectIfAlreadyAuthenticated(to, from, next) {
  if (isAlreadyAuthenticated() && isAdministratorAuthenticated()) {
    next('/addSkills')
  }
  else if (isAlreadyAuthenticated() && !isAdministratorAuthenticated()) {
    next('/bidule')
  }
  else {
    next()
  }
}

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/login',
      name: 'mainPage',
      component: mainPage,
      beforeEnter: redirectIfAlreadyAuthenticated,
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
      beforeEnter: requireAdministratorAuthentification,
      children: [{
        name: 'mainPage',
        path: "/addSkills",
        component: containerSVG
      }]
    },
    {
      path: "*",
      component: mainPage,
      children: [
        {
          name: 'mainPage',
          path: "*",
          component: error404Page
        }
      ]
    }
  ]
});

export default router;
