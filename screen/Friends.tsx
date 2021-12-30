
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
  Dimensions,
  ImageBackground,
  Button,
  PermissionsAndroid
} from 'react-native';
import { AnimatedFlatList, AnimationType } from 'flatlist-intro-animations';
import { useHeaderHeight } from '@react-navigation/elements';
import {StackContext} from '../utils/StackContext'
import { deleteFriend } from '../utils/firebaseCall';

const screenWidth= Dimensions.get('screen').width
const screenHeight= Dimensions.get('screen').height

const Friends = ({navigation}:any) => {
  
  const headerHeight = useHeaderHeight();
  const{userInfo,contactsPermission,friendList,setSelectedFriend,getFriends,isRefreshing,setIsRefreshing} = useContext(StackContext)


  const deleteAlert = (myUid:string,friendUid:string,friendName:string,phone_number:string)=>{
    Alert.alert(
      "",
      friendName+"("+phone_number+")님을 친구 목록에서 제거하시겠습니까?",
      [
        {
          text: "취소",
          onPress: () => {},
          style: "cancel"
        },
        { text: "네", onPress: () => {
            deleteFriend(myUid,friendUid)
          }  
        }
      ]
    );
  }

  const rend_item =(item:any)=>{
    
    const pushItem = (
      <View style={{...styles.addStyle, overflow: Platform.OS === 'android' ? 'hidden' : 'visible', width:screenWidth*0.8, height:screenWidth*0.30}}>
          <Text style={styles.itemTextStyle}>{item.item.name}</Text>
      </View> 
    )

    return (
      <View style={{justifyContent:'center',alignItems:'center',margin:screenWidth*0.03}} key={item.index}>       
        {Platform.OS === 'android' ?        
          <TouchableNativeFeedback onPress={()=>{setSelectedFriend(item.item), navigation.navigate('PushScreen')}} onLongPress={()=>{deleteAlert(userInfo.uid,item.item.uid,item.item.name,item.item.phone_number)}}
            background={TouchableNativeFeedback.Ripple('#00000040', false)} useForeground={true}>
            {pushItem}
          </TouchableNativeFeedback> :
          
          <TouchableOpacity onPress={()=>{setSelectedFriend(item.item),navigation.navigate('PushScreen')}} onLongPress={()=>{deleteAlert(userInfo.uid,item.item.uid,item.item.name,item.item.phone_number)}}>
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
    (Platform.OS ==='android') ? (contactsPermission && getFriends()) : getFriends()
    
  },[])

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
      <ImageBackground style={{flex:1}} source={Object.values<any>(friendList).length!==0 ? require('../assets/background/background5.png') : require('../assets/background/background4.png')}>
      <View style={{flex:1, marginTop:10}}>
        {Object.values<any>(friendList).length!==0 ?  
          <AnimatedFlatList
            data={Object.values<any>(friendList)}
            // data={testArr}
            renderItem={rend_item}
            animationType={AnimationType.SlideFromBottom}
            animationDuration={1000}
            // keyExtractor={(index:any) => index}
            contentContainerStyle={{minHeight:screenHeight-(headerHeight*3)}}
            refreshing={isRefreshing}
            onRefresh={listRefresh}
          />
           : 
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            {
            (Platform.OS === "android") ?
            (contactsPermission ?
            <Text style={{fontSize:16, fontWeight:'bold', textAlign:'center'}}>친구에게 Mondrian을 소개해보세요!</Text> :
              <View style={{alignItems:'center'}}>
                <Text>연락처 접근 권한을 승인해야 친구 목록이 동기화 됩니다.</Text>
                <Text>스마트폰 설정에서 Mondrian의 연락처 접근 권한을 승인해주세요.</Text>
              </View>) :
               (<Text style={{fontSize:16, fontWeight:'bold', textAlign:'center'}}>친구에게 Mondrian을 소개해보세요!</Text>)
            }
        </View>
        }
    </View>
    </ImageBackground>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  addStyle: {
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#ABDECB',
    borderWidth:3
  },
  itemTextStyle:{
    fontSize:18,
    fontWeight:'500',
    color:'black'
  }
});

export default Friends;
