
import React,{useState,useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, Button} from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firebaseInit from "../utils/firebaseInit";
import {firstSignIn} from "../utils/firebaseCall"

firebaseInit()

GoogleSignin.configure({
  webClientId: '594993990605-rull88i4fmre1b4ar120i815lo8fijom.apps.googleusercontent.com',
  iosClientId: '594993990605-e1p4k1e7bkir57i4fjtqio7ngt76pmvb.apps.googleusercontent.com'
});


const Signin = () => {

  async function onGoogleButtonPress() {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential
    auth().signInWithCredential(googleCredential).then((result)=>{
      if (result.additionalUserInfo?.isNewUser) {
        firstSignIn(result)
    }})
    
  }

  return (
    <SafeAreaView style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <Text>여기는 로그인 화면입니다.</Text>
      <Button title="google signin" onPress={()=>onGoogleButtonPress()}/>
    </SafeAreaView>
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

export default Signin;
