import firebase from 'firebase'


// Initialize Firebase
var config = {
    apiKey: "AIzaSyCcHLFA3fGHpA2-qWejBQ3uEXveEgXftqo",
    authDomain: "app-todo-67927.firebaseapp.com",
    databaseURL: "https://app-todo-67927.firebaseio.com",
    projectId: "app-todo-67927",
    storageBucket: "app-todo-67927.appspot.com",
    messagingSenderId: "116195583395"
};
firebase.initializeApp(config);

export const database = firebase.database();