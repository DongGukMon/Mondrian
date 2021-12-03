
import React,{useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button
} from 'react-native';


const Friends = ({navigation}:any) => {


  return (
    <SafeAreaView style={{flex:1,backgroundColor:'tomato', justifyContent:'center', alignItems:'center'}}>
      <Text>여기는 친구 화면입니다.</Text>
      <Button title="푸시보내기" onPress={()=>navigation.navigate("PushScreen")}/>
      {/* <Button title="받은 요청" onPress={()=>navigation.navigate("FriendReq")}/> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default Friends;
