import * as firebase from 'firebase';
// import { auth } from './auth/auth';
import Home from './app/home';

let config = {
  apiKey: "AIzaSyB2Eh1p19ZRq4n7lkv-9O6PIA0GSwYBR70",
  authDomain: "urbanfut5teams.firebaseapp.com",
  databaseURL: "https://urbanfut5teams.firebaseio.com",
  projectId: "urbanfut5teams",
};

firebase.initializeApp(config);

new Home().$mount('#app')