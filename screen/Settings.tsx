
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React,{useState,useContext, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  TextInput,
  Dimensions,
  Switch,
  Modal,
  TouchableOpacity,
  Image
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { setName, deleteAccount } from '../utils/firebaseCall';
import { StackContext } from '../utils/StackContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setEnabled,removeValue} from '../utils/localStorage';
import Icon from 'react-native-vector-icons/Ionicons';


const w=Dimensions.get('screen').width
const h=Dimensions.get('screen').height

const Settings = () => {

  
  const {userInfo} = useContext(StackContext)
  const [myName,setMyName]=useState<any>(userInfo.name)
  const [isEnabled,setIsEnabled] = useState(true)
  const [confirm, setConfirm] = useState<any>('')
  const [nameEditState, setNameEditState] =  useState<any>({editable:false,focusing:false,buttonView:false})

  

  async function signInWithPhoneNumber() {
    const confirmation:any = await auth().signInWithPhoneNumber("+82 10-"+(userInfo.myPhone).substring(3,7)+"-"+(userInfo.myPhone).substring(7));
    setConfirm(confirmation)
  }

  async function confirmCode() {
    try {
      await confirm.confirm('123456').then((result:any)=>{
        removeValue("loginChecker")
        deleteAccount(userInfo.uid)
        auth().currentUser?.delete()
      });
    } catch (error) {
      Alert.alert("잘못된 코드입니다. 다시 입력해주세요.")
      console.log('Invalid code.');
    }
  }
  
  const getSettingEnabled = async () => {
    try {
      const value = await AsyncStorage.getItem('isEnabledNotification')
      if(value == null) {
        setEnabled("true")
        setIsEnabled(true)
      }else{
        setIsEnabled(JSON.parse(value))
      }
    } catch(e) {
      console.log(e)
    }
  }

  useEffect(()=>{
    getSettingEnabled()
  },[])

  return (
    <SafeAreaView style={{flex:1,alignItems:'center',justifyContent:'center'}}>
      <View style={{width:w*0.9,height:h*0.75}}>
        <View style={{ borderBottomWidth:1, justifyContent:'space-between'}}>
          {/* 이름 변경 */}
          <View style={{height:h*0.12, width:w*0.9, justifyContent:'center' }}>
            
            <View style={{flexDirection:'row'}}>
              <Text style={styles.settingTitle}>Name</Text>
              <TouchableOpacity onPress={()=>{setMyName(userInfo.name), setNameEditState({...nameEditState,editable:!nameEditState.editable,focusing:!nameEditState.focusing})}} style={{paddingLeft:5}}>
                <Icon name="create-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View style={{flexDirection:'row', width:w*0.85, justifyContent:'space-between'}}>
              <TextInput editable={nameEditState.editable} selectTextOnFocus={nameEditState.focusing} style={{paddingLeft:15,borderWidth:3, borderRadius:10, width:w*0.65,height:45, backgroundColor:'#FDEC94', fontSize:18}} maxLength={13} onChangeText={text=>setMyName(text)} value={myName}/>              
              <TouchableOpacity style={{ ...styles.editButton, width:w*0.15,height:45}} onPress={()=>{setNameEditState({...nameEditState,editable:!nameEditState.editable,focusing:!nameEditState.focusing})}}>
                <Text style={{fontSize:15, color:'black'}}> Edit </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{height:h*0.12,width:w*0.85,justifyContent:'space-between',alignContent:'center', alignItems:'center', flexDirection:'row'}}>
            <Text style={styles.settingTitle}>Notification On/Off</Text>
            <View style={{justifyContent:'center', alignItems:'center', width:w*0.15, height:45}}>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={()=>{setIsEnabled(!isEnabled), setEnabled(JSON.stringify(!isEnabled))}}
                value={isEnabled}
              />
            </View>
          </View>

        </View>

        <View style={{height:h*0.2, justifyContent:'space-evenly',borderBottomWidth:1}}>
          <View style={{width:w*0.85, justifyContent:'space-between', alignItems:'center', flexDirection:'row'}}>
            <Text style={styles.settingTitle}>이용약관</Text>
            <TouchableOpacity style={{width:w*0.05}} onPress={()=>Alert.alert("아직 준비중")}>
              <Icon name="chevron-forward-outline" size={w*0.06} color="black" />
            </TouchableOpacity>
          </View>

          <View style={{width:w*0.85, justifyContent:'space-between', alignItems:'center', flexDirection:'row'}}>
            <Text style={styles.settingTitle}>개인정보 처리방침</Text>
            <TouchableOpacity style={{width:w*0.05}} onPress={()=>Alert.alert("아직 준비중")}>
            <Icon name="chevron-forward-outline" size={w*0.06} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        
        <View style={{height:h*0.17,width:w*0.9, justifyContent:'center', borderBottomWidth:1}}>
          <Text style={{...styles.settingTitle, lineHeight:30}}>Contact</Text>
          <Text style={{lineHeight:20,fontSize:15, paddingLeft:5}}>신고 사항이나 건의 사항은 스크린샷과 함께 {'<'}zolzac2015@gmail.com{'>'} 으로 메일 보내주세요.</Text>
        </View>
        

        <View style={{height:h*0.15, justifyContent:'flex-end',alignItems:'flex-end'}}>
          <TouchableOpacity style={{borderWidth:1,borderRadius:5, padding:5}} onPress={()=>{removeValue("loginChecker"), auth().signOut()}}>
            <Text style={{color:'black'}}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{
    backgroundColor:'rgba(255,255,255,0.95)',
    borderWidth:3,
    borderRadius:30,
    overflow:'hidden'
  },
  editButton:{
    borderWidth:3, 
    borderRadius:10, 
    backgroundColor:'#FDEC94', 
    justifyContent:'center', 
    alignItems:'center'
  },
  settingTitle:{
    fontSize:20,
    color:'black', 
    fontWeight:'bold',
    marginLeft:5,
    marginBottom:5
  }
})

export default Settings;
