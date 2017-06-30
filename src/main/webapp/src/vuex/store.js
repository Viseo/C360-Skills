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
  collaboratorLoggedIn : {
    id: null,
    lastName: null,
    isAdmin: null,
    firstName: null,
    defaultPicture: null,
    email: null,
    version: null
  }
};

const store = new Vuex.Store({
  state: storeInit,

  actions: {

  },

  mutations: {
    setToken(state, collaboratorToken) {
      if(collaboratorToken!=null) {
        state.token = collaboratorToken;
        localStorage.setItem("token", collaboratorToken);
        state.collaboratorLoggedIn = jwtDecode(state.token);
      }
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
    }
  }
});
export default store
