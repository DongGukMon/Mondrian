
import React,{useState,useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, Button, ImageBackground,View, Dimensions,TextInput, Alert,Image,TouchableOpacity } from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firebaseInit from "../utils/firebaseInit";
import { profileCreate } from '../utils/firebaseCall';

firebaseInit()

GoogleSignin.configure({
  webClientId: '594993990605-rull88i4fmre1b4ar120i815lo8fijom.apps.googleusercontent.com',
  iosClientId: '594993990605-e1p4k1e7bkir57i4fjtqio7ngt76pmvb.apps.googleusercontent.com'
});

const w = Dimensions.get('screen').width
const h = Dimensions.get('screen').height

const Signin = () => {

  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState<any>(null);
  const [code, setCode] = useState('');
  const [verifyingNumber,setVerifyingNumber] = useState('')



  // async function onGoogleButtonPress() {
  //   // Get the users ID token
  //   const { idToken } = await GoogleSignin.signIn();
  
  //   // Create a Google credential with the token
  //   const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  //   // Sign-in the user with the credential
  //   auth().signInWithCredential(googleCredential).then((result)=>{
  //     if (result.additionalUserInfo?.isNewUser) {
  //       firstSignIn(result)
  //   }})
    
  // }



  // Handle the button press
  
  async function signInWithPhoneNumber(phoneNumber:string) {
    const confirmation:any = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code).then((result:any)=>{
        result.additionalUserInfo.isNewUser && (profileCreate(result))
      });
    } catch (error) {
      Alert.alert("잘못된 코드입니다. 다시 입력해주세요.")
      console.log('Invalid code.');
    }
  }
  
//#FDEC94,#ABDECB,#E9BCBE
  return (
    <SafeAreaView style={{flex:1,borderWidth:2 }}>
      <ImageBackground style={{flex:1,justifyContent:'center', alignItems:'center'}} source={require('../assets/background/background4.png')}>  
        <View style={{...styles.container, width:w*0.9,height:h*0.6}}>
          <View style={{height:h*0.09, justifyContent:'center', borderBottomWidth:3, backgroundColor:'#ABDECB'}}>
            <Text style={{fontSize:40, marginLeft:15,color:'black', fontWeight:'bold'}}>Mondrian</Text>
          </View>
          <View style={{height:h*0.05}}>
          <TouchableOpacity style={{width:w*0.05,height:w*0.05, marginLeft:8, top:13}} disabled={confirm ? false:true} onPress={()=>setConfirm(null)}>
              {confirm && <Image style={{width:'100%',height:'100%'}} source={require('../assets/icons/left-arrow.png')}/>}
            </TouchableOpacity>
          </View>  
          <View style={{height:h*0.15,justifyContent:'center',alignContent:'center'}}>
            <View style={{height:h*0.03}}/>
            <Text style={{fontSize:32, textAlign:'center',color:'black', fontWeight:'bold'}}>Throw Messages</Text>
            <Text style={{fontSize:28, textAlign:'center',color:'black', fontWeight:'bold'}}>*-Like a-*</Text>
            <Text style={{fontSize:32, textAlign:'center',color:'black', fontWeight:'bold'}}>Straight Line</Text>
          </View>
          {confirm ?
          <View style={{height:h*0.33, alignItems:'center',justifyContent:'center'}}>
          <View style={{height:h*0.045}}/>
          <View style={{height:h*0.085,width:w*0.8, justifyContent:'space-between'}}>
            
            <Text style={{fontSize:18,color:'black', fontWeight:'bold',marginLeft:5,marginBottom:5}}>Verify Code from SMS</Text>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <TextInput placeholder='6-digit Code' style={{textAlign:'center', borderWidth:3, borderRadius:10, width:w*0.8,height:45, backgroundColor:'#FDEC94', fontSize:18}} value={code} onChangeText={text => setCode(text)} />
            </View>
          </View>
          <View style={{height:h*0.03}}/>
          <View style={{ justifyContent:'center', alignItems:'center'}}>
            <TouchableOpacity style={{width:w*0.8,height:45,borderRadius:10 ,borderWidth:3, justifyContent:'center', backgroundColor:'#E9BCBE'}} onPress={() => confirmCode()}>
              <Text style={{fontSize:18, textAlign:'center',color:'black', fontWeight:'bold'}}>Confirm Code</Text>
            </TouchableOpacity>  
           </View> 
           <View style={{height:h*0.045}}/>
        </View>
        
          :
          <View style={{height:h*0.33, alignItems:'center',justifyContent:'center'}}>
            <View style={{height:h*0.045}}/>
            <View style={{height:h*0.085,width:w*0.8, justifyContent:'space-between'}}>
            
              <Text style={{fontSize:18,color:'black', fontWeight:'bold', marginLeft:5,marginBottom:5}}>Phone Number</Text>
              <View style={{flexDirection:'row', justifyContent:'center'}}>
                <View style={{justifyContent:'center', borderWidth:3, borderRadius:10, marginRight:5, width:w*0.18, height:45, backgroundColor:'#FDEC94'}}>
                  <Text style={{textAlign:'center', color:'black', fontWeight:'bold', fontSize:18}}>010</Text>
                </View>
                <TextInput placeholder='0000-0000' style={{textAlign:'center', borderWidth:3, borderRadius:10, width:w*0.6,height:45, backgroundColor:'#FDEC94', fontSize:18}} value={verifyingNumber} onChangeText={text => setVerifyingNumber(text)} />
              </View>
            </View>
            <View style={{height:h*0.03}}/>
            <View style={{ justifyContent:'center', alignItems:'center'}}>
              <TouchableOpacity style={{width:w*0.8,height:45,borderRadius:10 ,borderWidth:3, justifyContent:'center', backgroundColor:'#E9BCBE'}} onPress={() => signInWithPhoneNumber('+82 10-'+[verifyingNumber.slice(0,5),'-',verifyingNumber.slice(5)].join(''))}>
                <Text style={{fontSize:18, textAlign:'center',color:'black', fontWeight:'bold'}}>Sign in With Phone Number</Text>
              </TouchableOpacity>  
             </View>
             <View style={{height:h*0.045}}/> 
          </View>
          }
        </View>
      
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{
    backgroundColor:'rgba(255,255,255,0.95)',
    borderWidth:3,
    borderRadius:30,
    overflow:'hidden'

  }
});

export default Signin;
