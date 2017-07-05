<template>
    <div class=" col-lg-4 col-lg-offset-4 col-lg-4 searchField typeaheadSkills"
         @keyup.enter="storeSkillsFound(capitalizeSearch)">
      <span class="glyphicon glyphicon-search" @click="storeSkillsFound(capitalizeSearch)"></span>
      <typeahead
        class="inputForm "
        v-model="value"
        :data="allSkillsName"
        placeholder="Chercher une compétence">
      </typeahead>
      <div class="noResultDiv" v-show="noSkillsFound">
        <div>La compétence que vous rechercher n'est pas référencée</div>
        <span @click="sendWish(valueStock[0])"> Cliquez ici pour la proposer </span>
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
        valueStock: []

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
        console.log(nom);
        for (let index in this.skills) {
          if (this.skills[index].label.indexOf(nom) != -1) {
            this.skillsFound.push(this.skills[index]);
          }
        };
        this.valueStock.push(this.value);
        for(let i in this.valueStock){
            for(let index in this.skills) {
              if ( this.skills[index].label.indexOf(this.valueStock[i]) != -1){
                this.valueStock.splice(0, this.valueStock.length);

              }
            }

        };
        this.noSkillsFound = (this.skillsFound.length == 0) ? true : false;
        this.$store.commit('setFoundedSkillsLabel', this.skillsFound);


      },
      sendWish(wish){
        var wish = {"label": wish};
        axios.post(config.server + "/api/addwish", wish)
          .then(response => {
              console.log("hello")
            this.valueStock.splice(0,this.valueStock.length);
            console.log(this.valueStock);
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
    padding: 12px 20px;
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
    background-color: #fff;
    text-decoration: #3032ff;
  }

  .typeaheadSkills .dropdown-menu > li > a {
    display: block;
  }

  .inputForm .form-control {
    padding: 25px 15px;
  }

  .glyphicon-search {
    top: 40px;
    z-index: 1;
    left: 95%;
    font-size: 20px;
    color: tan;
  }

  .noResultDiv {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    margin-top: 25px;
    Font-Weight: Bold;

  }





</style>
