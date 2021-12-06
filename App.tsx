import React,{useState,useEffect} from 'react';
import {SafeAreaView, StyleSheet, Alert, Platform, AppRegistry} from 'react-native';
import MyStack from './screen/navContainer/MyStack';
import Signin from './screen/Signin';
import InputNumber from './screen/InputNumber';
import 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database'
import firebaseInit from './utils/firebaseInit';
import { NavigationContainer } from '@react-navigation/native';
import {alreadySignUp} from "./utils/firebaseCall"

import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import messaging from '@react-native-firebase/messaging';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

PushNotification.createChannel(
  {
    channelId: "channel-id", // (required)
    channelName: "My channel", // (required)
   
  },
  (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

messaging().setBackgroundMessageHandler(async (remoteMessage:any) => {
  Platform.OS === 'ios' ? PushNotificationIOS.presentLocalNotification({alertTitle:remoteMessage.notification?.title,alertBody:remoteMessage.notification?.body,picture:remoteMessage.data.imageUrl,isSilent:false}) :
  PushNotification.localNotification({channelId:"channel-id",title:remoteMessage.notification?.title,message:remoteMessage.notification?.body,largeIconUrl:remoteMessage.data.imageUrl})
});

AppRegistry.registerComponent('app', () => App);


firebaseInit()

const App = () => {

  const [info, setInfo] = useState<any>({uid:"",name:""})
  const [isLogin,setIsLogin] = useState<any>(false)
  const [hasNumber, setHasNumber] = useState<any>(true)

  const checkNumber = (result:any) => {
    database()
      .ref('users/' +result.uid+"/phone_number")
      .on('value', snapshot=> {
        setHasNumber(snapshot.val())
      })
  }

  const checkIfLoggedIn = () => {
    auth().onAuthStateChanged(
      function(result) {
        result && (alreadySignUp(result), checkNumber(result), setInfo({uid:result.uid,name:result.displayName}),getToken(result.uid))
        setIsLogin(result)
        }
    )
  };

  const getToken = async (uid:any) => {
    
    const token = await messaging().getToken();
    // const oldToken = await messaging().getToken();
    // await messaging().deleteToken();
    // const newToken = await messaging().getToken();
    // if (oldToken === newToken) {
    //     console.error('Token has not been refreshed');
  // } 
    database().ref('add_friend_data/'+uid).update({token:token})

  };



  useEffect(() => {
    checkIfLoggedIn()
    requestUserPermission()
  },[])

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage:any) => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      Platform.OS === 'ios' ? PushNotification.localNotification({title:remoteMessage.notification?.title,message:remoteMessage.notification?.body,picture:remoteMessage.data.imageUrl}) :
      PushNotification.localNotification({channelId:"channel-id",title:remoteMessage.notification?.title,message:remoteMessage.notification?.body,largeIconUrl:remoteMessage.data.imageUrl})
    });

    return unsubscribe;
  }, []);


  return (
    <NavigationContainer>
      <SafeAreaView style={{flex:1}}>
        {isLogin? 
          hasNumber ? 
          <MyStack info={info}/> : <InputNumber info={info}/>
          : <Signin/>
        }
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
});

export default App;
