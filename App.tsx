import React,{useState,useEffect} from 'react';
import {SafeAreaView, Platform, AppRegistry, Alert} from 'react-native';
import MyStack from './screen/navContainer/MyStack';
import Signin from './screen/Signin';
import InputProfile from './screen/InputProfile';
import 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database'
import firebaseInit from './utils/firebaseInit';
import { NavigationContainer} from '@react-navigation/native';
import {profileUpdate} from "./utils/firebaseCall"
import PushNotification from "react-native-push-notification";
import messaging from '@react-native-firebase/messaging';
import {getEnabled,getLoginChecker,pushCustom} from './utils/localStorage'
import SplashScreen from 'react-native-splash-screen'

PushNotification.createChannel(
  {
    channelId: "channel-id", // (required)
    channelName: "My channel", // (required)
   
  },
  (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}


AppRegistry.registerComponent('app', () => App);


firebaseInit()

const App = () => {

  const [info, setInfo] = useState<any>({uid:"",name:'',phoneNumber:''})
  const [isLogin,setIsLogin] = useState<any>(false)
  const [hasName, setHasName] = useState<any>(true)

  const checkName = (result:any) => {
    database()
      .ref('users/' +result.uid+"/name")
      .on('value', snapshot=> {
        setHasName(snapshot.val())
      })
  }

  const checkIfLoggedIn = () => {
    auth().onAuthStateChanged(
      function(result) {
        result && (profileUpdate(result), checkName(result), setInfo({...info,uid:result.uid}),getToken(result.uid))
        setIsLogin(result)
        }
    )
  };

  const getToken = async (uid:any) => {
    const token = await messaging().getToken();
    database().ref('users/'+uid).update({token:token})
  };



  useEffect(() => {
    checkIfLoggedIn()
    requestUserPermission()
    getEnabled()
    getLoginChecker()
    pushCustom()
  },[])

  useEffect(()=>{
    setTimeout(()=>SplashScreen.hide(),1500)
  },[])


  return (
    <NavigationContainer>
      <SafeAreaView style={{flex:1}}>
        {isLogin? 
          hasName ? 
          <MyStack info={info}/> : <InputProfile info={info}/>
          : <Signin/>
        }
      </SafeAreaView>
    </NavigationContainer>
  );
};


export default App;
