import React,{useState,useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
  TouchableNativeFeedback
} from 'react-native';
import { StackContext } from '../utils/StackContext';
import { goPush } from '../utils/notification';

const screenWidth= Dimensions.get('screen').width
const screenHeight= Dimensions.get('screen').height


const PushScreen = () => {

  const {selectedFriend, userInfo} = useContext(StackContext);

  const pushList = [
    {title:"배달",body:"배고픈데 배민 시켜먹자"},
    {title:"술",body:"술 먹으러 가자"},
    {title:"밥",body:"밥먹었음? 밥먹으러 가자"},
    {title:"카페",body:"카페가실?"},
    {title:"공부",body:"오늘 공부 조지자"},
    {title:"드라이브",body:"답답한데 오늘 드라이브 어때"}]

  const rend_item =(item:any,index:number)=>{
    const pushItem = (
      <View style={{...styles.pushStyle, overflow: Platform.OS === 'android' ? 'hidden' : 'visible', width:screenWidth*0.40, height:screenWidth*0.40}}>
          <Text>{item.title}</Text>
      </View> 
    )

    return (
      <View style={{justifyContent:'center',alignItems:'center',margin:screenWidth*0.03}} key={index}>       
        {Platform.OS === 'android' ?        
          <TouchableNativeFeedback onPress={()=>{goPush(selectedFriend.token,userInfo.name,item)}}
            background={TouchableNativeFeedback.Ripple('#00000040', false)} useForeground={true}>
            {pushItem}
          </TouchableNativeFeedback> 
          :
          <TouchableOpacity onPress={()=>{goPush(selectedFriend.token,userInfo.name,item)}}>
            {pushItem}
          </TouchableOpacity>}
      </View>
    )
  }

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
      <View style={{height:screenHeight*0.1, backgroundColor:'gray', justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontWeight:'bold',fontSize:24,color:'white'}}>To. {selectedFriend.name}</Text>
      </View>
      <View style={{flex:1, marginTop:15, padding:screenWidth*0.02, flexWrap:'wrap', flexDirection:'row', alignItems:'center',justifyContent:'center'}}>
          {pushList.map((item,index)=>(
            rend_item(item,index)
          ))}
        </View>
        
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pushStyle: {
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

export default PushScreen;
