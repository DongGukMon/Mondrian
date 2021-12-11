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
  TextInput
} from 'react-native';
import { StackContext } from '../utils/StackContext';
import { goPush } from '../utils/notification';
import {setPushCounter,removeValue, pushCustom, setPushCustom} from '../utils/localStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';

const screenWidth= Dimensions.get('screen').width
const screenHeight= Dimensions.get('screen').height

const basicIconList = [
  {icon:require('../assets/icons/delivery-man.png'), iconUrl:'https://cdn-icons-png.flaticon.com/512/2830/2830175.png', description:"배달"},
  {icon:require('../assets/icons/cheers.png'), iconUrl:'https://cdn-icons.flaticon.com/png/512/2058/premium/2058805.png?token=exp=1639145839~hmac=234bad7409f75ac8be3c226e4a3b08e0', description:"술"},
  {icon:require('../assets/icons/fried-rice.png'), iconUrl:'https://cdn-icons.flaticon.com/png/512/2515/premium/2515157.png?token=exp=1639145859~hmac=73d0421d6efd58c43f758d7bef9a6f01', description:"밥"},
  {icon:require('../assets/icons/coffee-cup.png'), iconUrl:'https://cdn-icons-png.flaticon.com/512/751/751621.png', description:"카페"},
  {icon:require('../assets/icons/game-controller.png'), iconUrl:'https://cdn-icons-png.flaticon.com/512/2972/2972351.png', description:"게임"},
  {icon:require('../assets/icons/steering-wheel.png'), iconUrl:'https://cdn-icons-png.flaticon.com/512/1581/1581955.png', description:"드라이브"},
  {icon:require('../assets/icons/hey.png'), iconUrl:'https://cdn-icons.flaticon.com/png/512/4081/premium/4081196.png?token=exp=1639147100~hmac=d3a6d1e8c0e4676e67dbcde746ecb410', description:"헤이"},
  {icon:require('../assets/icons/open-book.png'), iconUrl:'https://cdn-icons.flaticon.com/png/512/2280/premium/2280151.png?token=exp=1639146939~hmac=c6a5b554815e5ef1a7c3d974a52059d1', description:"공부"}
]


const PushScreen = () => {

  const {selectedFriend, userInfo} = useContext(StackContext);
  const [isDisabled,setIsDisabled] = useState<any>(false)
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
      <View style={{...styles.pushStyle, overflow: Platform.OS === 'android' ? 'hidden' : 'visible', width:screenWidth*0.40, height:screenWidth*0.40,backgroundColor:isDisabled ? 'gray' : 'white'}}>
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
            console.log(value)
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
            <TouchableNativeFeedback disabled={isDisabled} onPress={()=>{setModalState({isVisible:true,data:item,index:index}), setEditData({title:item.title, body:item.body, icon:''})}}
              background={TouchableNativeFeedback.Ripple('#00000040', false)} useForeground={true}>
              {pushItem}
            </TouchableNativeFeedback> 
            :
            <TouchableOpacity disabled={isDisabled} onPress={()=>{setModalState({isVisible:true,data:item,index:index}), setEditData({title:item.title, body:item.body, icon:''})}}>
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
        <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
          {modalState.data &&
            <View style={{...styles.modalStyle,height:screenHeight*0.6, width:screenWidth*0.9}}>
              <View style={styles.inputViewStyle}>  
                <Text style={styles.editTextStyle}>title: </Text>
                <TextInput style={{...styles.inputStyle,width:screenWidth*0.6}} value={editData.title} onChangeText={(text)=>setEditData({...editData,title:text})}/>
              </View>  
              <View style={styles.inputViewStyle}>  
                <Text style={styles.editTextStyle}>body: </Text>
                <TextInput style={{...styles.inputStyle,width:screenWidth*0.6}} value={editData.body} onChangeText={(text)=>setEditData({...editData,body:text})}/>
              </View>  
              <View style={{backgroundColor:'yellow'}}>  
                <FlatList
                  data={basicIconList}
                  horizontal
                  renderItem={iconCarouselRender}
                />
                </View>
                <Button title={"닫기"} onPress={()=>{setModalState({isVisible:false}), setEditData({title:'',body:'',icon:''})}}/>
                <Button title={modalState.data.checker ? "추가" : "수정"} onPress={()=>{
                  (editData.title !=='' && editData.body!=='' && editData.icon !== '')
                  ? (
                  pushList[modalState.index] = {icon:editData.icon.icon,iconUrl:editData.icon.iconUrl,title:editData.title,body:editData.body},
                  setPushCustom(JSON.stringify(pushList)),
                  setPushList([...pushList]),
                  getPushList(),
                  setEditData({title:'',body:'',icon:''}),
                  setModalState({isVisible:false})
                  ) : (Alert.alert("모든 내용을 입력해주세요"))
                  }}/>
                
                {!modalState.data.checker && (
                  <Button title={"삭제"} onPress={()=>{
                    pushList.splice(modalState.index,1)
                    setPushCustom(JSON.stringify(pushList))
                    setPushList([...pushList])
                    getPushList()
                    setModalState({isVisible:false})
                  }}/>
                )}
            </View>
          }
        </View>
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
  modalStyle:{
    backgroundColor:'white',
    justifyContent:'center', 
    // alignItems:'center',
    borderWidth:3,
    borderRadius:15,
  },
  inputViewStyle:{
    flexDirection:'row', 
    // borderWidth:3, 
    alignItems:'center',
    paddingLeft:15,
  },
  editTextStyle:{
    fontSize:20
  },
  inputStyle:{
    borderWidth:1, 
    paddingLeft:15,
    marginLeft:5, 
    fontSize:20
  },
  iconCarouselStyle:{
    marginVertical:10,
    marginHorizontal:3, 
    justifyContent:'center', 
    alignItems:'center',
    borderWidth:2,
    borderRadius:10
  }
});

export default PushScreen;
