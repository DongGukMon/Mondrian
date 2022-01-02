
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React,{useState,useContext, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  Dimensions,
  Switch,
  Modal,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Platform,
  Linking,
  AppState
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { setName, deleteAccount, whenLogedOut } from '../utils/firebaseCall';
import { StackContext } from '../utils/StackContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setEnabled,removeValue} from '../utils/localStorage';
import Icon from 'react-native-vector-icons/Ionicons';
import messaging from '@react-native-firebase/messaging';


const personalInfoText =[
  {
    title:"제 1조 (개인정보의 처리 목적) <Mondrian>은 다음과 같은 목적으로 사용자님의 개인정보를 수집·처리합니다.",
    body: "회원가입 및 서비스 제공:서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지 목적"
  },
  {
    title:"제 2조 (개인정보 처리 및 보유 기간)",
    body: "회원 탈퇴 시 Mondrian에서 수집한 모든 정보가 즉시 삭제됩니다."
  },
  {
    title:"제 3조 (개인정보의 제3자 제공)",
    body: "<Mondrian>은 개인정보를 제 3자에 제공하지 않습니다."
  },
  {
    title:"제 4조 (개인정보처리 위탁)",
    body: "<Mondriand>은 개인정보 처리업무를 위탁하지 않습니다."
  },
  {
    title:"제 5조 (정보주체와 법정대리인의 권리·의무 및 그 행사방법)",
    body: "정보주체는 Mondrian에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다."
  },
  {
    title:"제 6조 (처리하는 개인정보의 항목) <Mondrian>은 다음의 개인정보 항목을 처리하고 있습니다.",
    body: "필수항목: 휴대전화번호, 이름, 개인식별자, 기기식별자, 접속 로그"
  },
  {
    title:"제 7조 (개인정보의 파기)",
    body: "제 2조의 내용과 같습니다."
  },
  {
    title:"제 8조 (개인정보의 안전성 확보 조치)",
    body: "<Mondrian>의 개인정보는 모두 google firebase DB에 저장됩니다. 따라서 firebase의 보안 정책을 따릅니다."
  },
  {
    title:"제 9조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)",
    body: "<Mondrian>은 ‘쿠키(cookie)’를 사용하지 않습니다."
  },
  {
    title:"제 10조 (개인정보 보호책임자)",
    body: "이메일: zolzac2015@gmail.com"
  },
  {
    title:"제 11조 (개인정보 열람청구)",
    body: "이메일: zolzac2015@gmail.com"
  }
]


const w=Dimensions.get('screen').width
const h=Dimensions.get('screen').height

const Settings = () => {

  
  const {userInfo,setUserInfo} = useContext(StackContext)
  const [myName,setMyName]=useState<any>(userInfo.name)
  const [isEnabled,setIsEnabled] = useState(true)
  const [confirm, setConfirm] = useState<any>('')
  const [nameEditState, setNameEditState]:any =  useState<any>({editable:false,focusing:false})
  const [isVisible, setIsVisible] = useState(false)
  const [isVisible2, setIsVisible2] = useState(false)

  const [deleteAccountCode, setDeleteAccountCode] = useState('')

  const inputRef = useRef<any>();


  const deleteAlert = ()=>{
    Alert.alert(
      "",
      "회원 탈퇴 이후 모든 정보가 삭제되고 돌이킬 수 없습니다. 회원 탈퇴를 위해서는 다시한번 휴대전화 인증이 필요합니다. 탈퇴하시겠습니까?",
      [
        {
          text: "취소",
          onPress: () => {},
          style: "cancel"
        },
        { text: "네", onPress: () => {
            signInWithPhoneNumber()
          }  
        }
      ]
    );
  }
  

  async function signInWithPhoneNumber() {
    const confirmation:any = await auth().signInWithPhoneNumber("+82 10-"+(userInfo.myPhone).substring(3,7)+"-"+(userInfo.myPhone).substring(7));
    setConfirm(confirmation);
    setIsVisible(false);
    setIsVisible2(true);
  }

  async function confirmCode() {
    try {
      await confirm.confirm(deleteAccountCode).then((result:any)=>{
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

  const checkNotificationStatus = async() =>{

        const authStatus = await messaging().hasPermission();
        console.log(authStatus)
        if(authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
            setIsEnabled(true)
        }else{
            setIsEnabled(false)
        }
      }
    


  useEffect(()=>{
    //  stateSubscription.remove()
    const stateSubscription = AppState.addEventListener('change',()=>AppState.currentState==='active' && checkNotificationStatus())
    Platform.OS ==='android' ? getSettingEnabled() : checkNotificationStatus()

    return ()=>{stateSubscription.remove()}
  },[])

  useEffect(()=>{
    inputRef.current.focus()
  },[nameEditState])

  return (
    <SafeAreaView style={{flex:1,alignItems:'center',justifyContent:'center'}}>
      <View style={{width:w*0.9,height:h*0.75}}>
        <View style={{ borderBottomWidth:1, justifyContent:'space-between'}}>
          {/* 이름 변경 */}
          <View style={{height:h*0.12, width:w*0.9, justifyContent:'center' }}>
            
            <View style={{flexDirection:'row'}}>
              <Text style={styles.settingTitle}>Name</Text>
              <TouchableOpacity onPress={()=>{setMyName(userInfo.name), setNameEditState({editable:!nameEditState.editable,focusing:!nameEditState.focusing})}} style={{paddingLeft:5}}>
                <Icon name="create-outline" size={24} color="black" />
                {/* <Image style={{width:100,height:100}} source={{uri:'http://drive.google.com/uc?export=view&id=1blpB7HcKD6kuGJ774Wigmw-ZQfkuWSlz'}}/> */}
              </TouchableOpacity>
            </View>

            <View style={{flexDirection:'row', width:w*0.85, justifyContent:'space-between'}}>
              <TextInput ref={inputRef} editable={nameEditState.editable} selectTextOnFocus={nameEditState.focusing} style={{paddingLeft:15,borderWidth:3, borderRadius:10, width:w*0.65,height:45, backgroundColor: !nameEditState.editable ? '#FDEC94' : 'white', fontSize:18}} maxLength={13} onChangeText={text=>setMyName(text)} value={myName}/>              
              {nameEditState.editable &&
                <TouchableOpacity style={{ ...styles.editButton, width:w*0.15,height:45}} onPress={()=>{setName(myName,userInfo.uid),setUserInfo({...userInfo,name:myName}),setNameEditState({editable:!nameEditState.editable,focusing:!nameEditState.focusing})}}>
                  <Text style={{fontSize:15, color:'black'}}> Edit </Text>
                </TouchableOpacity>
              }
            </View>

          </View>

          <View style={{height:h*0.12,width:w*0.85,justifyContent:'space-between',alignContent:'center', alignItems:'center', flexDirection:'row'}}>
            <Text style={styles.settingTitle}>Notification On/Off</Text>
            <View style={{justifyContent:'center', alignItems:'center', width:w*0.15, height:45}}>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={()=>{Platform.OS == 'android' ? (setEnabled(JSON.stringify(!isEnabled)),setIsEnabled(!isEnabled)) : Linking.openURL('App-Prefs:NOTIFICATIONS_ID&path=org.reactjs.native.example.AYO')}}
                value={isEnabled}
              />
            </View>
          </View>

        </View>

        <View style={{height:h*0.2,width:w*0.9, justifyContent:'center', borderBottomWidth:1}}>
          <Text style={{...styles.settingTitle, lineHeight:30}}>Contact</Text>
          <Text style={{lineHeight:20,fontSize:15, paddingLeft:5}}>신고 사항이나 건의 사항은 스크린샷과 함께 {'<'}zolzac2015@gmail.com{'>'} 으로 메일 보내주세요.</Text>
        </View>

        <View style={{height:h*0.15, justifyContent:'space-evenly',borderBottomWidth:1}}>

          <View style={{width:w*0.85, justifyContent:'space-between', alignItems:'center', flexDirection:'row'}}>
            <Text style={styles.settingTitle}>개인정보 처리방침</Text>
            <TouchableOpacity style={{width:w*0.05}} onPress={()=>setIsVisible(true)}>
            <Icon name="chevron-forward-outline" size={w*0.06} color="black" />
            </TouchableOpacity>
          </View>

        </View>
        

        <View style={{height:h*0.15, justifyContent:'flex-end',alignItems:'flex-end'}}>
          <TouchableOpacity style={{borderWidth:1,borderRadius:5, padding:5}} onPress={()=>{whenLogedOut(userInfo.uid), messaging().deleteToken() ,auth().signOut()}}>
            <Text style={{color:'black'}}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={isVisible} transparent={true}>
        <TouchableOpacity onPress={()=>setIsVisible(false)} style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <TouchableWithoutFeedback onPress={()=>{}}>
            <View style={{...styles.personalInfoModalStyle, height:h*0.8,width:w*0.8}}>
              <ScrollView >
                <View style={{padding:10}} onStartShouldSetResponder={() => true}>
                  <Text style={{fontWeight:'bold',marginVertical:10,fontSize:20,textAlign:'center', color:'black'}}>개인정보처리방침</Text>
                  {personalInfoText.map((item,index)=>{
                    return(
                      <View style={{padding:10}} key={index}>
                        <Text style={{fontWeight:'bold',color:'black'}}>{item.title}</Text>
                        <Text style={{color:'black',paddingLeft:20}}>{item.body}</Text>
                      </View>
                    )
                  })}
                  <View style={{padding:10}}>
                    <Text style={{fontWeight:'bold',color:'black'}}>제 12조 (권익침해 구제방법)</Text>
                    <Text style={{color:'black',paddingLeft:20}}>1. 개인정보분쟁조정위원회 : (국번없이) 1833-6972 (www.kopico.go.kr)</Text>
                    <Text style={{color:'black',paddingLeft:20}}>2. 개인정보침해신고센터 : (국번없이) 118 (privacy.kisa.or.kr)</Text>
                    <Text style={{color:'black',paddingLeft:20}}>3. 대검찰청 : (국번없이) 1301 (www.spo.go.kr)</Text>
                    <Text style={{color:'black',paddingLeft:20}}>4. 경찰청 : (국번없이) 182 (ecrm.cyber.go.kr)</Text>
                    <Text style={{color:'black',paddingLeft:20}}>「개인정보보호법」제35조(개인정보의 열람), 제36조(개인정보의 정정·삭제), 제37조(개인정보의 처리정지 등)의 규정에 의한 요구에 대 하여 공공기관의 장이 행한 처분 또는 부작위로 인하여 권리 또는 이익의 침해를 받은 자는 행정심판법이 정하는 바에 따라 행정심판을 청구할 수 있습니다.</Text>

                  </View>

                  <View style={{height:70,padding:10, justifyContent:'flex-end',alignItems:'flex-end'}}>
                    <TouchableOpacity style={{borderWidth:1,borderRadius:5, padding:5}} onPress={()=>{deleteAlert()}}>
                      <Text style={{color:'black'}}>Delete Account</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>  
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

      <Modal visible={isVisible2} transparent={true}>
        <TouchableOpacity onPress={()=>{setIsVisible2(false)}} style={{justifyContent:'center', alignItems:'center', flex:1}}>
          <TouchableWithoutFeedback>
            <View style={{...styles.deleteAccountModalStyle, width:w*0.8, height:h*0.35}}>
              <View style={{width:w*0.7,paddingLeft:5}}>
                <Text style={{textDecorationLine:'underline',fontSize:20,fontWeight:'bold',color:'black'}}>Withdrawal</Text>
              </View>
              <View style={{justifyContent:'center', alignItems:'center', height:h*0.25}}>
                <View style={{height:h*0.085,width:w*0.7, justifyContent:'space-between'}}>
                  <Text style={{fontSize:16,color:'black', fontWeight:'bold',marginLeft:5,marginBottom:5}}>Verify Code from SMS</Text>
                  <View style={{flexDirection:'row', justifyContent:'center'}}>
                    <TextInput placeholder='6-digit Code' style={{textAlign:'center', borderWidth:3, borderRadius:10, width:w*0.7,height:45, fontSize:18}} value={deleteAccountCode} onChangeText={text => setDeleteAccountCode(text)} />
                  </View>
                </View>
                <View style={{height:h*0.03}}/>
                <View style={{ justifyContent:'center', alignItems:'center'}}>
                  <TouchableOpacity style={{width:w*0.7,height:45,borderRadius:10 ,borderWidth:3, justifyContent:'center', backgroundColor:'#E9BCBE'}} onPress={() => confirmCode()}>
                    <Text style={{fontSize:18, textAlign:'center',color:'black', fontWeight:'bold'}}>Delet Account</Text>
                  </TouchableOpacity>  
                </View> 
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

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
  },
  personalInfoModalStyle:{
    backgroundColor:'white', 
    borderRadius:15,
    borderWidth:3,
    borderColor:'black',
  },
  deleteAccountModalStyle:{
    borderRadius:15, 
    borderColor:'black', 
    borderWidth:3, 
    backgroundColor:'white', 
    alignItems:'center',
    justifyContent:'center'
  }
})

export default Settings;
