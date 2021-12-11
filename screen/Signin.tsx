
import React,{useState,useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, Button, ImageBackground,View, Dimensions} from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firebaseInit from "../utils/firebaseInit";
import {firstSignIn} from "../utils/firebaseCall"

firebaseInit()

GoogleSignin.configure({
  webClientId: '594993990605-rull88i4fmre1b4ar120i815lo8fijom.apps.googleusercontent.com',
  iosClientId: '594993990605-e1p4k1e7bkir57i4fjtqio7ngt76pmvb.apps.googleusercontent.com'
});

const w = Dimensions.get('screen').width

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



  const mondrianRender=()=>{
    const baduk = []
    var arr = [6,7,8,16,23,45,51,55,57,63,66,86,97]
    for(var i:number = 0; i<100; i++){
      baduk.push(
        <View style={{width:w*0.1414,height:w*0.1414, borderWidth:(arr.includes(i)) ?0:1, backgroundColor:(arr.includes(i)&&'pink'),justifyContent:'center'}}>
          <Text style={{textAlign:'center'}}>
            {i}
          </Text>
        </View>)
    }
    
    return baduk
  }

  return (
    <SafeAreaView style={{flex:1,borderWidth:2 }}>
      <ImageBackground style={{flex:1,justifyContent:'center', alignItems:'center'}} source={require('../assets/background/background4.png')}>  
      <Text>여기는 로그인 화면입니다.</Text>
      <Button title="google signin" onPress={()=>onGoogleButtonPress()}/>
      </ImageBackground>
    </SafeAreaView>
    // <SafeAreaView style={{flex:1,borderWidth:2, flexDirection:'row', flexWrap:'wrap' }}>
    //   {mondrianRender()}
    // </SafeAreaView>
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
