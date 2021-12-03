import React,{useState,useEffect} from 'react';
import {SafeAreaView, StyleSheet, Alert} from 'react-native';
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
  const authorizationStatus = await messaging().requestPermission();

  if (authorizationStatus) {
    console.log('Permission status:', authorizationStatus);
  }
}

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({onRegister: function (token:any) {
  // console.log("TOKEN:", token);
   
    // fetch('https://fcm.googleapis.com/fcm/send', {
    //   method: 'POST',
    //   headers: {
    //     "Accept": 'application/json',
    //     'Content-Type': 'application/json',
    //     "Authorization": 'key='+`AAAAiohny80:APA91bH_71VhDRhTbJaI40rGhCyxejmUrpIw5FKB2-Om66_q_OojMzgLkuVTuse-9bGWHELcqloWIJd6dblE1knxieMlTF2JrScSqLotOPWVurK64UBoX5jfGS1Az2-ybNOojInNlBQc`,
    //   },
    //   body: JSON.stringify({
    //     "to": 
    //     // "ehVKtxSIaEGKgyZiGh8ZGG:APA91bHj3gGhNbubaIBAZeP9PjXesiQrWA1fwaW82YVrKiT1shwRM_nHnh8sLHBLEBvn0BKMNls-bRuenajjV5m1aVk8NojwekATE5PYOOb33kjAUJ9z5Ez1wySBicjq78-Go3DalBJV", 
    //     "dIVEa_2_TZihOxDgLQhYoo:APA91bHWYqypO1Gw20xGqgtcBWpbYzLup5-AlE82dGvsyYa-Y8DJxV3Z-4GTu_6OpPwRXpmBCEp4jj_HqR_8Zxo1loLMSG_deupYy6AmB6lFtThpAPUaz44JXCLWnY-I-_eJbN_lCzMV",
    
    //     "notification": {
    //       "title": "test",
    //       "body": "New Story available."
    //     },
    //     "priority":"high"
    //   })
    //   }).then(res=>console.log(res))

},   onRegistrationError: function(err) {
  console.error(err.message, err);
},

})
  


firebaseInit()

const App = () => {

  const [userId, setUserId] = useState("")
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
        result && alreadySignUp(result)
        result && checkNumber(result)
        result && setUserId(result.uid)
        setIsLogin(result)
        }
    )
  };

  const getToken = async () => {
    
    const oldToken = await messaging().getToken();
    await messaging().deleteToken();
    const newToken = await messaging().getToken();
    if (oldToken === newToken) {
       console.log('not refresh')
    } else {
      console.log(newToken)
      return newToken;
    }
  };


  useEffect(() => {
    checkIfLoggedIn()
    getToken()

  },[])

  return (
    <NavigationContainer>
      <SafeAreaView style={{flex:1}}>
        {isLogin? 
          hasNumber ? 
          <MyStack userId={userId}/> : <InputNumber userId={userId}/>
          : <Signin/>
        }
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
