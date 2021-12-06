
import React,{useState,useContext,useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  Dimensions
} from 'react-native';
import { AnimatedFlatList, AnimationType } from 'flatlist-intro-animations';
import { useHeaderHeight } from '@react-navigation/elements';
import {StackContext} from '../utils/StackContext'
import { deleteFriend } from '../utils/firebaseCall';

const screenWidth= Dimensions.get('screen').width
const screenHeight= Dimensions.get('screen').height


const Friends = ({navigation}:any) => {
  
  const headerHeight = useHeaderHeight();
  const{userInfo,friendList,setFriendList,selectedFriend,setSelectedFriend} = useContext(StackContext)


  const deleteAlert = (myUid:string,friendUid:string,index:number)=>{
    Alert.alert(
      "",
      "친구 목록에서 제거하시겠습니까?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        { text: "OK", onPress: () => {
            deleteFriend(myUid,friendUid)
            // refreshList(index)
          }  
        }
      ]
    );
  }

  // const refreshList =(index:any)=>{
  //   var tempArr = friendList.slice()
  //   tempArr.splice(index,1)
  //   setFriendList(tempArr)
  // }

  const rend_item =(item:any)=>{
    
    const pushItem = (
      <View style={{...styles.addStyle, overflow: Platform.OS === 'android' ? 'hidden' : 'visible', width:screenWidth*0.8, height:screenWidth*0.30}}>
          <Text>{item.item.name}</Text>
          <Text>{item.item.phone_number}</Text>
      </View> 
    )

    return (
      <View style={{justifyContent:'center',alignItems:'center',margin:screenWidth*0.03}} key={item.index}>       
        {Platform.OS === 'android' ?        
          <TouchableNativeFeedback onPress={()=>{setSelectedFriend(item.item), navigation.navigate('PushScreen')}} onLongPress={()=>{deleteAlert(userInfo.uid,item.item.uid,item.index)}}
            background={TouchableNativeFeedback.Ripple('#00000040', false)} useForeground={true}>
            {pushItem}
          </TouchableNativeFeedback> :
          
          <TouchableOpacity onPress={()=>{setSelectedFriend(item.item),navigation.navigate('PushScreen')}} onLongPress={()=>{deleteAlert(userInfo.uid,item.item.uid,item.index)}}>
            {pushItem}
          </TouchableOpacity>}
      </View>
    )
  }


  return (
    <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
     
    {Object.values<any>(friendList).length!==0 ?  

     <AnimatedFlatList
       data={Object.values<any>(friendList)}
       renderItem={rend_item}
       animationType={AnimationType.SlideFromBottom}
       animationDuration={1000}
       // keyExtractor={(index:any) => index}
       contentContainerStyle={{minHeight:screenHeight-(headerHeight*3)}}
     />
     : 
     <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
       <Text>아싸</Text>
     </View>
    }
    </SafeAreaView>
  )
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

export default Friends;
