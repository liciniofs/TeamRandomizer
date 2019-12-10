import * as firebase from "firebase";
import $ from "jquery";
import Vue, { VNode } from "vue";

const auth = Vue.extend({
  // el: '#app',
  data() {
    return {
      emailAddress: '',
      emailRE: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      password: '',
      userDisplayName: '',
      userEmail: '',
      userEmailVerified: false,
      userPhotoURL: '',
      userIsAnonymous: false,
      userUid: '',
      userProviderData: [],
      currentUser: []
    };
  },
  computed: {
    showDetails(): any {
      // let _this = this;
      let user = firebase.auth().currentUser;

      var auth = firebase.auth();
      console.log(auth);
      console.log(user);

      if (user) {
        
      } else {
        // No user is signed in.
      }
      // firebase.auth().onAuthStateChanged(function(user) {
      //   if (user) {
      //     // User is signed in.
      //     _this.userDisplayName = user.displayName ? user.displayName : '';
      //     _this.userEmail = user.email ? user.email : '';
      //     _this.userEmailVerified = user.emailVerified ? user.emailVerified : false;
      //     _this.userPhotoURL = user.photoURL ? user.photoURL : '';
      //     _this.userIsAnonymous = user.isAnonymous ? user.isAnonymous : false;
      //     _this.userUid = user.uid ? user.uid : '';
      //     // _this.userProviderData = user.providerData ? user.providerData : [];
      //     // ...
      //   } else {
      //     // User is signed out.
      //     // ...
      //   }
      // });
    },
  },
  methods: {
    authenticate: function() {
      let _this = this;
      // console.log(this.emailAddress + ' | ' + this.password);
      
      firebase.auth().signInWithEmailAndPassword(this.emailAddress, this.password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);        
      });

      let auth = firebase.auth();
      if(typeof auth.currentUser === null) {
        return;
      }

      if(auth.currentUser.email === null) {
        return;
      }
      
      _this.userEmail = auth.currentUser.email ? auth.currentUser.email : 'Não está autenticado.';
      // console.log(auth.currentUser);
      
      // this.currentUser = auth.currentUser;
    }
  },
  mounted: function() {
    // Runs on boot
  }
});

export default auth;
