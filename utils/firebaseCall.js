import React,{useContext} from 'react';

import database, { FirebaseDatabaseTypes } from '@react-native-firebase/database';
import firebaseInit from './firebaseInit';
// import {UserInfoContext} from './UserInfoContext';

firebaseInit()

// const [userInfo, setUserInfo] = useContext(UserInfoContext);


export async function sayYes(myUid,friendUid, myPhone, friendPhone) {
  database()
    .ref('friend_list/'+friendUid)
    .update({
      [myUid]:myPhone
    });
  database()
    .ref('friend_list/'+myUid)
    .update({
      [friendUid]:friendPhone
    });

  database().ref('request_list/send/'+myUid+'/'+friendUid).remove()
  database().ref('request_list/send/'+friendUid+'/'+myUid).remove()

  database().ref('request_list/receive/'+myUid+'/'+friendUid).remove()
  database().ref('request_list/receive/'+friendUid+'/'+myUid).remove()
}

export async function sayNo(myUid,friendUid){
  database().ref('request_list/send/'+myUid+'/'+friendUid).remove()
  database().ref('request_list/send/'+friendUid+'/'+myUid).remove()

  database().ref('request_list/receive/'+myUid+'/'+friendUid).remove()
  database().ref('request_list/receive/'+friendUid+'/'+myUid).remove()
}

export async function deleteFriend(myUid,friendUid){
  database().ref('friend_list/'+myUid+'/'+friendUid).remove()
  database().ref('friend_list/'+friendUid+'/'+myUid).remove()
}

export async function throwRequest(myUid,friendUid, myPhone,myName) {
  database()
    .ref('request_list/receive/'+friendUid)
    .update({
      [myUid]:{
        phone_number:myPhone,
        uid:myUid,
        name:myName
      }
    });

  database()
  .ref('request_list/send/'+myUid)
  .update({
    [friendUid]:'uid'
  });
}

export async function setNumber(num, uid, name) {
  database()
    .ref('add_friend_data/'+uid)
    .update({
      phone_number:num,
      uid:uid,
      name:name
    });

  database()
    .ref('users/' + uid)
    .update({phone_number:num});

}

export async function editNumber(num, uid) {
  database()
    .ref('add_friend_data/'+uid)
    .update({
      phone_number:num,
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