var app = new Vue({
  el: '#app',
  data: {
    playerList: '',
    teams: [
      { member: 'one,two,three,four,five' },
      { member: 'one,two,three,four,five' }
    ],
    teamOne: [],
    teamTwo: [],
    newPlayerArray: [],
    hasPlayers: false,
    noPlayers: true,
    originalQueue: '',
    randomQueue: '',
    dateOfGame: $('.js-datepicker').val(),
    currentTeams: {}
  },
  computed: {
    returnPlayerTeams: function () {
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

      this.randomQueue = this.newPlayerArray.join().slice(0, 5);

      var i; var j = 0;
      for (i = 0; i < this.newPlayerArray.length; i++) {
        if (i < 5) {
          // this.$set(this.teamOne[i], 'name', newPlayerArray[i]);
          this.teamOne.push({ name: this.newPlayerArray[i] });
        } else {
          // this.$set(this.teamTwo[j], 'name', this.newPlayerArray[i]);
          this.teamTwo.push({ name: this.newPlayerArray[i] });
          j++;
        }
      }

      return this.newPlayerArray.join();
    },
    playerListDisabled: function () {      
      return this.playerList.split(',').length > 10 || this.hasPlayers;
    },
    dateDisabled: function () {
      return this.dateOfGame.length > 0;
    }
  },
  methods: {
    randomize: function (array) {
      var currentIndex = array.length; var temporaryValue; var randomIndex;

      // While there remain elements to shuffle...
      while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    },
    saveTeam: function () {
      this.dateOfGame = $('.js-datepicker').val();
      var timestamp = new Date().getTime();

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
    var timestamp = new Date().getTime();
    timestamp = timestamp.toString();

    this.$nextTick(function () {
      $(document).ready(function () {
        $('.js-datepicker').datepicker({
          format: 'dd / mmm / yyyy'
        }
        );
      });

      db.collection('teams').get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          var dateOfGame = new Date(doc.data().dateOfGame);
          var today = new Date();

          dateOfGame.setDate(dateOfGame.getDate() + 1);

          if (today >= dateOfGame) {
            return;
          }

          _this.teamOne = doc.data().equipaA;
          _this.teamTwo = doc.data().equipaB;
          _this.dateOfGame = doc.data().dateOfGame;
          _this.playerList = doc.data().originalQueue;
          _this.randomQueue = doc.data().randomQueue;
          _this.hasPlayers = false;
        });
      });
    });
  }
});
