import React,{useContext} from 'react';

import database from '@react-native-firebase/database';
import firebaseInit from './firebaseInit';
// import {UserInfoContext} from './UserInfoContext';

firebaseInit()

// const [userInfo, setUserInfo] = useContext(UserInfoContext);


export async function setNumber(num, uid) {
  database()
    .ref('user_phone_numbers/'+uid)
    .update({
      phone_number:num,
      uid:uid
    });

  database()
    .ref('users/' + uid)
    .update({phone_number:num});

}

export async function firstSignIn(result) {
  database()
    .ref('users/' + result.user.uid)
    .set({
      uid: result.user.uid,
      gmail: result.user.email,
      profile_picture: result.additionalUserInfo.profile.picture,
      name: result.additionalUserInfo.profile.given_name,
      created_at: Date.now(),
      last_logged_in: Date.now(),
      phone_number: ""
    });

}

export async function alreadySignUp(result) {
  database()
    .ref('users/' + result.uid)
    .update({
      last_logged_in: Date.now(),
      profile_picture:result.photoURL
    });
}