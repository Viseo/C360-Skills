import Vue from 'vue'
import Router from 'vue-router'
import mainPage from '../components/mainPage.vue'
import collabSVG from '../components/pages/showSkillsCollabPage.vue'
import containerSVG from '../components/pages/addSkillsPage.vue'
import navigationMenu from '../components/layout/signInUpMenu.vue'
import wishrequest from '../components/pages/wishRequest.vue'
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
    console.log("admin");
    next('/addSkills');
  }
  else if (isAlreadyAuthenticated() && !isAdministratorAuthenticated()) {
    console.log("collab");
    next('/showSkillsCollab');
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
    },    {
      path: '/showSkillsCollab',
      name: 'showSkillsCollab',
      component: mainPage,
      beforeEnter: requireCollaboratorAuthentification,
      children: [{
        name: 'mainPage',
        path: "/showSkillsCollab",
        component: collabSVG
      }]
    },
  ]
});

const PAGE_TITLE = {
  "/login": "Accueil C360",
  "/resetPassword": "Mise à jour mot de passe",
  "/addSkills": "Gestion des compétences",
  "/profiltoupdate": "Modifier mon profil"
};

const PAGE_FAVICON = {
  "/login": "../assets/microservices_icon/icon_accueil.png",
  "/resetPassword": "../assets/microservices_icon/icon_accueil.png",
  "/profiltoupdate": "../assets/microservices_icon/icon_competence.png",
  "/addSkills": "../assets/microservices_icon/icon_competence.png"
};

router.afterEach((toRoute, fromRoute) => {
  window.document.title = PAGE_TITLE[toRoute.path];
  let pageOldIconTab = window.document.getElementById('dynamic-favicon');
  let pageNewIconTab = window.document.createElement('link');
  pageNewIconTab.id = 'dynamic-favicon';
  pageNewIconTab.rel = 'icon';
  pageNewIconTab.href = PAGE_FAVICON[toRoute.path];
  if (pageOldIconTab) {
    window.document.head.removeChild(pageOldIconTab);
  }
  window.document.head.appendChild(pageNewIconTab);
});
export default router;
