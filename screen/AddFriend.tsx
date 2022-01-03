
import React,{useState,useEffect,useContext} from 'react';
import {
  Platform, 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  View, 
  Alert, 
  Dimensions, 
  TouchableNativeFeedback,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Share
} from 'react-native';
import database from '@react-native-firebase/database';
import Contacts from 'react-native-contacts';
import firebaseInit from '../utils/firebaseInit';
import {StackContext} from '../utils/StackContext';
import { AnimatedFlatList, AnimationType } from 'flatlist-intro-animations';
import { useHeaderHeight } from '@react-navigation/elements';
import {addRequestAndroid,addRequestIos} from "../utils/notification"
import {throwRequest, cancelRequest} from '../utils/firebaseCall'
import Icon from 'react-native-vector-icons/Ionicons';
import { useToast } from "react-native-toast-notifications";

firebaseInit()

const screenWidth= Dimensions.get('screen').width
const screenHeight= Dimensions.get('screen').height

const AddFriend = () => {

  const {userInfo,addList,getFriends,isRefreshing,setIsRefreshing,addFriendWithUidModalVisible,setAddFriendWithUidModalVisible} = useContext(StackContext)
  const [sendedReq,setSendedReq]=useState<any>({})
  const [uidText,setUidText] = useState('')
  const headerHeight = useHeaderHeight();

  const toast = useToast();
  

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
            //toast message
            toast.show("요청을 취소하였습니다", {
              type: "nomal",
              placement: "bottom",
              duration: 3000,
              animationType: "zoom-in",
            });
          }  
        }
      ]
    );
  }

  const canselAlertOnModal = (myUid:string,friendUid:string)=>{
    Alert.alert(
      "",
      "이미 요청을 보낸 유저입니다. 친구 요청을 취소할까요?",
      [
        {
          text: "아니요",
          onPress: () => {},
          style: "cancel"
        },
        { text: "예", onPress: () => {
            cancelRequest(myUid,friendUid)
            //toast message
            toast.show("요청을 취소하였습니다", {
              type: "nomal",
              placement: "bottom",
              duration: 3000,
              animationType: "zoom-in",
            });
          }  
        }
      ]
    );
  }

  const pressAction = (friendUid:string, osType:string, friendToken:string, withId?:boolean)=> {

    const addRequest = osType === 'android' ? addRequestAndroid : addRequestIos
    sendedReq ? (
      sendedReq[friendUid] ?
        (withId ? canselAlertOnModal(userInfo.uid,friendUid) : Alert.alert("이미 친구 요청을 보낸 유저입니다.") )
        :(
          addRequest(friendToken),
          throwRequest(userInfo.uid, friendUid, userInfo.myPhone, userInfo.name, userInfo.token, Platform.OS),
          //toast message
          toast.show("친구 요청 완료!", {
            type: "nomal",
            placement: "bottom",
            duration: 3000,
            animationType: "zoom-in",
          })
        )
      ) : (
          addRequest(friendToken),
          throwRequest(userInfo.uid, friendUid, userInfo.myPhone, userInfo.name, userInfo.token, Platform.OS),
          //toast message
          toast.show("친구 요청 완료!", {
            type: "nomal",
            placement: "bottom",
            duration: 3000,
            animationType: "zoom-in",
          })
    )
    
  }


  const rend_item =(item:any)=>{
    

    const pushItem = (
      <View style={{...styles.addStyle, overflow: Platform.OS === 'android' ? 'hidden' : 'visible', width:screenWidth*0.8, height:screenWidth*0.30, backgroundColor: (sendedReq && sendedReq[item.item.uid]) ? '#CE85F8' : '#FDEC94'}}>
          <Text style={{fontSize:20,fontWeight:'500', color:'black', lineHeight:25}}>{item.item.name}</Text>
          <Text style={{fontWeight:'500', color:'black'}}>{item.item.phone_number}</Text>
      </View> 
    )

    return (
      <View style={{justifyContent:'center',alignItems:'center',margin:screenWidth*0.03}} key={item.index}>       
        {Platform.OS === 'android' ?        
          <TouchableNativeFeedback onPress={()=>pressAction(item.item.uid,item.item.os,item.item.token)} onLongPress={()=>{sendedReq && sendedReq[item.item.uid] && canselAlert(userInfo.uid,item.item.uid)}}
            background={TouchableNativeFeedback.Ripple('#00000040', false)} useForeground={true}>
            {pushItem}
          </TouchableNativeFeedback> :
          
          <TouchableOpacity onPress={()=>pressAction(item.item.uid,item.item.os,item.item.token)} onLongPress={()=>{sendedReq && sendedReq[item.item.uid] && canselAlert(userInfo.uid,item.item.uid)}}>
            {pushItem}
          </TouchableOpacity>}
      </View>
    )
  }

  const listRefresh=()=>{
    setIsRefreshing(true)
    getFriends()
  }

  const onShare = async () => {
    try {
      await Share.share({
        message:
          `${userInfo.uid}`,
      });
    } catch (error:any) {
      Alert.alert(error.message);
    }
  };

  const requestWithId = () =>{
    database().ref('users/'+uidText).once('value',snapshot=>{
      
      snapshot.val() && snapshot.val().uid!==userInfo.uid ? (
        pressAction(snapshot.val().uid, snapshot.val().os, snapshot.val().token, true),
        setUidText("")
        ) : Alert.alert("잘못된 ID입니다.")
    })
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
        <Text style={{fontSize:16, fontWeight:'bold', textAlign:'center'}}>연락처와 연동하여 친구를 추천해드립니다</Text>
      </View>
     }

      <Modal visible={addFriendWithUidModalVisible} transparent={true}>
        <TouchableOpacity onPress={()=>{setAddFriendWithUidModalVisible(false)}} style={{justifyContent:'center', alignItems:'center', flex:1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <TouchableWithoutFeedback>
            <View style={{...styles.AddFriendModalStyle, width:screenWidth*0.8, height:300, overflow:'hidden'}}>

              <View style={{height:70, justifyContent:'center', backgroundColor:'#E9BCBE', borderBottomWidth:3}}>
                <Text style={{paddingLeft:15, fontSize:20, fontWeight:'bold', color:'black'}}>ID로 친구 추가하기</Text>
              </View>

              <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingLeft:15, paddingRight:30, paddingVertical:15}}>
                <Text style={{fontSize:16, fontWeight:'bold', color:'black'}}>내 ID 공유하기</Text>
                <TouchableOpacity onPress={()=>onShare()}>
                  <Icon name="share-social-outline" size={27} color="black" />
                </TouchableOpacity>
              </View>

              <View style={{alignItems:'center', marginTop:5}}>
                <View style={{borderBottomWidth:3, width:screenWidth*0.6}}/>
              </View>
              
              <View style={{height:155, justifyContent:'center', paddingLeft:15}}>
                <Text style={{paddingLeft:5, color:'black', fontWeight:'bold', fontSize:14}}>친구 ID</Text>
                <TextInput placeholder='28-lengh code' style={{marginBottom:5,textAlign:'center', borderWidth:3, borderRadius:10, width:screenWidth*0.7,height:40, fontSize:18}} value={uidText} onChangeText={text => setUidText(text)} />
                <TouchableOpacity onPress={()=>{requestWithId()}} style={{backgroundColor:'#ABDECB',justifyContent:'center',borderWidth:3, borderRadius:10, width:screenWidth*0.7,height:40}}>
                  <Text style={{textAlign:'center',fontSize:16,fontWeight:'bold'}}>Request</Text>
                </TouchableOpacity>
              </View>
            
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

     
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
  },
  AddFriendModalStyle:{
    borderRadius:15, 
    borderColor:'black', 
    borderWidth:3, 
    backgroundColor:'white', 
    // alignItems:'center',
    // justifyContent:'center'
  },
  modalTextStyle:{
    paddingLeft:8, 
    fontSize:14, 
    color:'black', 
    fontWeight:'bold',
    marginBottom:5
  }
});

export default AddFriend;
