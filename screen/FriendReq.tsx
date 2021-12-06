
import React,{useState,useEffect,useContext} from 'react';
import {Platform, SafeAreaView, StyleSheet, Text, View, Alert, Dimensions, TouchableNativeFeedback,TouchableOpacity} from 'react-native';
import database from '@react-native-firebase/database';
import firebaseInit from '../utils/firebaseInit';
import {StackContext} from '../utils/StackContext';
import { AnimatedFlatList, AnimationType } from 'flatlist-intro-animations';
import { useHeaderHeight } from '@react-navigation/elements';
import {sayYes,sayNo} from '../utils/firebaseCall'
firebaseInit()

const screenWidth= Dimensions.get('screen').width
const screenHeight= Dimensions.get('screen').height


const FriendReq = () => {


  const {userInfo,requestList,setRequestList} = useContext(StackContext)
  const headerHeight = useHeaderHeight();


  const refreshList =(index:any)=>{
    var tempArr = requestList.slice()
    tempArr.splice(index,1)
    setRequestList(tempArr)
  }

  const rend_item =(item:any)=>{

    const pushItem =(text:string)=> {
      return (Platform.OS === 'android' ?
      
        <TouchableNativeFeedback onPress={()=>{refreshList(item.index), text==='수락'?sayYes(userInfo.uid,item.item.uid,userInfo.myPhone,item.item.phone_number):sayNo(userInfo.uid,item.item.uid)}}
          background={TouchableNativeFeedback.Ripple('#00000040', false)} useForeground={true}>
          <View style={{...styles.addStyle, overflow: 'hidden', width:screenWidth*0.15, height:50}}>
              <View>
                <Text>{text}</Text>
              </View>
          </View>
        </TouchableNativeFeedback> :
      
        (<TouchableOpacity onPress={()=>{refreshList(item.index), text==='수락'?sayYes(userInfo.uid,item.item.uid,userInfo.myPhone,item.item.phone_number):sayNo(userInfo.uid,item.item.uid)}}>
        <View style={{...styles.addStyle, overflow: 'visible', width:screenWidth*0.15, height:50,marginLeft:10}}>
              <View>
                <Text>{text}</Text>
              </View>
          </View>
        </TouchableOpacity>)
      )
    }

    return (
      <View style={{justifyContent:'center',alignItems:'center',margin:screenWidth*0.03}}> 
        <View style={{...styles.addStyle,width:screenWidth*0.9,height:80,flexDirection:'row',marginBottom:15,justifyContent:'space-between',padding:15}}>
          <View style={{flexDirection:'row'}}>
            <Text>{item.item.name}   </Text>
            <Text>{item.item.phone_number}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            {pushItem("수락")}
            {pushItem("거절")}
          </View>
        </View>
      </View>
    )
  }


  return (
    <SafeAreaView style={{flex:1}}>
     
     {requestList.length!==0 ?  

      <AnimatedFlatList
        data={requestList}
        renderItem={rend_item}
        animationType={AnimationType.SlideFromBottom}
        animationDuration={1000}
        keyExtractor={(index:any) => index}
        contentContainerStyle={{minHeight:screenHeight-(headerHeight*3)}}
      />
      : 
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <Text>친구 신청이 없어영</Text>
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

export default FriendReq;
