import { createStackNavigator } from '@react-navigation/stack';
import Friends from '../Friends';
import PushScreen from '../PushScreen';
import AddFriend from '../AddFriend';
import Settings from '../Settings';
import FriendReq from '../FriendReq';
import React,{useState,useEffect} from 'react';
import {View,TouchableOpacity,PermissionsAndroid,Platform,Alert,Dimensions} from 'react-native'
import {StackContext} from '../../utils/StackContext'
import Icon from 'react-native-vector-icons/Ionicons';
import database from '@react-native-firebase/database';
import Contacts from 'react-native-contacts';

import PushNotification from "react-native-push-notification";
import { useNavigation } from '@react-navigation/core';
import messaging from '@react-native-firebase/messaging';
import { getEnabled, getLoginChecker } from '../../utils/localStorage';

const screenHeight= Dimensions.get('screen').height

const Stack = createStackNavigator();

interface Iprops{
  info:any
}

messaging().setBackgroundMessageHandler(async (remoteMessage:any) => {
  var isEnabled = await getEnabled()
  var loginChecker = await getLoginChecker()
  if((isEnabled=="true")&&(loginChecker=="true")){
    PushNotification.localNotification({channelId:"channel-id",title:remoteMessage.data?.title,message:remoteMessage.data?.body,largeIconUrl:remoteMessage.data.imageUrl, picture:remoteMessage.data.imageUrl, data:remoteMessage.data})
  }
});


export default function MyStack(props:Iprops) {

  const [userInfo, setUserInfo] = useState<any>({uid:props.info.uid,myPhone:"",name:props.info.name})
  const [friendList,setFriendList] = useState<any>({})
  const [myContacts,setMyContacts] = useState<any>({})
  const [addList,setAddList] = useState<any>({})
  const [requestList,setRequestList] = useState<any>([])
  const [selectedFriend,setSelectedFriend] = useState<any>({}) 
  const navigation = useNavigation()
  
  const navigationAlert = (screenName:any)=>{
    Alert.alert(
      "",
      "새로운 친구요청이 왔습니다. 친구 요청 화면으로 이동하겠습니까?",
      [
        {
          text: "아니요",
          onPress: () => {},
          style: "cancel"
        },
        { text: "좋아요", onPress: () => {
          navigation.navigate(screenName)
          }  
        }
      ]
    );
  }

  const getFriends = () => {
    Contacts.getAll()
      .then((contacts) => {
        contacts.map((item)=>{
          item.phoneNumbers[0]&&(myContacts[item.phoneNumbers[0]['number'].replace(/\-/g,'')]={phone_number:item.phoneNumbers[0]['number'].replace(/\-/g,'')})
        })

        database().ref('friend_list/'+props.info.uid).on('value',friendData=>{
          database().ref('add_friend_data').once('value',addData=>{

            for(var member in friendList){delete friendList[member]}
            setFriendList({...friendList})
            for(var member in addList){delete addList[member]}
            
            //연락처와 유저풀 비교해서 친구 추가 가능 목록 생성
            Object.values(addData.val()).map((item:any)=>{
              myContacts[item.phone_number] && (addList[item.uid]={...item})
            })

            friendData.val() && (
              Object.keys(friendData.val()).map((item:any)=>{
                
                //이미 친구 등록된 사람이 있으면 친구 추가 가능목록에서 삭제
                addList[item] && delete addList[item]

                //필요한 친구 데이터(이름,전화번호 등)를 DB에서 가져와 friendList에 셋팅 
                addData.val()[item] && (friendList[addData.val()[item].uid]=addData.val()[item])
                setFriendList({...friendList})
              })
            )
            //친구추가 가능 목록 setState
            setAddList(addList)
          })
        })
      })
      .catch((e) => {
        console.log(e);
      });

      //구독 취소. 이거 맞나?
      return database().ref('friend_list/'+props.info.uid).off()
  };

  const getRequest = () => {
    database().ref('request_list/receive/'+props.info.uid).on('value',snapshot=>{
      setRequestList([])
      snapshot.val() && setRequestList(Object.values(snapshot.val()))
    })
  };

  useEffect(()=>{
    if (Platform.OS === 'android') {

      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          'title': 'Contacts',
          'message': 'This app would like to view your contacts.',
          'buttonPositive': 'Please accept bare mortal'
        }
      )
    }
    getRequest()

    database().ref('users/'+props.info.uid+"/phone_number").once('value',snapshot=>{
      setUserInfo({...userInfo,myPhone:snapshot.val()})
    })

    PushNotification.popInitialNotification((notification) => {
      notification?.data.type && navigation.navigate(notification?.data.type)
    });
    
    const unsubscribe = messaging().onMessage(async (remoteMessage:any) => {
      
      var isEnabled = await getEnabled()
      var loginChecker = await getLoginChecker()
      if((isEnabled=="true")&&(loginChecker=="true")){
        PushNotification.localNotification({channelId:"channel-id",title:remoteMessage.data?.title,message:remoteMessage.data?.body,largeIconUrl:remoteMessage.data.imageUrl,picture:remoteMessage.data.imageUrl,data:remoteMessage.data})
        if(remoteMessage.data.type=="FriendReq"){
          navigationAlert(remoteMessage.data.type)
        }
      }
    });

    return unsubscribe;
    
  },[])


  return (
    <StackContext.Provider value={{getFriends,myContacts,setMyContacts,addList,setAddList,userInfo,setUserInfo,requestList,setRequestList,friendList,setFriendList,selectedFriend,setSelectedFriend}}>
      <Stack.Navigator>
        <Stack.Screen name="Friends" component={Friends} options={({navigation})=>({headerTitleAlign: 'left',headerTitleStyle:{fontSize:20, fontWeight:'bold'}, headerStyle:{backgroundColor:'#E9BCBE', height:screenHeight*0.1, borderBottomWidth:2, borderBottomColor:'black'} , headerRight: ()=>{
          return <View style={{flexDirection:'row', justifyContent:'space-between', width:130, padding:10, backgroundColor:'white', borderRadius:20, marginRight:10}}>
            <TouchableOpacity onPress={()=>{navigation.navigate('AddFriend')}}>
              <Icon name="person-add-outline" size={27} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={{}} onPress={()=>{navigation.navigate('FriendReq')}}>
              <Icon name="heart-outline" size={27} color="black" />
              {(requestList[0]!==undefined) && <View style={{width:9,height:9,borderRadius:10,backgroundColor:'red', position:'absolute',right:-0.5,top:1,borderColor:'white',borderWidth:1}}/>}
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('Settings')}}>
              <Icon name="settings-outline" size={27} color="black" />
            </TouchableOpacity>
          </View>
          }
        })}
        />
        <Stack.Screen name="PushScreen" component={PushScreen} options={{headerTintColor:'black',headerBackTitleVisible:false, title:selectedFriend ? "To. "+selectedFriend.name : "", headerTitleAlign: 'center', headerTitleStyle:{fontSize:20, fontWeight:'bold'}, headerStyle:{backgroundColor:'#E9BCBE', height:screenHeight*0.1, borderBottomWidth:2, borderBottomColor:'black'}}}/>
        <Stack.Screen name="AddFriend" component={AddFriend} options={{headerTintColor:'black', headerBackTitleVisible:false, title:'Add Friends',headerTitleAlign: 'center',headerTitleStyle:{fontSize:20, fontWeight:'bold'}, headerStyle:{backgroundColor:'#ABDECB', height:screenHeight*0.1, borderBottomWidth:2, borderBottomColor:'black'}}}/>
        <Stack.Screen name="Settings" component={Settings} options={{headerTintColor:'black', headerBackTitleVisible:false, title:"Settings",headerTitleAlign: 'center',headerTitleStyle:{fontSize:20, fontWeight:'bold'}, headerStyle:{ height:screenHeight*0.1, borderBottomWidth:2, borderBottomColor:'black'} ,}}/>
        <Stack.Screen name="FriendReq" component={FriendReq} options={{headerTintColor:'black', headerBackTitleVisible:false, title:"Request List",headerTitleAlign: 'center',headerTitleStyle:{fontSize:20, fontWeight:'bold'}, headerStyle:{backgroundColor:'#FDEC94', height:screenHeight*0.1, borderBottomWidth:2, borderBottomColor:'black'} ,}}/>
      </Stack.Navigator>
    </StackContext.Provider>
  );
}