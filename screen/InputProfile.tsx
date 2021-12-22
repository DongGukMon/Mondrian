
import React,{useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Alert
} from 'react-native';
import { setName } from '../utils/firebaseCall';

const w = Dimensions.get('screen').width
const h = Dimensions.get('screen').height

interface Iprops{
  info:any
}

const InputProfile = (props:Iprops) => {

  const [myName,setMyName] =useState("")

  return (
    <SafeAreaView style={{flex:1,borderWidth:2 }}>
      <ImageBackground style={{flex:1,justifyContent:'center', alignItems:'center'}} source={require('../assets/background/background4.png')}>  
        <View style={{...styles.container, width:w*0.9,height:h*0.6}}>
          <View style={{height:h*0.09, justifyContent:'center', borderBottomWidth:3, backgroundColor:'#ABDECB'}}>
            <Text style={{fontSize:40, marginLeft:15,color:'black', fontWeight:'bold'}}>Mondrian</Text>
          </View>
          <View style={{height:h*0.05}}/>  
          <View style={{height:h*0.15,justifyContent:'center',alignContent:'center'}}>  
            <Text style={{fontSize:32, textAlign:'center',color:'black', fontWeight:'bold'}}>Throw Messages</Text>
            <Text style={{fontSize:28, textAlign:'center',color:'black', fontWeight:'bold'}}>*-Like a-*</Text>
            <Text style={{fontSize:32, textAlign:'center',color:'black', fontWeight:'bold'}}>Straight Line</Text>
          </View>
          <View style={{height:h*0.33, alignItems:'center', justifyContent:'center'}}>
            {/* <View style={{height:h*0.045}}/> */}
            <View style={{height:h*0.085,width:w*0.8, justifyContent:'space-between'}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={{fontSize:18,color:'black', fontWeight:'bold', marginLeft:5}}>Your Name</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'center'}}>
              <TextInput placeholder="Tony Stark" style={{textAlign:'center', borderWidth:3, borderRadius:10, width:w*0.8,height:45, backgroundColor:'#FDEC94', fontSize:18}} maxLength={13} value={myName} onChangeText={text => setMyName(text)} />
            </View>
          </View>
          <View style={{height:h*0.03}}/>
            <View style={{ justifyContent:'center', alignItems:'center'}}>
            <TouchableOpacity style={{width:w*0.8,height:45,borderRadius:10 ,borderWidth:3, justifyContent:'center', backgroundColor:'#E9BCBE'}} onPress={() => {myName!=='' ? setName(myName,props.info.uid) : Alert.alert("이름은 필수입력 사항입니다.")}}>
              <Text style={{fontSize:18, textAlign:'center',color:'black', fontWeight:'bold'}}>Enroll</Text>
            </TouchableOpacity>  
           </View> 
        </View>
          
        </View>
      
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
      borderWidth: 1,
      borderRadius: 2,
      borderColor: '#ddd',
      borderBottomWidth: 0,
      // shadowColor: '#000',
      // shadowOffset: {
      //    width: 0,
      //    height: 2
      // },
      // shadowOpacity: 0.8,
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
  },
  container:{
    backgroundColor:'rgba(255,255,255,0.95)',
    borderWidth:3,
    borderRadius:30,
    overflow:'hidden'

  }

  
});

export default InputProfile;
