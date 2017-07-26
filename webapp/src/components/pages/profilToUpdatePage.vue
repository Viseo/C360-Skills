<template>
  <form id="register-form"
        @submit.prevent="updateCollaboratorInfo()"
        enctype="multipart/form-data">
    <div class="col-lg-6 col-sm-12 col-xs-12 col-md-6 col-lg-offset-3 col-md-offset-3">
      <div class="panel panel-default">
        <div class="panel-header">
                <span>
                    <span class="glyphicon glyphicon-user"></span>
                    1. Mes coordonnées
                </span>
          <div class="boxon">
            <img id="profilImageToChange" class="image" v-if="defaultPicture"
                 src="../../../static/profile.jpg">
            <img id="profilImageToChange" class="image" v-else
                 :src="'../../../static/'+collaborator_id+'.jpg'">
            <p class="text">
              <input ref="loadProfilImage"
                     id="loadProfilImage"
                     type="file"
                     accept="image/*"
                     style="opacity: 0.0;
                                      position: absolute;
                                      top:0;
                                      left: 0;
                                      bottom: 0;
                                      right:0;
                                      width: 100%;
                                      height:100%;
                                      cursor:pointer;"/>
              <br><br><br><b>MODIFIER</b>
            </p>
          </div>
        </div>
        <div class="panel-body">
          <div class="col-lg-10 col-sm-12 col-xs-12 col-md-10 col-lg-offset-1 col-md-offset-1">
            <div class="row">
              <div class="col-lg-6 col-sm-6 col-xs-6 col-md-6">

                <!-- PRENOM -->
                <customInput
                  label="prenom"
                  labelText="Prénom"
                  icon="glyphicon-user"
                  type="text"
                  tab="2"
                  v-model="firstName"
                  maxlength="125" minlength="2"
                  @focus="setFirstNameEmptyToFalse()"
                  @blur="isFirstNameEmpty()"
                  :emptyField="firstNameEmpty"
                  :errorField="isErrorFirstName()"
                  :errorMessage="errorMessageFirstName">
                </customInput>
              </div>
              <div class="col-lg-6 col-md-6">

                <!-- FONCTION -->
                <customInput
                  label="fonction"
                  labelText="Fonction"
                  icon="glyphicon-tag"
                  type="text"
                  tab="2"
                  v-model="fonction"
                  maxlength="50">
                </customInput>
              </div>
            </div>
            <br>
            <div class="row">
              <div class="col-lg-6 col-sm-6 col-xs-6 col-md-6">
                <!-- NOM -->
                <customInput
                  label="nom"
                  labelText="Nom"
                  icon="glyphicon-user"
                  type="text"
                  tab="2"
                  v-model="lastName"
                  maxlength="125" minlength="2"
                  @focus="setLastNameEmptyToFalse()"
                  @blur="isLastNameEmpty()"
                  :emptyField="lastNameEmpty"
                  :errorField="isErrorLastName()"
                  :errorMessage="errorMessageLastName">
                </customInput>
              </div>
              <div class="col-lg-6 col-md-6 ">
                <!-- BUSINESS UNIT -->
                <table style="border-spacing: 0px">
                  <div class="form-group has-feedback">
                    <label>Business Unit</label>
                    <div class="inner-addon left-addon">
                      <tr>
                        <td style="width: 500px;">
                          <i class="glyphicon"></i>
                          <select class="form-control" v-model="businessUnit">
                            <option>VISEO DATA & PROCESS</option>
                            <option>VISEO TECHNOLOGIES</option>
                            <option>VISEO DIGITAL</option>
                          </select>
                        </td>
                      </tr>
                    </div>
                  </div>
                </table>
              </div>
            </div>
            <br>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-6 col-sm-12 col-xs-12 col-md-6 col-lg-offset-3 col-md-offset-3">
      <div class="panel panel-default">
        <div class="panel-header">
                <span>
                    <span class="glyphicon glyphicon-user"></span>
                    2. Mes identifiants
                </span>
        </div>
        <div class="panel-body">
          <div class="col-lg-10 col-sm-12 col-xs-12 col-md-6 col-lg-offset-1 col-md-offset-3">
            <div class="row">
              <div class="col-lg-5 col-sm-6 col-xs-6 col-md-12">
                <!-- MOT DE PASSE -->
                <customPasswordInput
                  label="ancienmdp"
                  labelText="Ancien mot de passe"
                  v-model="password"
                  @focus="setOldPasswordEmptyToFalse()"
                  @blur="isOldPasswordEmpty()"
                  :emptyField="oldPasswordEmpty"
                  :errorField="isErrorOldPassword()"
                  :errorMessage="errorMessageOldPassword"
                  :show="showPass"
                  @click="toggleShowPassword()"
                  :isValid="isValidOldPassword"
                  :isNotValid="isNotValidOldPassword">
                </customPasswordInput>
              </div>
              <div class="col-lg-6 col-lg-offset-1 col-md-12">
                <!-- EMAIL-->
                <customInput
                  label="email"
                  labelText="Email"
                  icon="glyphicon-envelope"
                  type="text"
                  tab="2"
                  v-model="email"
                  @focus="setEmailAlreadyExistToTrue()"
                  @blur="isEmailEmpty()"
                  :emptyField="emailEmpty"
                  :errorField="isErrorEmail()"
                  :errorMessage="errorMessageEmail"
                  :disabled="true">
                </customInput>
              </div>
            </div>
            <br>
            <div class="row">
              <div class="col-lg-5 col-sm-6 col-xs-6 col-md-12">
                <!-- NOUVEAU MOT DE PASSE -->
                <customPasswordInput
                  label="nouveaumdp"
                  labelText="Nouveau mot de passe"
                  v-model="newPassword"
                  @focus="setPasswordEmptyToFalse()"
                  @blur="isPasswordEmpty()"
                  :emptyField="passwordEmpty"
                  :errorField="isErrorPassword()"
                  :errorMessage="errorMessagePassword"
                  :show="showPass"
                  @click="toggleShowPassword()"
                  :isValid="isValidPassword"
                  :isNotValid="isNotValidPassword">
                </customPasswordInput>

              </div>
              <div class="col-lg-6 col-lg-offset-1 col-md-offset-1">
                <span><b>Remarque:</b></span><br>
                <p>Votre nouveau mot de passe doit contenir au minimum 6 caractères.</p>
              </div>
            </div>
            <br>
            <div class="row">
              <div class="col-lg-5 col-sm-6 col-xs-6 col-md-12">
                <!-- CONFIRMATION MOT DE PASSE -->
                <customPasswordInput
                  label="mdpc"
                  labelText="Confirmation mot de passe"
                  v-model="confirmPassword"
                  @focus="setConfirmPasswordEmptyToFalse()"
                  @blur="isConfirmPasswordEmpty()"
                  :emptyField="confirmPasswordEmpty"
                  :errorField="isErrorConfirmPassword()"
                  :errorMessage="errorMessageConfirmPassword"
                  :show="showPass"
                  @click="toggleShowPassword()"
                  :isValid="isValidConfirmPassword"
                  :isNotValid="isNotValidConfirmPassword">
                </customPasswordInput>
              </div>
              <div class="col-lg-6 col-lg-offset-1 col-md-offset-1">
                <br>
                <span v-show="!isRightOldPassword " class="color-red">
                                        <b>{{errorMessageOnSubmit}}</b>
                                    </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-6 col-sm-12 col-xs-12 col-md-6 col-lg-offset-3 col-md-offset-3">
      <div class="form-group">
        <div class="row">
          <div class="col-lg-5 col-lg-offset-1 col-md-3 col-md-offset-3 col-sm-6 col-xs-6">
            <button type="submit"
                    name="register-submit"
                    id="register-submit"
                    tabindex="4"
                    class="form-control btn btn-primary">
              Enregistrer
            </button>
          </div>
          <div class="col-lg-5 col-sm-6 col-xs-6 col-md-3">
            <button @click="goTo('registerTrainingCollaborator')"
                    name="cancel-submit"
                    id="cancel-submit"
                    tabindex="4"
                    class="form-control btn btn-primary">Annuler
            </button>
          </div>
          <br><br>
        </div>
      </div>
    </div>
  </form>
</template>
<script>
  import axios from 'axios'
  import config from '../../config/config'
  import customInput from '../customComponent/customInput.vue'
  import passwordInput from '../customComponent/passwordInput.vue'
  var $ = window.jQuery = require('jquery');

  export default {
    name: 'profil-to-update',
    components: {customInput: customInput, customPasswordInput: passwordInput},
    data: function () {
      return {
        collabDescription: '',
        firstName: '',
        fonction: '',
        lastName: '',
        businessUnit: '',
        email: '',
        password: '',
        newPassword: '',
        confirmPassword: '',

        lastNameEmpty: false,
        isLastNameValid: true,
        errorMessageLastName: '',

        firstNameEmpty: false,
        isFirstNameValid: true,
        errorMessageFirstName: '',

        emailEmpty: false,
        isEmailValid: true,
        errorMessageEmail: '',

        passwordEmpty: false,
        isPasswordValid: true,
        errorMessagePassword: '',
        isValidPassword: false,
        isNotValidPassword: false,

        oldPasswordEmpty: false,
        isOldPasswordValid: true,
        errorMessageOldPassword: '',
        errorMessageOnSubmit: '',
        isValidOldPassword: false,
        isNotValidOldPassword: false,

        confirmPasswordEmpty: false,
        isConfirmPasswordValid: true,
        errorMessageConfirmPassword: '',
        isValidConfirmPassword: false,
        isNotValidConfirmPassword: false,

        isRightOldPassword: true,

        showPass: false,
        infoCollab: [],
        CollabToUpdate: {},
        imagePathName: 'img/profile.jpg',
        imageHasBeenChanged: false,
        imagePath: '',

        collaborator_id: '',
        defaultPicture: true

      }
    },

    watch: {
      lastName: function (value) {
        this.verifyLastName(value);
      },
      firstName: function (value) {
        this.verifyFirstName(value);
      },
      email: function (value) {
        this.verifyEmail(value);
      },
      password: function (value) {
        this.verifyOldPassword(value);
      },
      newPassword: function (value) {
        this.verifyPassword(value);
        if (this.confirmPassword != '')
          this.verifyConfirmPassword(value);
      },
      confirmPassword: function (value) {
        this.verifyConfirmPassword(value);
      }
    },

    mounted: function () {
      this.initializeCollaboratorInformation();
      this.getCollabDescription();
      this.checkIfProfilImageHasBeenChanged("#loadProfilImage");
      this.imagePath = "../../assets/" + this.collaborator_id + ".jpg";
    },

    methods: {

      checkIfProfilImageHasBeenChanged(idImage) {
        let currentProfilImage = $(idImage);
        let self = this;

        function displayNewImageFile(input, idImage) {
          let imageFile = input.files[0];
          let isImageSelected = input.files && input.files[0];
          let newProfilImage = $(idImage);

          if (isImageSelected) {
            var reader = new FileReader();

            reader.onload = function (e) {
              newProfilImage.attr('src', e.target.result);
            };
            reader.readAsDataURL(imageFile);
            console.log("File: " + imageFile.name + " selected");
          }

        };

        currentProfilImage.change(function () {
          displayNewImageFile(this, '#profilImageToChange');
          self.imageHasBeenChanged = true;
        });
      },

      setLastNameEmptyToFalse() {
        this.lastNameEmpty = false;
      },

      setFirstNameEmptyToFalse() {
        this.firstNameEmpty = false;
      },

      setEmailAlreadyExistToTrue() {
        this.emailEmpty = false
      },

      verifyLastName(lastName) {
        if (/^(([a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]+[\s]{0,1})+[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]*){2,125}$/.test(lastName)) {
          this.errorMessageLastName = '';
          this.isLastNameValid = true;
        } else {
          this.errorMessageLastName = 'Veuillez entrer un nom valide';
          this.isLastNameValid = false;
        }
      },

      isLastNameEmpty(){
        if (this.lastName == '') {
          this.lastNameEmpty = true;
        }
      },

      isErrorLastName() {
        return !this.isLastNameValid && !this.lastNameEmpty;
      },

      verifyFirstName(firstName) {
        if (/^(([a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]+[\s]{0,1})+[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]*){2,125}$/.test(firstName)) {
          this.errorMessageFirstName = '';
          this.isFirstNameValid = true;
        } else {
          this.errorMessageFirstName = 'Veuillez entrer un prénom valide';
          this.isFirstNameValid = false;
        }
      },

      isFirstNameEmpty(){
        if (this.firstName == '') {
          this.firstNameEmpty = true;
        }
      },

      isErrorFirstName() {
        return !this.isFirstNameValid && !this.firstNameEmpty;
      },

      verifyEmail(email){
        if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((([0-9]{1,3}\.)+[0-9]{1,3})|(([a-zA-ZàÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ\-0-9]+\.)+[a-zA-Z0-9]{2,}))$/
            .test(email)) {
          this.errorMessageEmail = '';
          this.isEmailValid = true;
        } else {
          this.errorMessageEmail = 'Veuillez entrer un email valide';
          this.isEmailValid = false;
        }
      },

      isEmailEmpty(){
        if (this.email == '') {
          this.emailEmpty = true;
        }
      },

      isErrorEmail() {
        return !this.isEmailValid && !this.emailEmpty;
      },

      setConfirmPasswordEmptyToFalse(){
        this.confirmPasswordEmpty = false;
      },

      isConfirmPasswordEmpty(){
        if (this.confirmPassword == '') {
          this.confirmPasswordEmpty = true;
          this.isValidConfirmPassword = false;
          this.isNotValidConfirmPassword = true;

        }
      },

      isErrorConfirmPassword(){
        return !this.isConfirmPasswordValid && !this.confirmPasswordEmpty;
      },

      setOldPasswordEmptyToFalse(){
        this.oldPasswordEmpty = false;
      },

      isOldPasswordEmpty(){
        if (this.password == '') {
          this.oldPasswordEmpty = true;
          this.isValidOldPassword = false;
          this.isNotValidOldPassword = false;
        }
      },

      isErrorOldPassword(){
        return !this.isOldPasswordValid && !this.oldPasswordEmpty;
      },

      setPasswordEmptyToFalse(){
        this.passwordEmpty = false;
      },

      isPasswordEmpty(){
        if (this.newPassword == '') {
          this.passwordEmpty = true;
          this.isValidPassword = false;
          this.isNotValidPassword = false;
        }
      },

      isErrorPassword(){
        return !this.isPasswordValid && !this.passwordEmpty;
      },

      toggleShowPassword(){
        this.showPass = !this.showPass;
      },

      verifyOldPassword(password) {
        if (/^(.){6,125}$/.test(password)) {
          this.errorMessageOldPassword = '';
          this.isOldPasswordValid = true;
          this.isValidOldPassword = true;
          this.isNotValidOldPassword = false;
        } else {
          this.errorMessageOldPassword = 'Le mot de passe doit avoir au minimum 6 caractères';
          this.isOldPasswordValid = false;
          this.isValidOldPassword = false;
          this.isNotValidOldPassword = true;
        }
      },

      verifyPassword(password) {
        console.log(password)
        if (/^(.){6,125}$/.test(password)) {
          this.errorMessagePassword = '';
          this.isPasswordValid = true;
          this.isValidPassword = true;
          this.isNotValidPassword = false;
        } else {
          this.errorMessagePassword = 'Le mot de passe doit avoir au minimum 6 caractères';
          this.isPasswordValid = false;
          this.isValidPassword = false;
          this.isNotValidPassword = true;
        }
      },

      verifyConfirmPassword(confirmPassword) {
        if (this.confirmPassword === this.newPassword) {
          this.errorMessageConfirmPassword = '';
          this.isConfirmPasswordValid = true;
          this.isValidConfirmPassword = true;
          this.isNotValidConfirmPassword = false;
        } else {
          this.errorMessageConfirmPassword = 'La confirmation du mot de passe n\'est pas valide';
          this.isConfirmPasswordValid = false;
          this.isValidConfirmPassword = false;
          this.isNotValidConfirmPassword = true;
        }
      },

      initializeCollaboratorInformation(){
        let collaboratorInfo = this.$store.getters.collaboratorLoggedIn;
        let isCollaboratorInfoNotEmpty = collaboratorInfo != "";
        if (isCollaboratorInfoNotEmpty) {
          this.collaborator_id = collaboratorInfo.id;
          this.defaultPicture = collaboratorInfo.defaultPicture;
        }
      },

      updateCollaboratorImage(){
        let dataToSend = new FormData();
        let imageCollaboratorFile = this.$refs.loadProfilImage.files[0];
        dataToSend.append("file", imageCollaboratorFile);
        dataToSend.append("idCollaborator", this.collaborator_id);
        axios.post(config.server + '/fileUpload', dataToSend).then(function (response) {
          console.log(response);
        });
      },

      getCollabDescription(){
        axios.get(config.server + "/api/collabdescriptionbyid/" + this.collaborator_id).then(
          response => {
            this.collabDescription = response.data;
            this.firstName = this.collabDescription.firstName;
            this.lastName = this.collabDescription.lastName;
            this.email = this.collabDescription.email;
            this.fonction = this.collabDescription.function;
            this.businessUnit = this.collabDescription.businessUnit;
          });
      },


      saveUpdateCollaborator(){
        axios.put(config.server + "/api/updatecollaborator", this.CollabToUpdate).then(
          response => {
            console.log("success to update user information");
            this.imageHasBeenChanged = false;
            this.$store.commit('setToken', response.data['userConnected']);
            this.$router.go(this.$router.currentRoute.path);
          });
      },

      updateCollaboratorInfo(){
        this.isFirstNameEmpty();
        this.isLastNameEmpty();
        this.isEmailEmpty();
        this.CollabToUpdate = this.collabDescription;
        this.CollabToUpdate.firstName = this.firstName;
        this.CollabToUpdate.lastName = this.lastName;
        this.CollabToUpdate.email = this.email;
        this.CollabToUpdate.function = this.fonction;
        this.CollabToUpdate.businessUnit = this.businessUnit;
        if (this.password == '' && this.newPassword == '' && this.confirmPassword == '') {
          this.oldPasswordEmpty = false;
          this.passwordEmpty = false;
          this.confirmPasswordEmpty = false;
          this.isRightOldPassword = true;
          if (this.imageHasBeenChanged === true) {
            this.updateCollaboratorImage();
            this.CollabToUpdate.defaultPicture = false;
            document.cookie = "defaultPicture=false";
          }
          this.saveUpdateCollaborator();
        } else {
          if (this.collabDescription.password == this.password) {
            this.isRightOldPassword = true;
            this.oldPasswordEmpty = false;
            this.passwordEmpty = false;
            if (this.collabDescription.password != this.newPassword) {
              if (this.newPassword == this.confirmPassword) {
                this.CollabToUpdate.password = this.newPassword;
                if (this.imageHasBeenChanged === true) {
                  this.updateCollaboratorImage();
                  this.CollabToUpdate.defaultPicture = false;
                  document.cookie = "defaultPicture=false";
                }
                this.saveUpdateCollaborator();
              }
            } else {
              console.log("mot de passe" + this.collabDescription.password);
              this.isRightOldPassword = false;
              this.errorMessageOnSubmit = "Votre nouveau mot de passe doit être différent de votre ancien mot de passe."
            }

          } else {
            console.log(this.collabDescription.password);
            this.isRightOldPassword = false;
            this.errorMessageOnSubmit = "Ancien mot de passe incorrect."
          }
        }
      },
    }
  }
</script>
<style>
  #register-form .panel-header {
    background-color: rgba(126, 126, 126, 0.62);
    width: 100%;
    height: 26px;
    padding-left: 20px;
    padding-top: 4px;
    color: white;
    word-spacing: 0px;
  }

  .boxon {
  }

  .image {
    position: absolute;
    margin-left: 620px;
    margin-top: -50px;
    cursor: pointer;
    border-radius: 50%;
    object-fit: cover;
    height: 80px;
    width: 80px;
    z-index: 1;
  }

  .text {
    position: absolute;
    margin-left: 620px;
    margin-top: -50px;
    text-align: center;
    border-radius: 50%;
    height: 80px;
    width: 80px;
    font-size: smaller;
    visibility: hidden;
    color: white;
    opacity: 0.6;
    z-index: 2;
    background: black;
  }

  .boxon:hover .text {
    visibility: visible;
    opacity: 0.6;
  }

  .panel .panel-default {
    margin-top: 20%;
  }

  .color-green {
    color: #4cae4c
  }

  .color-red {
    color: #B22222;
  }

  .fontsize {
    font-size: 150%;
  }

  /* enable absolute positioning */
  .inner-addon {
    position: relative;
  }

  /* style icon */
  .inner-addon .glyphicon {
    position: absolute;
    padding: 10px;
    pointer-events: none;
  }

  /* align icon */
  .left-addon .glyphicon-left {
    left: 0px;
  }

  .right-addon .glyphicon-right {
    right: 0px;
  }

  /* add padding  */
  .left-addon input {
    padding-left: 30px;
  }

  .right-addon input {
    padding-right: 30px;
  }

  .password {
    position: relative;
  }

  .password .glyphicon-eye-open, #password2 .glyphicon-eye-open {
    right: 10px;
    position: absolute;
    top: 12px;
    cursor: pointer;
  }

  .password .glyphicon-eye-close, #password2 .glyphicon-eye-close {
    right: 10px;
    position: absolute;
    top: 12px;
    cursor: pointer;
  }

  .password .glyphicon-ok-circle, .glyphicon-remove-circle {
    left: 120px;
    position: absolute;
    top: 12px;
    margin-left: 50%;
  }

  .password .glyphicon-lock, #password2 .glyphicon-lock {

    left: 10px;
    position: absolute;
    top: 12px;
    cursor: pointer;
    pointer-events: none;
  }

  .password input[type="password"] {
    padding-right: 30px;
    padding-left: 30px;
  }

  .password input[type="text"] {
    padding-right: 30px;
    padding-left: 30px;
  }

  .tab-group {
    list-style: none;
    padding: 0;
    margin: 0 0 40px 0;
  }

  .tab-group:after {
    content: "";
    display: table;
    clear: both;
  }

  .tab-group li a {
    display: block;
    text-decoration: none;
    padding: 15px;
    background: rgba(160, 179, 176, 0.25);
    color: #a0b3b0;
    font-size: 20px;
    float: left;
    width: 50%;
    text-align: center;
    cursor: pointer;
    -webkit-transition: .5s ease;
    transition: .5s ease;
  }

  .tab-group li a:hover {
    background: #8db9df;
    color: #ffffff;
  }

  .tab-group .active a {
    background: #428bca;
    color: #ffffff;
  }

  .tab-content > div:last-child {
    display: none;
  }

  [v-cloak] {
    display: none;
  }

  .forgotPassword {
    float: right;
  }

  /* Popup container */
  .popup {
    position: relative;
    display: inline-block;
    cursor: pointer;

  }

  /* The actual popup (appears on top) */
  .popup .popuptext {

    background-color: #F0F0F0;
    color: #2b2b29;
    text-align: center;
    border-radius: 6px;
    padding: 8px 0;
    position: absolute;
    z-index: 1;
    padding: 10px;
    bottom: 400%;
    left: 75%;
    margin-left: -80px;
  }

  .slideInUp {
    -webkit-animation-name: slideInUp;
    animation-name: slideInUp;
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
  }

  /* Popup arrow */
  .popup .popuptext:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #F0F0F0 transparent transparent transparent;
  }

  /* this border color controlls the outside, thin border */
  .popup .popuptext:before {
    top: 9px;
    border-color: #a00 transparent transparent transparent;
    border-width: 11px;
  }

  #register-submit {
    background: rgb(224, 53, 89);
    border-color: rgb(224, 53, 89);
  }

  #cancel-submit {
    background: rgb(224, 53, 89);
    border-color: rgb(224, 53, 89);
  }
</style>
