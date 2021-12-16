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

export async function throwRequest(myUid,friendUid,myPhone,myName,token) {
  database()
    .ref('request_list/receive/'+friendUid)
    .update({
      [myUid]:{
        phone_number:myPhone,
        uid:myUid,
        name:myName,
        token:token
      }
    });

  database()
  .ref('request_list/send/'+myUid)
  .update({
    [friendUid]:'uid'
  });
}

export async function cancelRequest(myUid,friendUid) {
  database()
    .ref('request_list/receive/'+friendUid+"/"+myUid)
    .remove()
  
  database()
    .ref('request_list/send/'+myUid+"/"+friendUid)
    .remove()
  }    

export async function setName(name, uid) {
  database()
    .ref('users/'+uid)
    .update({
      name:name
    });
}

export async function profileUpdate(result) {
  database()
    .ref('users/' + result.uid)
    .update({
      last_logged_in: result.metadata.lastSignInTime,
    });
}

export async function profileCreate(result) {
  database()
    .ref('users/' + result.user.uid)
    .update({
      created_at:result.user.metadata.creationTime,
      uid:result.user.uid,
      phone_number:"010"+(result.user.phoneNumber).substring(5,13)
    });
}

export async function deleteAccount(uid) {
  database()
    .ref('users/' + uid)
    .remove()

  database()
    .ref('friend_list/' + uid)
    .remove()

    database()
    .ref('request_list/send/' + uid)
    .once('value',(snapshot)=>{
    
      Object.keys(snapshot.val()).map((item)=>{
        database().ref('request_list/send/' + item + '/' + uid).remove()
        database().ref('request_list/receive/' + item + '/' + uid).remove()
        console.log(item)
      })

      database()
        .ref('request_list/receive/' + uid)
        .remove()
    
      database()
        .ref('request_list/send/' + uid)
        .remove()
    })
}