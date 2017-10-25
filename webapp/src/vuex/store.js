/**
 * Created by NBE3663 on 15/06/2017.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import config from '../config/config'

Vue.use(Vuex);
var jwtDecode = require('jwt-decode');

var storeInit = {
  stayConnected: null,
  token: null,
  collabs:[],
  collaboratorLoggedIn : {
    id: null,
    lastName: null,
    isAdmin: null,
    firstName: null,
    defaultPicture: null,
    email: null,
    version: null,
  },
  foundedSkillsLabel: null,

};


const store = new Vuex.Store({
  state: storeInit,

  actions: {
    isTokenValid(context, router){
      console.log("TEST if token is valid");
      axios.post(config.server + '/api/sendtoken', localStorage.getItem("token")).then(
        response => {
          if(response.data != ""){
            console.log("Token valide");
            if (response.data == "admin"){
              console.log("Admin");
              this.state.isAdmin = true;
            }
            else{
              console.log("Not admin");
              this.state.isAdmin = false;
            }
          }
          else{
            console.log("Token non valide");
            context.commit('clearToken');
            context.commit('resetStore');
            router.push('/login');
          }
        }, response => {
          console.log("Token non valide");
          context.commit('clearToken');
          context.commit('resetStore');
          router.push('/login');
        })
    }
  },

  mutations: {
    setFoundedSkillsLabel(state, skillsFoundLabel){
      state.foundedSkillsLabel = skillsFoundLabel;
    },

    setToken(state, collaboratorToken) {
      if(collaboratorToken!=null) {
        state.token = collaboratorToken;
        localStorage.setItem("token", collaboratorToken);
        state.collaboratorLoggedIn = jwtDecode(state.token);
      }
    },

    setIsAdmin(state, isAdmin){
      state.isAdmin = isAdmin;
    },

    setTokenFromLocalStorage(state) {
      state.token = localStorage.getItem("token");
      if(state.token != null) {
        state.collaboratorLoggedIn = jwtDecode(state.token);
      }
    },

    resetStore(state) {
      Object.assign(state, storeInit);
    },

    clearToken(state) {
      state.token = null;
      localStorage.removeItem("token")
    },

    setStayConnected(state, stayConnected){
      state.stayConnected = stayConnected;
      localStorage.setItem("stayConnected", stayConnected);
    },

    clearStayConnected(state){
      state.stayConnected = null;
      localStorage.removeItem("stayConnected");
    }
  },

  getters: {

    stayConnected: state => {
      return state.stayConnected;
    },

    isAuthenticated: state => {
      return state.token != null
    },

    collaboratorLoggedIn: state => {
      return state.collaboratorLoggedIn;
    },

    token: state => {
      return state.token;
    },

    foundedSkillsLabel: state => {
      return state.foundedSkillsLabel;
    }
  }
});
export default store
