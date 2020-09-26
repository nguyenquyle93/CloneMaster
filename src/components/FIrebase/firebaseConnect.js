import * as firebase from 'firebase/app';
import { functions } from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyANJCeO-UmWhgYXnpY2PpynG4ctS8Uhw7Q",
  authDomain: "casi-d6696.firebaseapp.com",
  databaseURL: "https://casi-d6696.firebaseio.com",
  projectId: "casi-d6696",
  storageBucket: "casi-d6696.appspot.com",
  messagingSenderId: "898945885065",
  appId: "1:898945885065:web:91c55e46e7b864ae01f758"
};
  // Initialize Firebase


  export const firebaseConnect = firebase.initializeApp(firebaseConfig);
  var data = firebase.database().ref('homeData');
  // sữa dử liệu nè
  // data.set({
  //     id:3,
  //     title: " ngày hôm nay",
  //     content: " hahaha cái quần quề",
  // })

  export const connectData = firebase.database().ref('pages1');
  export const connectData2 = firebase.database().ref('pages2');
  export const connectData3 = firebase.database().ref('pages3');
  export const connectData4 = firebase.database().ref('pages4');
  export const connectData5 = firebase.database().ref('pages5');
  export const connectData6 = firebase.database().ref('pages6');
  export const connectData7 = firebase.database().ref('pages7');
  export const newPost = firebase.database().ref('newPost');