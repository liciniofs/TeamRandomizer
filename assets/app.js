var app = new Vue({
  el: '#app',
  data: {
    playerList: '',
    teams: [
      { member: 'one,two,three,four,five' },
      { member: 'one,two,three,four,five' }
    ],
    teamOne: [
      { name: 'one' },
      { name: 'two' },
      { name: 'three' },
      { name: 'four' },
      { name: 'five' }
    ],
    teamTwo: [
      { name: 'one' },
      { name: 'two' },
      { name: 'three' },
      { name: 'four' },
      { name: 'five' }
    ],
    newPlayerArray: [{}],
    hasPlayers: false,
    noPlayers: true
  },
  computed: {
    returnPlayerTeams: function () {
      var players = this.playerList.split(',');

      if (players.length < 10) {
		  return 'Not enough players!';
      }

      this.noPlayers = false;
	  this.hasPlayers = true;

	  var newPlayerArray = this.randomize(players);

      var i; var j = 0;
      for (i = 0; i < newPlayerArray.length; i++) {
        if (i < 5) {
          this.$set(this.teamOne[i], 'name', newPlayerArray[i]);
        } else {
          this.$set(this.teamTwo[j], 'name', newPlayerArray[i]);
          j++;
        }
      }

      return newPlayerArray.join();
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
	  var data = { equipa_a: this.teamone, equipa_b: this.teamTwo, data: new Date() };

	  var timestamp = new Date().getTime();

	  timestamp = '_' + timestamp;

	  db.collection('teams').doc(timestamp).set({
        data: new Date(),
        equipa_a: this.teamOne,
        equipa_b: this.teamTwo
      })
        .then(function () {
          console.log('Document successfully written!');
        })
        .catch(function (error) {
          console.error('Error writing document: ', error);
        });

    //   $.post('https://urbanfut5teams.firebaseio.com/.json',
    //     JSON.stringify(data),
    //     function () {
      // 	  alert('success');
    //     });
    }
  }
});
