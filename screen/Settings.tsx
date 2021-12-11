
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React,{useState,useContext, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  TextInput,
  Dimensions,
  Switch
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { editNumber } from '../utils/firebaseCall';
import { StackContext } from '../utils/StackContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setEnabled,removeValue} from '../utils/localStorage'


const screenWidth=Dimensions.get('screen').width

const Settings = () => {

  const [phoneNum,setPhoneNum]=useState<any>("")
  const {userInfo} = useContext(StackContext)
  const [isEnabled,setIsEnabled] = useState(true)
  
  
  const getSettingEnabled = async () => {
    try {
      const value = await AsyncStorage.getItem('isEnabledNotification')
      if(value == null) {
        setEnabled("true")
        setIsEnabled(true)
      }else{
        setIsEnabled(JSON.parse(value))
      }
    } catch(e) {
      console.log(e)
    }
  }

  useEffect(()=>{
    getSettingEnabled()
  },[])

  return (
    <SafeAreaView style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <Text>설정 페이지.</Text>
      <Text>전화번호 번경</Text>
      <TextInput style={{borderWidth:1,width:screenWidth*0.7, height:50, textAlign:'center'}} onChangeText={text=>setPhoneNum(text)} value={phoneNum} placeholder="010-0000-0000" keyboardType="numeric"/>
      {/* <Button title="확인" onPress={()=>editNumber(phoneNum,userInfo.uid)}/> */}
      <View style={{height:200, justifyContent:'center'}}>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={()=>{setIsEnabled(!isEnabled), setEnabled(JSON.stringify(!isEnabled))}}
          value={isEnabled}
        />
      </View>
      <Button title="log out" onPress={()=>{
        removeValue("loginChecker")
        auth().signOut()}}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

})

export default Settings;
