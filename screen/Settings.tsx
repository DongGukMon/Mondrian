
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React,{useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Alert
} from 'react-native';
import auth from '@react-native-firebase/auth';

const Settings = () => {


  return (
    <SafeAreaView style={{flex:1, backgroundColor:'pink', justifyContent:'center', alignItems:'center'}}>
      <Text>설정 페이지.</Text>
      <Button title="log out" onPress={()=>auth().signOut()}/>
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

export default Settings;
