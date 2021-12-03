import { firebase } from '@react-native-firebase/database';

const firebaseInit = () => {
  const firebaseConfig ={
    apiKey: "AIzaSyAQseO_TI4ZYY5UAcj5pWQl_3bCnGMyvho",
    authDomain: "a-yo-2d62f.firebaseapp.com",
    databaseURL: "https://a-yo-2d62f-default-rtdb.firebaseio.com",
    projectId: "a-yo-2d62f",
    storageBucket: "a-yo-2d62f.appspot.com",
    messagingSenderId: "594993990605",
    appId: "1:594993990605:web:e259c51700e04ecd349284",
    measurementId: "G-7PKMXPQQMX"
  }
  
  if(firebase.apps.length==0){
    firebase.initializeApp(firebaseConfig);
  }
}

  export default firebaseInit;