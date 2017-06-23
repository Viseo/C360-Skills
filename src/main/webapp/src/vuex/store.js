/**
 * Created by NBE3663 on 15/06/2017.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const LOGIN = "LOGIN";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGOUT = "LOGOUT";


const store = new Vuex.Store({
  state: {
   isLoggedIn: localStorage.getItem("token"),
    cx:"",
    cy:"",
    cx1:"",
    cy1:"",

  },
  mutations: {
    [LOGIN] (state){
      state.pending = true;
    },

    [LOGIN_SUCCESS](state){
      state.isLoggedIn = true;
      state.pending = true;
    },
    [LOGOUT](state){
      state.isLoggedIn = false;
    }
  },
  actions: {
    login({ commit}, creds) {
      console.log("login...", creds);
      commit (LOGIN);
      return new Promise (resolve =>{
        setTimeout(() =>{
          localStorage.setItem("token", "JWT");
          commit(LOGIN_SUCCESS);
          resolve();
        },1000)
      });
    },

    logout ({ commit}){
      localStorage.removeItem("token");
      commit(LOGOUT);
    }


  },
  getters: {
  isLoggedIn: state => {
    return state.isLoggedIn;
  }

  }
});
export default store
