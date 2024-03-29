
import React,{useState,useEffect,useContext} from 'react';
import {Platform, SafeAreaView, StyleSheet, Text, View, Alert, Dimensions, TouchableNativeFeedback,TouchableOpacity,ImageBackground} from 'react-native';
import database from '@react-native-firebase/database';
import firebaseInit from '../utils/firebaseInit';
import {StackContext} from '../utils/StackContext';
import { AnimatedFlatList, AnimationType } from 'flatlist-intro-animations';
import { useHeaderHeight } from '@react-navigation/elements';
import {sayYes,sayNo} from '../utils/firebaseCall'
import {acceptRequestAndroid,acceptRequestIos} from '../utils/notification'
firebaseInit()

const screenWidth= Dimensions.get('screen').width
const screenHeight= Dimensions.get('screen').height


const FriendReq = () => {


  const {userInfo,requestList} = useContext(StackContext)
  

  const headerHeight = useHeaderHeight();

  const rend_item =(item:any)=>{

    const pushItem =(text:string)=> {

      //받는 친구의 ios와 android 구분해서 fcm payload 변경
      const acceptRequest = item.item.os === 'android' ? acceptRequestAndroid : acceptRequestIos
      console.log(item.item.os)

      return (Platform.OS === 'android' ?
      
        <TouchableNativeFeedback onPress={()=>{
          text==='수락' ? (sayYes(userInfo.uid,item.item.uid,userInfo.myPhone,item.item.phone_number), acceptRequest(item.item.token,userInfo.name)) : sayNo(userInfo.uid,item.item.uid)
        }}
          
          background={TouchableNativeFeedback.Ripple('#00000040', false)} useForeground={true}>
          <View style={{...styles.buttonStyle, overflow: 'hidden', width:screenWidth*0.16, height:50, marginLeft:text==="수락" ? 0 : 10}}>
              <Text style={styles.itemTextStyle}>{text}</Text>
          </View>
        </TouchableNativeFeedback> 
        :
        (<TouchableOpacity onPress={()=>{text==='수락'? (sayYes(userInfo.uid,item.item.uid,userInfo.myPhone,item.item.phone_number),acceptRequest(item.item.token,userInfo.name)):sayNo(userInfo.uid,item.item.uid)}}>
        <View style={{...styles.buttonStyle, overflow: 'visible', width:screenWidth*0.16, height:50, marginLeft:text==="수락" ? 0 : 10}}>
                <Text style={styles.itemTextStyle}>{text}</Text>
          </View>
        </TouchableOpacity>)
      )
    }

    return (
      <View style={{justifyContent:'center',alignItems:'center',margin:screenWidth*0.03}}> 
        <View style={{...styles.addStyle,width:screenWidth*0.9,height:100,flexDirection:'row',marginBottom:15,justifyContent:'space-between',padding:15}}>
          <View style={{flex:6, flexWrap:'nowrap'}}>
            <Text style={{...styles.itemTextStyle,fontSize:18}}>{item.item.name} </Text>
            <Text style={styles.itemTextStyle}>{item.item.phone_number}</Text>
          </View>
          <View style={{flex:4.2, flexDirection:'row'}}>
            {pushItem("수락")}
            {pushItem("거절")}
          </View>
        </View>
      </View>
    )
  }


  return (
    
    <SafeAreaView style={{flex:1}}>
     <ImageBackground style={{flex:1}} source={requestList.length!==0 ? require('../assets/background/background5.png') : require('../assets/background/background4.png')}>
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
        <Text style={{fontSize:16, fontWeight:'bold', textAlign:'center'}}>받은 요청이 없습니다.</Text>
      </View>
      }
      </ImageBackground>
     </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  addStyle: {
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 25, 
    backgroundColor: '#E9BCBE',
    borderWidth:3
  },
  buttonStyle: {
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 25, 
    backgroundColor: 'white',
    borderWidth:2
  },
  itemTextStyle:{
    color:'black',
    fontWeight:'500',
    lineHeight: 25
  }
});

export default FriendReq;
