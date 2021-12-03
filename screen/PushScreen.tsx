
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React,{useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
  TouchableNativeFeedback
} from 'react-native';

const screenWidth= Dimensions.get('screen').width
const screenHeight= Dimensions.get('screen').height


const PushScreen = () => {

  const pushList = ["배달","술","밥","카페","공부","드라이브"]

  const rend_item =(item:string,index:number)=>{

    const pushItem = (
      <View style={{...styles.pushStyle, overflow: Platform.OS === 'android' ? 'hidden' : 'visible', width:screenWidth*0.40, height:screenWidth*0.40}}>
          <Text>{item}</Text>
      </View> 
    )

    return (
      <View style={{justifyContent:'center',alignItems:'center',margin:screenWidth*0.03}} key={index}>       
        {Platform.OS === 'android' ?        
          <TouchableNativeFeedback onPress={()=>Alert.alert(item)} onLongPress={()=>{Alert.alert("삭제하시겠습니까")}}
            background={TouchableNativeFeedback.Ripple('#00000040', false)} useForeground={true}>
            {pushItem}
          </TouchableNativeFeedback> 
          :
          <TouchableOpacity onPress={()=>Alert.alert(item)} onLongPress={()=>{Alert.alert("삭제하시겠습니까")}}>
            {pushItem}
          </TouchableOpacity>}
      </View>
    )
  }

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
      <View style={{height:screenHeight*0.1, backgroundColor:'gray', justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontWeight:'bold',fontSize:24,color:'white'}}>To. David</Text>
      </View>
      <View style={{flex:1, marginTop:15, padding:screenWidth*0.02, flexWrap:'wrap', flexDirection:'row', alignItems:'center',justifyContent:'center'}}>
          {pushList.map((item,index)=>(
            rend_item(item,index)
          ))}
        </View>
        
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pushStyle: {
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 25, 
    marginBottom:15,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  }
});

export default PushScreen;
