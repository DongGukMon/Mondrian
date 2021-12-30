import React,{useState,useContext, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
  TouchableNativeFeedback,
  ImageBackground,
  Image,
  Modal,
  Button,
  TextInput,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackBase
} from 'react-native';
import { StackContext } from '../utils/StackContext';
import { goPush } from '../utils/notification';
import {setPushCounter,removeValue, pushCustom, setPushCustom} from '../utils/localStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';

const screenWidth= Dimensions.get('screen').width
const screenHeight= Dimensions.get('screen').height > 800 ?  Dimensions.get('screen').height : 800

const basicIconList = [
  {icon:require('../assets/icons/delivery-man.png'), iconUrl:'http://drive.google.com/uc?export=view&id=1blpB7HcKD6kuGJ774Wigmw-ZQfkuWSlz', description:"배달"},
  {icon:require('../assets/icons/cheers.png'), iconUrl:'https://drive.google.com/uc?export=view&id=1ZPcQrpRNZqDBGQdxj7i3MIDCVApqf-Kz', description:"술"},
  {icon:require('../assets/icons/fried-rice.png'), iconUrl:'https://drive.google.com/uc?export=view&id=1QAEgXvzCygt75rx6HiKJhI9fRmcNcnUE', description:"밥"},
  {icon:require('../assets/icons/coffee-cup.png'), iconUrl:'https://drive.google.com/uc?export=view&id=18ItEVVR-K8moYEudidUDCxhRpdJz-BAY', description:"카페"},
  {icon:require('../assets/icons/game-controller.png'), iconUrl:'https://drive.google.com/uc?export=view&id=16hC61ICT0kTCxpVDr3St8yisITo8Tbms', description:"게임"},
  {icon:require('../assets/icons/steering-wheel.png'), iconUrl:'https://drive.google.com/uc?export=view&id=1jDRXir24Vv60-3E26TIWJlY-KlXbHRWx', description:"드라이브"},
  
  {icon:require('../assets/icons/open-book.png'), iconUrl:'https://drive.google.com/uc?export=view&id=1WydpnpSPJ2JQx0htOTY7TF4xN2x9QZkT', description:"공부"},
  {icon:require('../assets/icons/destination.png'), iconUrl:'https://drive.google.com/uc?export=view&id=13cIKhg2CsNqmEiGi35JM3WxdmcUG3j5i', description:"여행"},
  {icon:require('../assets/icons/excercise.png'), iconUrl:'https://drive.google.com/uc?export=view&id=1sj0YuwiK8-E49TfymwDdhGpE-z6WoU8_', description:"운동"},
  {icon:require('../assets/icons/bored.png'), iconUrl:'https://drive.google.com/uc?export=view&id=1GWa1Eanl9HfOAZTpBs_3DwDre3ujJiEn', description:"피곤"},
  {icon:require('../assets/icons/animal.png'), iconUrl:'https://drive.google.com/uc?export=view&id=1uP2uB3DQfM1iuMKfqNdfB_0IJewfgx50', description:"강아지"},
  {icon:require('../assets/icons/cake.png'), iconUrl:'https://drive.google.com/uc?export=view&id=1Uo_Hx5cSpS9wtboE_vHi4JIO0EW4p43M', description:"디저트"},
  {icon:require('../assets/icons/call.png'), iconUrl:'https://drive.google.com/uc?export=view&id=1R0DByvrILepjHDzYrQueA2RPBr0WgFZv', description:"전화"},
  {icon:require('../assets/icons/insomnia.png'), iconUrl:'https://drive.google.com/uc?export=view&id=1LLW9KqWM5a_tVQOLPZBsHkbmhzS5PCkG', description:"잠자리"},
  {icon:require('../assets/icons/smoking.png'), iconUrl:'https://drive.google.com/uc?export=view&id=1I9ASrTiBuknmmt_Pt-Z24Dno1_74JCa3', description:"담배"},
  
  {icon:require('../assets/icons/hand.png'), iconUrl:'https://drive.google.com/uc?export=view&id=1YbldvUpktaTBgIrtVVf5V6kK4Jg0KhO7', description:"손바닥"},
  {icon:require('../assets/icons/stop.png'), iconUrl:'https://drive.google.com/uc?export=view&id=1UWNZw34tPKWfAJfbO1Mg8Jf27yGwDHI8', description:"멈춰"},
  {icon:require('../assets/icons/brotherhood.png'), iconUrl:'https://drive.google.com/uc?export=view&id=1-KhponwzzjqBqhNrvkb07Pse5mFQXdaY', description:"사랑해"},
  {icon:require('../assets/icons/think.png'), iconUrl:'https://drive.google.com/uc?export=view&id=1emgIrIXBIcHH12ZV5PGuA7yyoo1hhFuv', description:"고민"},
  {icon:require('../assets/icons/hey.png'), iconUrl:'https://drive.google.com/uc?export=view&id=1ndTZU5fPCZCK1vGMx1jESuyTW5t9ulBO', description:"헤이"},
  {icon:require('../assets/icons/yes.png'), iconUrl:'https://drive.google.com/uc?export=view&id=1V0j-dLdX7EDC3RUxywC1IUf-kj8ghoLf', description:"좋아"},
  {icon:require('../assets/icons/no.png'), iconUrl:'https://drive.google.com/uc?export=view&id=1HmsuBbJJDvrfnz8JwePaAq4sDt08F2Ya', description:"싫어"},

  {icon:require('../assets/icons/no_icon.png'), iconUrl:'https://cdn-icons.flaticon.com/png/512/1358/premium/1358126.png?token=exp=1639207102~hmac=97218bbbce4900e4c6d0d751b3fc7894', description:"없음"}

]


const PushScreen = () => {

  const {selectedFriend, userInfo,isDisabled,setIsDisabled} = useContext(StackContext);
  const [modalState, setModalState] = useState<any>({isVisible:false,data:null})
  const [pushList, setPushList] = useState<any>(null)
  const [editData, setEditData] =useState<any>({title:'',body:'',icon:''})

  const getPushList = async ()=>{
    const checkLength = await pushCustom()
    if ((checkLength.length < 6) &&(checkLength[checkLength.length-1].checker == null)){
      checkLength.push({title:"", body:'', icon:require('../assets/icons/3524388.png'), checker:true})
    }
    setPushList(checkLength)
  }

  const rend_item =(item:any,index:number)=>{
    
    const pushItem = (
      <View style={{...styles.pushStyle, overflow: Platform.OS === 'android' ? 'hidden' : 'visible', width:screenWidth*0.40, height:screenWidth*0.40,backgroundColor:(isDisabled&&!item.checker) ? 'gray' : 'white'}}>
          <Image style={{width:'70%',height:'70%'}} source={item.icon}/>
      </View> 
    )

    const pressItem=async()=>{


      const nowTime = Date.now()
      try {
        const value = await AsyncStorage.getItem(selectedFriend.uid)
        // storage에 저장된 값이 없거나, 40초가 경과했을 경우
        if((value ==null)||((nowTime-JSON.parse(value).time) > 40*1000)){
          //40초 후 초기화 setTimeout
          setTimeout(()=>{setIsDisabled(false),removeValue(selectedFriend.uid)},40*1000)
          //푸시 보내기
          goPush(selectedFriend.token,userInfo.name,item)
          //storage에 등록
          setPushCounter(selectedFriend.uid,0)
        } 
        // 40초 안에 10번 초과했을 경우
        else if(JSON.parse(value).count > 9){
            setIsDisabled(true)
            Alert.alert("40초 동안 최대 10번 보낼 수 있습니다.")
        } 
        // 40초가 지나지 않았지만 10번을 넘기지 않았을 경우
        else{
            goPush(selectedFriend.token,userInfo.name,item)
            setPushCounter(selectedFriend.uid,JSON.parse(value).count,JSON.parse(value).time)
        }
    
      } catch(e) {
        console.log(e)
      }
    }

    return (
      <View style={{justifyContent:'center',alignItems:'center', padding:screenHeight*0.02}} key={index}>   
        
        {item.checker==true ?
          
          //추가하기 버튼 눌렀을 때
          (Platform.OS === 'android' ?        
            <TouchableNativeFeedback onPress={()=>{setModalState({isVisible:true,data:item,index:index}), setEditData({title:item.title, body:item.body, icon:''})}}
              background={TouchableNativeFeedback.Ripple('#00000040', false)} useForeground={true}>
              {pushItem}
            </TouchableNativeFeedback> 
            :
            <TouchableOpacity onPress={()=>{setModalState({isVisible:true,data:item,index:index}), setEditData({title:item.title, body:item.body, icon:''})}}>
              {pushItem}
            </TouchableOpacity>) :
          
          //푸시 보내는 버튼 눌렀을 때
            (Platform.OS === 'android' ?        
            <TouchableNativeFeedback disabled={isDisabled} onPress={()=>pressItem()} onLongPress={()=>{setModalState({isVisible:true,data:item,index:index}), setEditData({title:item.title, body:item.body, icon:{icon:item.icon,iconUrl:item.iconUrl}})}}
              background={TouchableNativeFeedback.Ripple('#00000040', false)} useForeground={true}>
              {pushItem}
            </TouchableNativeFeedback> 
            :
            <TouchableOpacity disabled={isDisabled} onPress={()=>pressItem()} onLongPress={()=>{setModalState({isVisible:true,data:item,index:index}), setEditData({title:item.title, body:item.body, icon:{icon:item.icon,iconUrl:item.iconUrl}})}}>
              {pushItem}
            </TouchableOpacity>) 
        }

      </View>
    )
  }

  const iconCarouselRender = ({item,index}:any)=>{
    return (
      <TouchableOpacity key={index} style={{...styles.iconCarouselStyle, width:screenWidth*0.2, height:screenWidth*0.2, backgroundColor:item.icon==editData.icon.icon ? 'gray' : 'white'}} 
        onPress={()=>setEditData({...editData,icon:{icon:item.icon,iconUrl:item.iconUrl}})}>
        <Image source={item.icon} style={{width:'80%', height:'80%'}}/>
      </TouchableOpacity>
    )
  }

  useEffect(()=>{
    const stateChecker:any = AsyncStorage.getItem(selectedFriend.uid).then((res)=>{
      if((res !== null) && (JSON.parse(res).count > 9)) {
        setIsDisabled(true)
      }
      if((res !== null) && (Date.now()-JSON.parse(res).time) > 40*1000){
        setIsDisabled(false)
      }
    })
  
  },[])

  useEffect(()=>{
    getPushList()
    // removeValue('pushData')
  },[])

  return (
    <SafeAreaView style={{flex:1,justifyContent:'center'}}>
      <ImageBackground style={{flex:1}} source={require('../assets/background/background5.png')}>  
      <View style={{flex:1, flexWrap:'wrap', flexDirection:'row',justifyContent:'center', alignContent:'center'}}>
        {(pushList!==null)&&(pushList.map((item:any,index:any)=>(
          rend_item(item,index)
        )))}
      </View>

      <Modal visible={modalState.isVisible} transparent={true}>
        <TouchableOpacity style={styles.modalContainer} onPress={()=>{setModalState({...modalState,isVisible:false}), setEditData({title:'',body:'',icon:''})}}>
          {modalState.data &&
            <TouchableWithoutFeedback>
              <View style={{...styles.modalStyle,height:screenHeight*0.6, width:screenWidth*0.9}}> 
                
                {/* Header */}
                <View style={{height:screenHeight*0.075, justifyContent:'center', borderBottomWidth:3, backgroundColor:'#ABDECB'}}>
                  <Text style={styles.modalTitleText}>Customizing</Text>
                </View>
              
                {/* Body */}
                <View style={{alignItems:'center', justifyContent:'center'}}>
                  <View style={{height:screenHeight*0.03}}/>
                  {/* message title 입력 */}
                  <View style={{height:screenHeight*0.085,width:screenWidth*0.8, justifyContent:'space-between'}}>  
                    <Text style={styles.modalBodyText}>Title</Text>
                      <TextInput style={{...styles.modalTextInputStyle, width:screenWidth*0.8}} value={editData.title} onChangeText={(text)=>setEditData({...editData,title:text})}/>
                  </View>

                  <View style={{height:screenHeight*0.015}}/>
                  {/* message body 입력 */}
                  <View style={{height:screenHeight*0.085,width:screenWidth*0.8, justifyContent:'space-between'}}>  
                    <Text style={styles.modalBodyText}>Body</Text>
                      <TextInput style={{...styles.modalTextInputStyle, width:screenWidth*0.8}} value={editData.body} onChangeText={(text)=>setEditData({...editData,body:text})}/>
                  </View>

                  <View style={{height:screenHeight*0.015}}/>
                  {/* message icon 선택 */}
                  <View style={{width:screenWidth*0.8, justifyContent:'space-between'}}>  
                    <Text style={styles.modalBodyText}>Icon</Text>
                      <View style={{borderWidth:3, borderRadius:10, width:screenWidth*0.8, height:screenWidth*0.27, backgroundColor:'#FDEC94'}}>
                        <FlatList
                          data={basicIconList}   
                          horizontal
                          renderItem={iconCarouselRender}
                        />
                      </View>
                  </View>

                  <View style={{height:screenHeight*0.03}}/>

                  <View style={{ width:screenWidth*0.8,justifyContent:'space-between', flexDirection:'row', paddingHorizontal:modalState.data.checker ? 0:10}}>
                    <TouchableOpacity style={{...styles.ModalButtonView,width:modalState.data.checker ? screenWidth*0.8:screenWidth*0.35}} onPress={()=>{
                      (editData.title !=='' && editData.body!=='' && editData.icon !== '')
                      ? (
                      pushList[modalState.index] = {icon:editData.icon.icon,iconUrl:editData.icon.iconUrl,title:editData.title,body:editData.body},
                      setPushCustom(JSON.stringify(pushList)),
                      setPushList([...pushList]),
                      getPushList(),
                      setEditData({title:'',body:'',icon:''}),
                      setModalState({isVisible:false})
                      ) : (Alert.alert("모든 내용을 입력해주세요"))
                      }}>
                      <Text style={styles.ModalButtonStyle}>{modalState.data.checker ? "추가" : "수정"}</Text>
                    </TouchableOpacity>
                    
                    {!modalState.data.checker && (
                      <TouchableOpacity style={{...styles.ModalButtonView,width:screenWidth*0.35}} onPress={()=>{
                        pushList.splice(modalState.index,1)
                        setPushCustom(JSON.stringify(pushList))
                        setPushList([...pushList])
                        getPushList()
                        setEditData({title:'',body:'',icon:''})
                        setModalState({isVisible:false})
                        }}>
                        <Text style={styles.ModalButtonStyle}>삭제</Text>
                      </TouchableOpacity>
                    )}
                  </View> 
                </View>
              </View>
            </TouchableWithoutFeedback>
          }
        </TouchableOpacity>
      </Modal>

      </ImageBackground>        
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pushStyle: {
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 25,
    borderWidth:3
  },
  modalContainer:{
    flex:1, 
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalStyle:{
    backgroundColor:'white',
    // justifyContent:'center', 
    // alignItems:'center',
    borderWidth:3,
    borderRadius:15,
    overflow:'hidden'
  },
  modalTitleText:{
    fontSize:32, 
    marginLeft:15,
    color:'black', 
    fontWeight:'bold', 
    textAlign:'center'
  },
  modalBodyText:{
    fontSize:18,
    color:'black', 
    fontWeight:'bold',
    marginLeft:5,
    marginBottom:5
  },
  modalTextInputStyle:{
    paddingLeft:15, 
    borderWidth:3, 
    borderRadius:10, 
    height:45, 
    backgroundColor:'#FDEC94', 
    fontSize:18
  },
  iconCarouselStyle:{
    marginVertical:10,
    marginHorizontal:3, 
    justifyContent:'center', 
    alignItems:'center',
    borderWidth:2,
    borderRadius:10
  },
  ModalButtonView:{
    height:45,
    borderRadius:10,
    borderWidth:3, 
    justifyContent:'center', 
    backgroundColor:'#E9BCBE'
  },
  ModalButtonStyle:{
    fontSize:18, 
    textAlign:'center',
    color:'black', 
    fontWeight:'bold'
  }
});

export default PushScreen;
