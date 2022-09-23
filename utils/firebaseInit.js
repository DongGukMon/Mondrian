import {firebase} from '@react-native-firebase/database';
import {
  API_KEY,
  AUTH_DOMATIN,
  DATABASE_URL,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,
} from '../constants';

const firebaseInit = () => {
  const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMATIN,
    databaseURL: DATABASE_URL,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID,
  };

  if (firebase.apps.length == 0) {
    firebase.initializeApp(firebaseConfig);
  }
};

export default firebaseInit;
