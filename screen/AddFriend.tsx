
import React,{useState,useEffect,useContext} from 'react';
import {Platform, SafeAreaView, StyleSheet, Text, View, Alert, Dimensions, TouchableNativeFeedback,TouchableOpacity} from 'react-native';
import database from '@react-native-firebase/database';
import Contacts from 'react-native-contacts';
import firebaseInit from '../utils/firebaseInit';
import {StackContext} from '../utils/StackContext';
import { AnimatedFlatList, AnimationType } from 'flatlist-intro-animations';
import { useHeaderHeight } from '@react-navigation/elements';
import {addRequest} from "../utils/notification"
import {throwRequest} from '../utils/firebaseCall'
firebaseInit()

const screenWidth= Dimensions.get('screen').width
const screenHeight= Dimensions.get('screen').height

const AddFriend = () => {

  const {userInfo,addList} = useContext(StackContext)
  const headerHeight = useHeaderHeight();
  

  const rend_item =(item:any)=>{

    const pushItem = (
      <View style={{...styles.addStyle, overflow: Platform.OS === 'android' ? 'hidden' : 'visible', width:screenWidth*0.8, height:screenWidth*0.30}}>
          <Text>{item.item.name}</Text>
          <Text>{item.item.phone_number}</Text>
          {/* {console.log(item)} */}
      </View> 
    )

    return (
      <View style={{justifyContent:'center',alignItems:'center',margin:screenWidth*0.03}} key={item.index}>       
        {Platform.OS === 'android' ?        
          <TouchableNativeFeedback onPress={()=>{addRequest(item.item.token),throwRequest(userInfo.uid,item.item.uid,userInfo.myPhone,userInfo.name)}} onLongPress={()=>{Alert.alert("삭제하시겠습니까")}}
            background={TouchableNativeFeedback.Ripple('#00000040', false)} useForeground={true}>
            {pushItem}
          </TouchableNativeFeedback> :
          
          <TouchableOpacity onPress={()=>{addRequest(item.item.token),throwRequest(userInfo.uid,item.item.uid,userInfo.myPhone,userInfo.name)}} onLongPress={()=>{Alert.alert("삭제하시겠습니까")}}>
            {pushItem}
          </TouchableOpacity>}
      </View>
    )
  }


  return (
    <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
     
     {Object.keys(addList).length!==0 ?  

      <AnimatedFlatList
        data={Object.values<any>(addList)}
        renderItem={rend_item}
        animationType={AnimationType.SlideFromBottom}
        animationDuration={1000}
        contentContainerStyle={{minHeight:screenHeight-(headerHeight*3)}}
      />
      : 
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <Text>친구들한테 추천좀 해줘요</Text>
      </View>
     }
     </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  addStyle: {
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

export default AddFriend;
