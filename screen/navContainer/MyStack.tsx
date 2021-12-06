import { createStackNavigator } from '@react-navigation/stack';
import Friends from '../Friends';
import PushScreen from '../PushScreen';
import AddFriend from '../AddFriend';
import Settings from '../Settings';
import FriendReq from '../FriendReq';
import React,{useContext, useState,useEffect} from 'react';
import {Text,View,TouchableOpacity,PermissionsAndroid,Platform} from 'react-native'
import {StackContext} from '../../utils/StackContext'
import Icon from 'react-native-vector-icons/Ionicons';
import database from '@react-native-firebase/database';
import Contacts from 'react-native-contacts';

const Stack = createStackNavigator();

interface Iprops{
  info:any
}

// export type RootStackParamList = {
//   Friends: undefined;
//   PushScreen: undefined;
//   navigation:any;
//   };


export default function MyStack(props:Iprops) {

  const [userInfo, setUserInfo] = useState<any>({uid:props.info.uid,myPhone:"",name:props.info.name})
  const [friendList,setFriendList] = useState<any>({})
  const [myContacts,setMyContacts] = useState<any>({})
  const [addList,setAddList] = useState<any>({})
  const [requestList,setRequestList] = useState<any>([])
  const [selectedFriend,setSelectedFriend] = useState<any>({}) 


  const getFriends = () => {
    Contacts.getAll()
      .then((contacts) => {
        contacts.map((item)=>{
          item.phoneNumbers[0]&&(myContacts[item.phoneNumbers[0]['number'].replace(/\-/g,'')]={phone_number:item.phoneNumbers[0]['number'].replace(/\-/g,'')})
        })

        database().ref('friend_list/'+props.info.uid).once('value',friendData=>{
          database().ref('add_friend_data').once('value',addData=>{
            
            //연락처와 유저풀 비교해서 친구 추가 가능 목록 생성
            Object.values(addData.val()).map((item:any)=>{
              myContacts[item.phone_number] && (addList[item.uid]={...item})
            })
            
            friendData.val() && (
              Object.keys(friendData.val()).map((item:any)=>{
                
                //이미 친구 등록된 사람이 있으면 친구 추가 가능목록에서 삭제
                addList[item] && delete addList[item]

                //필요한 친구 데이터(이름,전화번호 등)를 DB에서 가져와 friendList에 셋팅 
                addData.val()[item] && (friendList[addData.val()[item].uid]=(addData.val()[item]))
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
  };

  const getRequest = () => {
    database().ref('request_list/'+props.info.uid).on('value',snapshot=>{
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
    getFriends()
    getRequest()
    database().ref('users/'+props.info.uid+"/phone_number").once('value',snapshot=>{
      setUserInfo({...userInfo,myPhone:snapshot.val()})
    })
  },[])


  return (
    <StackContext.Provider value={{myContacts,setMyContacts,addList,setAddList,userInfo,setUserInfo,requestList,setRequestList,friendList,setFriendList,selectedFriend,setSelectedFriend}}>
      <Stack.Navigator>
        <Stack.Screen name="Friends" component={Friends} options={({navigation})=>({headerTitleAlign: 'left', headerRight: ()=>{
          return <View style={{flexDirection:'row', justifyContent:'space-between', width:120, padding:10}}>
            <TouchableOpacity onPress={()=>{navigation.navigate('AddFriend')}}>
              <Icon name="person-add-outline" size={25} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('FriendReq')}}>
              <Icon name="heart-outline" size={25} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('Settings')}}>
              <Icon name="settings-outline" size={25} color="black" />
            </TouchableOpacity>
          </View>
          }
        })}
        />
        <Stack.Screen name="PushScreen" component={PushScreen} options={{headerBackTitleVisible:false, title:"", headerTitleAlign: 'center'}}/>
        <Stack.Screen name="AddFriend" component={AddFriend} options={{headerBackTitleVisible:false, headerTitleAlign: 'center'}}/>
        <Stack.Screen name="Settings" component={Settings} options={{headerBackTitleVisible:false, headerTitleAlign: 'center'}}/>
        <Stack.Screen name="FriendReq" component={FriendReq} options={{headerBackTitleVisible:false, headerTitleAlign: 'center'}}/>
      </Stack.Navigator>
    </StackContext.Provider>
  );
}