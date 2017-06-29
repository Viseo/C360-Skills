/**
 * Created by NBE3663 on 15/06/2017.
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
var jwtDecode = require('jwt-decode');

const store = new Vuex.Store({
  state: {
    stayConnected: null,
    token: null,
    collaboratorLoggedIn : {
      id: null,
      lastName: null,
      roles: null,
      firstName: null,
      defaultPicture : null,
      email : null,
      version : null
    }
  },

  actions: {

  },

  mutations: {
    setToken(state, collaboratorToken) {
      state.token = collaboratorToken;
      localStorage.setItem("token", collaboratorToken);
      state.collaboratorLoggedIn = jwtDecode(localStorage.getItem("token"));
    },

    setTokenFromLocalStorage(state) {
      state.token = localStorage.getItem("token");
      state.collaboratorLoggedIn = jwtDecode(state.token);
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
    }
  }
});
export default store
