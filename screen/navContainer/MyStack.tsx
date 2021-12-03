import { createStackNavigator } from '@react-navigation/stack';
import Friends from '../Friends';
import PushScreen from '../PushScreen';
import AddFriend from '../AddFriend';
import Settings from '../Settings';
import FriendReq from '../FriendReq';
import React,{useContext, useState} from 'react';
import {Text,View,TouchableOpacity} from 'react-native'
import {StackContext} from '../../utils/StackContext'
import Icon from 'react-native-vector-icons/Ionicons';


const Stack = createStackNavigator();

interface Iprops{
  userId:string
}

export type RootStackParamList = {
  Friends: undefined;
  PushScreen: undefined;
  navigation:any;
  };


export default function MyStack(props:Iprops) {

  const [selectData,setSelectData] = useState()
  const [userInfo, setUserInfo] = useState({uid:props.userId})

  const iconSet = () =>{
    
  }

  return (
    <StackContext.Provider value={{selectData,setSelectData, userInfo, setUserInfo}}>
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