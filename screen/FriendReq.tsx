
import React,{useState,useEffect,useContext} from 'react';
import {Platform, SafeAreaView, StyleSheet, Text, View, Alert, PermissionsAndroid, Dimensions, TouchableNativeFeedback,TouchableOpacity} from 'react-native';
import database from '@react-native-firebase/database';
import Contacts from 'react-native-contacts';
import firebaseInit from '../utils/firebaseInit';
import {StackContext} from '../utils/StackContext';
import { AnimatedFlatList, AnimationType } from 'flatlist-intro-animations';
import { useHeaderHeight } from '@react-navigation/elements';
firebaseInit()

const screenWidth= Dimensions.get('screen').width
const screenHeight= Dimensions.get('screen').height

const testArr = [1,2,3,4,5,6,7,8,9,10]

const FriendReq = ({navigation}:any) => {

  const myContacts:any = {}
  const [addList,setAddList] = useState<any>({})
  const {userInfo} = useContext(StackContext)
  const headerHeight = useHeaderHeight();
  
  // const getList = () => {
  //   Contacts.getAll()
  //     .then((contacts) => {
  //       contacts.map((item)=>{
  //         myContacts[item.phoneNumbers[0]['number']]={name:item.familyName+item.givenName, phone_number:item.phoneNumbers[0]['number']}
  //       })
  //       database().ref('user_phone_numbers').once('value',snapshot=>{
  //         Object.values(snapshot.val()).map((info:any)=>{
  //           if(myContacts[info.phone_number]){
  //             addList[info.phone_number]={...myContacts[info.phone_number],uid:info.uid}
  //             setAddList({...addList})  
  //           }
  //         })
  //         // console.log(addList)
  //       })
  //     })
  //     .catch((e) => {
  //       console.log('cannot access');
  //     });
  // };

  const rend_item =(item:any)=>{

    const pushItem = (
      <View style={{...styles.addStyle, overflow: Platform.OS === 'android' ? 'hidden' : 'visible', width:screenWidth*0.8, height:screenWidth*0.30}}>
          <Text>{item.item}</Text>
      </View> 
    )

    return (
      <View style={{justifyContent:'center',alignItems:'center',margin:screenWidth*0.03}}>       
        {Platform.OS === 'android' ?        
          <TouchableNativeFeedback onPress={()=>Alert.alert("item")} onLongPress={()=>{Alert.alert("삭제하시겠습니까")}}
            background={TouchableNativeFeedback.Ripple('#00000040', false)} useForeground={true}>
            {pushItem}
          </TouchableNativeFeedback> :
          
          <TouchableOpacity onPress={()=>Alert.alert("item")} onLongPress={()=>{Alert.alert("삭제하시겠습니까")}}>
            {pushItem}
          </TouchableOpacity>}
      </View>
    )
  }
  
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

  // getList()
  
  },[])


  return (
    <SafeAreaView style={{flex:1}}>
     
     {testArr.length!==0 ?  

      <AnimatedFlatList
        data={testArr}
        renderItem={rend_item}
        animationType={AnimationType.SlideFromBottom}
        animationDuration={1000}
        keyExtractor={(index:any) => index}
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

export default FriendReq;
