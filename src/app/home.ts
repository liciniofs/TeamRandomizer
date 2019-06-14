import * as firebase from 'firebase';
import $ from "jquery";
import Vue, { VNode } from 'vue';

const home = Vue.extend({
  // el: '#app',
  data() {
    return {
      emailRE: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      playerList: '',
      teams: [
        { member: 'one,two,three,four,five' },
        { member: 'one,two,three,four,five' }
      ],
      db: firebase.firestore(),
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
      dateOfGame: (typeof $('.js-datepicker').val() !== 'undefined') ? $('.js-datepicker').val() : '',
      currentTeams: {}
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
      var players = this.playerList.split(',');

      if (players.length < 10) {
        this.noPlayers = true;
        return 'Não há jogadores suficientes!';
      }

      if (this.randomQueue.length > 0) {
        this.noPlayers = false;
        this.hasPlayers = true;

        return this.randomQueue;
      }

      this.noPlayers = false;
      this.hasPlayers = true;

      this.newPlayerArray = this.randomize(players);

      this.randomQueue = this.newPlayerArray.join();

      var i; var j = 0;
      for (i = 0; i < this.newPlayerArray.length; i++) {
        if (i < 5) {
          this.$set(this.teamOne[i], 'name', this.newPlayerArray[i]);
          // this.teamOne.push({ name: this.newPlayerArray[i] });
        } else {
          this.$set(this.teamTwo[j], 'name', this.newPlayerArray[i]);
          // this.teamTwo.push({ name: this.newPlayerArray[i] });
          j++;
        }
      }

      return this.newPlayerArray.join();
    },
    playerListDisabled(): any {
      return this.playerList.split(',').length > 10 || this.hasPlayers;
    },
    dateDisabled(): any {
      let dateOfGame: any = this.dateOfGame;
      return dateOfGame.length > 0;
    }
  },
  methods: {
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
    saveTeam: function () {
      this.dateOfGame = $('.js-datepicker').val();
      let timestamp = new Date().getTime().toString();

      this.db.collection('teams').doc(timestamp).set({
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
        .catch(function (error: any) {
          console.error('Error writing document: ', error);
        });
    }
  },
  mounted: function () {
    var _this = this;
    var timestamp = new Date().getTime().toString();
    timestamp = timestamp.toString();

    this.$nextTick(function () {
      $(document).ready(function () {
        // $('.js-datepicker').datepicker({
        //   format: 'dd / mmm / yyyy'
        // });
      });

      this.db.collection('teams').get().then(function (querySnapshot: any) {
        querySnapshot.forEach(function (doc: any) {
          var dateOfGame = new Date(doc.data().dateOfGame);
          var today = new Date();
          var gameExpired = today >= dateOfGame;

          dateOfGame.setDate(dateOfGame.getDate() + 1);

          // console.log(today);
          // console.log(dateOfGame);
          // console.log(today >= dateOfGame);

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

export default home;
