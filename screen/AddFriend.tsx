
import React,{useState,useEffect,useContext} from 'react';
import {Platform, SafeAreaView, StyleSheet, Text, View, Alert, Dimensions, TouchableNativeFeedback,TouchableOpacity,ImageBackground} from 'react-native';
import database from '@react-native-firebase/database';
import Contacts from 'react-native-contacts';
import firebaseInit from '../utils/firebaseInit';
import {StackContext} from '../utils/StackContext';
import { AnimatedFlatList, AnimationType } from 'flatlist-intro-animations';
import { useHeaderHeight } from '@react-navigation/elements';
import {addRequestAndroid,addRequestIos} from "../utils/notification"
import {throwRequest, cancelRequest} from '../utils/firebaseCall'


firebaseInit()

const screenWidth= Dimensions.get('screen').width
const screenHeight= Dimensions.get('screen').height

const AddFriend = () => {

  const {userInfo,addList,getFriends,isRefreshing,setIsRefreshing} = useContext(StackContext)
  const [sendedReq,setSendedReq]=useState<any>({})
  const headerHeight = useHeaderHeight();
  

  const canselAlert = (myUid:string,friendUid:string)=>{
    Alert.alert(
      "",
      "요청을 취소 하시겠습니까?",
      [
        {
          text: "아니요",
          onPress: () => {},
          style: "cancel"
        },
        { text: "예", onPress: () => {
            cancelRequest(myUid,friendUid)
          }  
        }
      ]
    );
  }

  const rend_item =(item:any)=>{
    const addRequest = item.item.os === 'android' ? addRequestAndroid : addRequestIos

    const pushItem = (
      <View style={{...styles.addStyle, overflow: Platform.OS === 'android' ? 'hidden' : 'visible', width:screenWidth*0.8, height:screenWidth*0.30, backgroundColor: (sendedReq && sendedReq[item.item.uid]) ? '#CE85F8' : '#FDEC94'}}>
          <Text style={{fontSize:20,fontWeight:'500', color:'black', lineHeight:25}}>{item.item.name}</Text>
          <Text style={{fontWeight:'500', color:'black'}}>{item.item.phone_number}</Text>
      </View> 
    )

    const pressAction = ()=> {
      sendedReq ? (
        sendedReq[item.item.uid] ?
          Alert.alert("이미 친구 요청 했습니다.") 
          :(
            addRequest(item.item.token),
            throwRequest(userInfo.uid, item.item.uid, userInfo.myPhone, userInfo.name, userInfo.token, Platform.OS)
          )
        ) : (
            addRequest(item.item.token),
            throwRequest(userInfo.uid, item.item.uid, userInfo.myPhone, userInfo.name, userInfo.token, Platform.OS)
      )
      
    }

    return (
      <View style={{justifyContent:'center',alignItems:'center',margin:screenWidth*0.03}} key={item.index}>       
        {Platform.OS === 'android' ?        
          <TouchableNativeFeedback onPress={()=>pressAction()} onLongPress={()=>{sendedReq && sendedReq[item.item.uid] && canselAlert(userInfo.uid,item.item.uid)}}
            background={TouchableNativeFeedback.Ripple('#00000040', false)} useForeground={true}>
            {pushItem}
          </TouchableNativeFeedback> :
          
          <TouchableOpacity onPress={()=>pressAction()} onLongPress={()=>{sendedReq && sendedReq[item.item.uid] && canselAlert(userInfo.uid,item.item.uid)}}>
            {pushItem}
          </TouchableOpacity>}
      </View>
    )
  }

  const listRefresh=()=>{
    setIsRefreshing(true)
    getFriends()
  }


  useEffect(()=>{
    database().ref('request_list/send/'+userInfo.uid).on('value',snapshot=>{
      for(var member in sendedReq){delete sendedReq[member]}
      setSendedReq({...sendedReq})
      snapshot.val() && setSendedReq(snapshot.val())
    })

    return ()=>{
      database().ref('request_list/send/'+userInfo.uid).off()
    }
  },[])

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
      
      <ImageBackground style={{flex:1}} source={Object.keys(addList).length!==0 ? require('../assets/background/background5.png') : require('../assets/background/background4.png')}>
     {Object.keys(addList).length!==0 ?  

      <AnimatedFlatList
        data={Object.values<any>(addList)}
        renderItem={rend_item}
        animationType={AnimationType.SlideFromBottom}
        animationDuration={1000}
        contentContainerStyle={{minHeight:screenHeight-(headerHeight*3)}}
        refreshing={isRefreshing}
        onRefresh={listRefresh}
      />
      : 
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <Text style={{fontSize:16, fontWeight:'bold', textAlign:'center'}}>친구들한테 추천좀 해주세요</Text>
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
    borderWidth:3
  }
});

export default AddFriend;
