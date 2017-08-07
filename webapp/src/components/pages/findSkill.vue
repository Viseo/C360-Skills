<template>
    <div class=" col-lg-4 col-lg-offset-4 col-lg-4 searchField typeaheadSkills"
         @keyup.enter="storeSkillsFound(capitalizeSearch)">
      <span class="glyphicon glyphicon-search" ref="searchSkill" @click="storeSkillsFound(capitalizeSearch)"></span>
      <typeahead
        class="inputForm "
        v-model="value"
        :data="allSkillsName"
        placeholder="Chercher une compétence">
      </typeahead>
      <div class="noResultDiv" v-show="noSkillsFound">
        <span>La compétence que vous recherchez n'est pas référencée.</span><span class="pointer" @click="sendWish"> Cliquez ici pour la proposer.</span>
        <div v-show="wishSent">Votre proposition de compétence {{valueStock}} a bien été prise en compte.</div>
      </div>
    </div>
</template>

<script>
  import axios from 'axios';
  import config from '../../config/config';

  export default {
    data (){
      return {
        skills: [],
        allSkillsName: [],
        skillsFound: [],
        noSkillsFound: false,
        value: '',
        wish:'',
        showAnimation: false,
        valueStock: '',
        wishSent: false,
        savedValue: ''
      };
    },
    mounted(){
      this.checkSkillsFromDatabase();
    },

    computed: {
      capitalizeSearch: function () {
        if (this.value) {
          return this.value.toUpperCase();
        }
        else return null;
      },

    },

    watch: {
      value: function() {
          if(this.value) {
            this.savedValue = this.value;
          }
      }
    },

    methods: {
      checkSkillsFromDatabase(){
        axios.get(config.server + '/api/skills')
          .then(response => {
            this.skills = response.data;
            this.skills.sort(function (a, b) {
              return (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0);
            });
            this.selectedSkillsLabel();
          })
      },

      selectedSkillsLabel(){
        for (var index in this.skills) {
          this.allSkillsName.push(this.skills[index].label);
        }
        ;
      },
      storeSkillsFound(nom){
        this.skillsFound.splice(0, this.skillsFound.length);
        for (let index in this.skills) {
          if (this.skills[index].label.indexOf(nom) != -1) {
            this.skillsFound.push(this.skills[index]);
          }
        };
        this.noSkillsFound = (this.skillsFound.length == 0) ? true : false;
        if(this.noSkillsFound)
          this.valueStock=this.value;
        this.$store.commit('setFoundedSkillsLabel', this.skillsFound);
      },
      sendWish(){
        if(!this.valueStock) this.valueStock = this.savedValue;
        var wish = {"label": this.valueStock};
        axios.post(config.server + "/api/addwish", wish)
          .then(response => {
            this.wishSent = true;
            setTimeout( () => {
                this.wishSent = false;
              },3000);
            this.savedValue = "";
            console.log(response);
          }, response => {
            console.log(response);
          })
      },
    },
  }


</script>

<style>
  .typeaheadSkills {
    width: 800px;
    margin-left: 400px;
    height: 92px;
    box-sizing: border-box;
  }

  .typeaheadSkills .dropdown-menu {
    position: static;
    width: 100%;
    padding: 12px 20px;
    background-color: #fff;
    margin: 8px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    max-height: 150px;
    overflow-y: auto;
  }

  .typeaheadSkills .dropdown-menu > .active > a {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.42857143;
    color: #333;
    background-color: rgb(224, 53, 89);
    text-decoration: #3032ff;
      color: #fff;
  }

  .typeaheadSkills .dropdown-menu > li > a {
    display: block;
  }

  .inputForm .form-control {
    padding: 20px 15px;
  }

  .inputForm {
    bottom:20px;
    z-index:5;
  }

  .inputForm .form-control:focus {
    outline: none !important;
    border:1px solid #ff9ebe;
    box-shadow: 0 0 10px #76071b;
  }

  .glyphicon-search {
    top: 15px;
    z-index: 6;
    left: 95%;
    font-size: 20px;
    color: tan;
  }

  .noResultDiv {
    position:relative;
    bottom:10px;
    text-align: center;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  .noResultDiv .pointer {
    cursor: pointer;
    color: #0979af;
  }
  .noResultDiv div {
    color: #4c924c;
  }



</style>
