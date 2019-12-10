import * as firebase from 'firebase';
import $ from "jquery";
// import "jquery-ui/ui/widgets/datepicker";
// import 'jquery-datepicker';
// import 'materialize-css';
// import { Datepicker } from 'materialize-css/dist/js/materialize.js';
// import 'materialize-css/dist/js/materialize.js';
// import 'materialize-css/js/component.js';
// import 'materialize-css/js/datepicker.js';
import Vue, { VNode } from 'vue';

const home = Vue.extend({
  // el: '#app',
  data() {
    return {
      isHidden: false,
      emailRE: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      playerList: '',
      teams: [
        { member: 'one,two,three,four,five' },
        { member: 'one,two,three,four,five' }
      ],
      db: firebase.firestore(),
      teamOne: [
        { name: '' },
      ],
      teamTwo: [
        { name: '' }
      ],
      newPlayerArray: [],
      newUser: {
        email: '',
        name: ''
      },
      usersRef: {
        user: ''
      },
      hasPlayers: false,
      noPlayers: true,
      originalQueue: '',
      randomQueue: '',
      dateOfGame: new Date(),
      dateOfGameText: '',
      currentTeams: {},
      userEmail: 'Não está autenticado',
      emailAddress: '',
      password: '',
      userDisplayName: '',
      userEmailVerified: false,
      userPhotoURL: '',
      userIsAnonymous: false,
      userUid: '',
      userProviderData: [],
      currentUser: [],
      isLogged: false,
      activeGame: false
    }
  },
  computed: {
    newUSer(): any { return this.newUser },
    validation(): any {
      return {
        name: !!this.newUser.name.trim(),
        email: this.emailRE.test(this.newUser.email)
      }
    },
    isValid(): any {
      var validation = this.validation;
      return Object.keys(validation).every(function (key) {
        return validation[key]
      })
    },
    returnPlayerTeams(): any {
      let players = this.playerList.split(',');

      if (players.length < 10) {
        this.teamOne = [];
        this.teamTwo = [];
      }
      
      if (players.length < 10) {
        this.noPlayers = true;
        return 'Não há jogadores suficientes!';
      }
      
      this.noPlayers = false;
      this.hasPlayers = true;

      if( players.length === 10 && this.teamOne.length < 5 && this.teamTwo.length < 5 ) {
        return 'Existem jogadores suficientes! Clique em shuffle para criar as equipas!';
      }
      
      if (this.newPlayerArray.length > 0) {
        this.noPlayers = false;
        this.hasPlayers = true;        
        this.randomQueue = this.newPlayerArray.join();
      }
      return this.randomQueue;
    },
    playerListDisabled(): any {      
      return this.playerList.split(',').length === 10 && this.teamOne.length === 5 && this.teamTwo.length === 5 ;
    },
    userIsHidden(): any {
      console.log(this.isHidden);
      
      if (this.isHidden) {
        return 'isHidden';
      }
      return '!isHidden';
    },
    dateDisabled(): any {
      // let dateOfGame: any = this.dateOfGame;
      // return dateOfGame.length > 0;
    }
  },
  methods: {
    authenticate: function() {
      let _this = this;
      console.log(this.emailAddress + ' | ' + this.password);
      
      let user = firebase.auth().signInWithEmailAndPassword(this.emailAddress, this.password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);        
      });
    },
    manualRandomize: function() {
      this.newPlayerArray = this.randomize(this.playerList.split(','));

      if(this.teamOne.length >= 5 || this.teamTwo.length >= 5) {
        this.teamOne = [];
        this.teamTwo = [];
      }

      var i; var j = 0;
      for (i = 0; i < this.newPlayerArray.length; i++) {
        if (i < 5) {
          this.$set(this.teamOne, i, {name: this.newPlayerArray[i]});
          // this.teamOne.push({ name: this.newPlayerArray[i] });
        } else {
          this.$set(this.teamTwo, j, {name: this.newPlayerArray[i]});
          // this.teamTwo.push({ name: this.newPlayerArray[i] });
          j++;
        }
      }
      
      // alert(this.newPlayerArray);
      return this.newPlayerArray;
    },
    randomize: function (data: any): any {
      var currentIndex = data.length; var temporaryValue; var randomIndex;

      // While there remain elements to shuffle...
      while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = data[currentIndex];
        data[currentIndex] = data[randomIndex];
        data[randomIndex] = temporaryValue;
      }

      this.newPlayerArray = data;
      return data;
    },
    removeLast(): any {
      let players = this.playerList.split(',');

      players.splice(-1,1);
      
      this.playerList = players.join();
    },
    addUser: function () {
      if (this.isValid) {
        // usersRef.push(this.newUser)
        // this.newUser.name = ''
        // this.newUser.email = ''
      }
    },
    removeUser: function (user: any) {
      // usersRef.child(user['.key']).remove()
    },
    getCurrentGame: function() {
      let _this = this;
      this.db.collection('teams').get().then(function (querySnapshot: any) {
        querySnapshot.forEach(function (doc: any) {
          // console.log(doc.data());
          
          var dateOfGame = new Date(doc.data().dateOfGame);
          // console.log(dateOfGame);
          
          // let dateOfGame = _this.getNextWednesday();    
          var today = new Date();
          var gameExpired = today >= dateOfGame;

          _this.getNextWednesday();
          
          dateOfGame.setDate(dateOfGame.getDate() + 1);

          let d = new Date(doc.data().dateOfGame);

          var options = {'month': 'long', 'day': '2-digit', 'year': 'numeric'};
          // _this.dateOfGameText = d.toLocaleString('pt-PT', options);
    
          _this.teamOne = !gameExpired ? doc.data().equipaA : [];
          _this.teamTwo = !gameExpired ? doc.data().equipaB : [];
          _this.dateOfGameText = !gameExpired ? d.toLocaleString('pt-PT', options) : '';
          _this.playerList = !gameExpired ? doc.data().originalQueue : '';
          _this.randomQueue = !gameExpired ? doc.data().randomQueue : 'teste';
          _this.activeGame = !gameExpired;
          _this.hasPlayers = false;
        });
      });
    },
    saveTeam: function () {
      let dateOfGame = $('.js-datepicker').val();
      let timestamp = new Date().getTime().toString();
      
      // let newDateOfGame = dateOfGame.toString();

      // console.log(d.toUTCString());
      this.dateOfGame = this.getNextWednesday();
      // console.log(this.dateOfGame);

      this.db.collection('teams').doc(timestamp).set({
        dateOfSubmission: new Date(),
        dateOfGame: this.dateOfGame.toUTCString(),
        originalQueue: this.playerList,
        randomQueue: this.randomQueue,
        equipaA: this.teamOne,
        equipaB: this.teamTwo
      })
        .then(function () {
          console.log('Document successfully written!');
        })
        .catch(function (error: any) {
          console.error('Error writing document: ', error);
        });

        this.getCurrentGame();
    },
    isLoggedIn: function() {
      let _this = this;

      firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
          console.log('not logged in');
          _this.isLogged = false;
          return false;
        }
        _this.userEmail = user.email;
        _this.isLogged = true;
        return true;
      });
    },
    logOut: function() {
      firebase.auth().signOut();
      this.isHidden = false;
    },
    getNextWednesday: function() {
      let d = new Date();
      d.setDate(d.getDate() + (3 + 7 - d.getDay()) % 7);

      if(d.getDay() == 3 && d.getHours() > 19 && d.getMinutes() > 30){
      d.setDate(d.getDate() + (3 + 7 - d.getDay()));
      }

      // var options = {'month': 'long', 'day': '2-digit', 'year': 'numeric'};
      var options = {'month': 'long', 'day': '2-digit', 'year': 'numeric'};
      this.dateOfGame = d;
      // console.log(new Date('Wed, 11 Dec 2019 17:40:44 GMT'));
      
      
      // this.dateOfGameText = d.toLocaleString('pt-PT', options);

      // var options = {'weekday': 'long', 'month': 'long', 'day': '2-digit', 'year': 'numeric'};
      // var date = d.toLocaleString('pt-PT', options);
      // console.log(d);
      return d;
    }
  },
  mounted: function () {
    var timestamp = new Date().getTime().toString();
    timestamp = timestamp.toString();

    this.isLoggedIn();

    this.$nextTick(function () {
      $(document).ready(function () {
        // console.log(this);
        
        // $('.js-datepicker').datepicker();
      }); 
    });

    this.getCurrentGame();
  }
});

export default home;
