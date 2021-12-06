
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React,{useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  Button
} from 'react-native';
import { setNumber } from '../utils/firebaseCall';

const screenWidth=Dimensions.get('screen').width

interface Iprops{
  info:any
}

const InputNumber = (props:Iprops) => {

  const [phoneNum,setPhoneNum] =useState("")

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#EBECF0', justifyContent:'center', alignItems:'center'}}>
      <Text>전화번호 입력.</Text>
      <TextInput style={{...styles.numberInput,width:screenWidth*0.7, height:35, textAlign:'center'}} onChangeText={text=>setPhoneNum(text)} value={phoneNum} placeholder="0000-0000" keyboardType="numeric"/>
      <Button title="확인" onPress={()=>setNumber(phoneNum,props.info.uid,props.info.name)}/>
      <Text>{phoneNum}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  numberInput: {
      borderWidth: 1,
      borderRadius: 2,
      borderColor: '#ddd',
      borderBottomWidth: 0,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2
      },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 1,
      marginLeft: 5,
      marginRight: 5,
      marginTop: 10,

  },
  pushStyle: {
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 25, 
    marginBottom:15,
    backgroundColor: '#DDDDDD',
    shadowColor: "#000",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  }

  
});

export default InputNumber;
