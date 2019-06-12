import * as firebase from 'firebase';
import $ from "jquery";
import Vue from 'vue';
import Component from 'vue-class-component';

// @Component({})
export default class home extends Vue {

  // Setup Firebase
  config = {
    apiKey: "AIzaSyB2Eh1p19ZRq4n7lkv-9O6PIA0GSwYBR70",
    authDomain: "urbanfut5teams.firebaseapp.com",
    databaseURL: "https://urbanfut5teams.firebaseio.com",
    projectId: "urbanfut5teams",
  };

  VueApp: any = Vue;

  dateOfGame: any;

  constructor(message: string) {
    super();
    // let dateOfGame: string;
    this.dateOfGame = $('.js-datepicker').val();
    firebase.initializeApp(home.config);
  }

  db = firebase.firestore();
  usersRef = firebase.database().ref('users')
  app = new Vue({
      el: '#app',
      data: {
        emailRE: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        playerList: '',
        teams: [
          { member: 'one,two,three,four,five' },
          { member: 'one,two,three,four,five' }
        ],
        teamOne: [],
        teamTwo: [],
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
        dateOfGame: this.dateOfGame.length ? this.dateOfGame : '',
        currentTeams: {}
      },
      // computed: {
      //   validation(): any {
      //     return {
      //       name: !!this.newUser.name.trim(),
      //       email: this.emailRE.test(this.newUser.email)
      //     }
      //   },
      //   isValid(): any {
      //     // var validation = this.validation;
      //     return Object.keys(validation).every(function (key) {
      //       return validation[key]
      //     })
      //   },
      //   returnPlayerTeams: function () {
      //     var players = this.playerList.split(',');

      //     if (players.length < 10) {
      //       this.noPlayers = true;
      //       return 'Não há jogadores suficientes!';
      //     }

      //     if (this.randomQueue.length > 0) {
      //       this.noPlayers = false;
      //       this.hasPlayers = true;

      //       return this.randomQueue;
      //     }

      //     this.noPlayers = false;
      //     this.hasPlayers = true;

      //     // this.newPlayerArray = this.randomize(players);

      //     this.randomQueue = this.newPlayerArray.join();

      //     console.log(this.randomQueue);

      //     var i; var j = 0;
      //     for (i = 0; i < this.newPlayerArray.length; i++) {
      //       if (i < 5) {
      //         // this.$set(this.teamOne[i], 'name', newPlayerArray[i]);
      //         // this.teamOne.push({ name: this.newPlayerArray[i] });
      //       } else {
      //         // this.$set(this.teamTwo[j], 'name', this.newPlayerArray[i]);
      //         // this.teamTwo.push({ name: this.newPlayerArray[i] });
      //         j++;
      //       }
      //     }

      //     return this.newPlayerArray.join();
      //   },
      //   playerListDisabled: function () {
      //     return this.playerList.split(',').length > 10 || this.hasPlayers;
      //   },
      //   dateDisabled: function () {
      //     return this.dateOfGame.length > 0;
      //   }
      // },
      methods: {
        randomize: function (data:any): any {
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
          // return data;
        },
        addUser: function () {
          if (this.isValid) {
            usersRef.push(this.newUser)
            this.newUser.name = ''
            this.newUser.email = ''
          }
        },
        removeUser: function (user:any) {
          usersRef.child(user['.key']).remove()
        },
        saveTeam: function () {
          this.dateOfGame = $('.js-datepicker').val();
          var timestamp = new Date().getTime() + '';

          timestamp = timestamp.toString();

          db.collection('teams').doc(timestamp).set({
            dateOfSubmission: new Date(),
            dateOfGame: this.dateOfGame,
            originalQueue: this.playerList,
            randomQueue: this.randomQueue,
            equipaA: this.teamOne,
            equipaB: this.teamTwo
          })
            .then(function () {
              console.log('Document successfully written!');
            })
            .catch(function (error) {
              console.error('Error writing document: ', error);
            });
        }
      },
      mounted: function () {
        var _this = this;
        var timestamp = new Date().getTime().toString();
        // timestamp = timestamp.toString();

        this.$nextTick(function () {
          // $(document).ready(function () {
          //   $('.js-datepicker').datepicker({
          //     format: 'dd / mmm / yyyy'
          //   });
          // });

          db.collection('teams').get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              var dateOfGame = new Date(doc.data().dateOfGame);
              var today = new Date();
              var gameExpired = today >= dateOfGame;

              // dateOfGame.setDate(dateOfGame.getDate() + 1);

              console.log(today);
              console.log(dateOfGame);
              console.log(today >= dateOfGame);

              _this.teamOne = !gameExpired ? doc.data().equipaA : [];
              _this.teamTwo = !gameExpired ? doc.data().equipaB : [];
              _this.dateOfGame = !gameExpired ? doc.data().dateOfGame : '';
              _this.playerList = !gameExpired ? doc.data().originalQueue : '';
              _this.randomQueue = !gameExpired ? doc.data().randomQueue : '';
              _this.hasPlayers = false;

              console.log(_this.randomQueue);
            });
          });
        });
      }
    });
}

