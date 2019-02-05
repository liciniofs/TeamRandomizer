var app = new Vue({
  el  : '#app',
  data: {
    playerList: '',
    teams     : [
      { member: 'one,two,three,four,five' },
      { member: 'one,two,three,four,five' }
    ],
    teamOne       : [],
    teamTwo       : [],
    newPlayerArray: [{}],
    hasPlayers    : false,
    noPlayers     : true,
    currentTeams: {}
  },
  computed: {
    returnPlayerTeams: function () {
      var players = this.playerList.split(',');

      if (players.length < 10) {
        this.noPlayers = true;
        return 'Not enough players!';
      }
      
      this.noPlayers  = false;
      this.hasPlayers = true;

      this.teamOne = [];
      this.teamTwo = [];

	  var newPlayerArray = this.randomize(players);

      var i; var j = 0;
      for (i = 0; i < newPlayerArray.length; i++) {
        if (i < 5) {
          // this.$set(this.teamOne[i], 'name', newPlayerArray[i]);
          this.teamOne.push({name: newPlayerArray[i]});
        } else {
          // this.$set(this.teamTwo[j], 'name', newPlayerArray[i]);
          this.teamTwo.push({name: newPlayerArray[i]});
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
        randomIndex   = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex]  = array[randomIndex];
        array[randomIndex]   = temporaryValue;
      }

      return array;
    },
    saveTeam: function () {
      var data = { equipa_a: this.teamone, equipa_b: this.teamTwo, data: new Date() };

      var timestamp = new Date().getTime();

      timestamp = timestamp.toString();

      db.collection('teams').doc(timestamp).set({
          data    : new Date(),
          equipa_a: this.teamOne,
          equipa_b: this.teamTwo
        })
          .then(function () {
            console.log('Document successfully written!');
          })
          .catch(function (error) {
            console.error('Error writing document: ', error);
          });
    },
  },
  mounted: function() {
    this.$nextTick(function () {
      var _this = this;
      var timestamp = new Date().getTime();
      timestamp = timestamp.toString();

      // var teamsRef = db.collection("teams").doc("1549323694542");
      // var teamsRef = db.collection("teams");
                // [START order_and_limit]
      // teamsRef.orderBy("data").limit(2);

      // console.log(teamsRef);
      
      
      db.collection("teams").get().then(function(querySnapshot) {
      //   docRef.get().then(function(doc) {
      //     console.log(doc.data().equipa_a);
          
        querySnapshot.forEach(function(doc) {
          _this.teamOne = doc.data().equipa_a;
          _this.teamTwo = doc.data().equipa_b;
        });
      }); 
    })
  }
});
