import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultPush = [
  {icon:require('../assets/icons/delivery-man.png'), iconUrl:'http://drive.google.com/uc?export=view&id=1blpB7HcKD6kuGJ774Wigmw-ZQfkuWSlz', title:"배달",body:"배고픈데 배민 시켜먹자"},
  {icon:require('../assets/icons/cheers.png'), iconUrl:'https://drive.google.com/uc?export=view&id=1ZPcQrpRNZqDBGQdxj7i3MIDCVApqf-Kz', title:"술",body:"술 먹으러 가자"},
  {icon:require('../assets/icons/fried-rice.png'), iconUrl:'https://drive.google.com/uc?export=view&id=1QAEgXvzCygt75rx6HiKJhI9fRmcNcnUE', title:"밥",body:"밥먹었음? 밥먹으러 가자"},
  {icon:require('../assets/icons/coffee-cup.png'), iconUrl:'https://drive.google.com/uc?export=view&id=18ItEVVR-K8moYEudidUDCxhRpdJz-BAY', title:"카페",body:"카페가실?"},
  {icon:require('../assets/icons/game-controller.png'), iconUrl:'https://drive.google.com/uc?export=view&id=16hC61ICT0kTCxpVDr3St8yisITo8Tbms', title:"게임",body:"협곡에서 만나"},
  {icon:require('../assets/icons/steering-wheel.png'), iconUrl:'https://drive.google.com/uc?export=view&id=1jDRXir24Vv60-3E26TIWJlY-KlXbHRWx', title:"드라이브",body:"답답한데 오늘 드라이브 어때"}
]

export const setEnabled = async (value) => {
    try {
      await AsyncStorage.setItem('isEnabledNotification', value)
    
    } catch (e) {
      console.log(e)
    }
  }

export const getEnabled = async () => {
  try {    
    const value = await AsyncStorage.getItem('isEnabledNotification')
    if(value == null) {
      setEnabled("true")
      return "true"
    }
    return value
  } catch(e) {
    console.log(e)
  }
}

// export const getLoginChecker = async () => {
//   try {
//     const value = await AsyncStorage.getItem('loginChecker')
//     if(value == null) {
//       setLoginChecker("true")
//       return "true"
//     }
//     return value
//   } catch(e) {
//     console.log(e)
//   }
// }

// export const setLoginChecker = async (value) => {
//   try {
//     await AsyncStorage.setItem('loginChecker', value)
  
//   } catch (e) {
//     console.log(e)
//   }
// }


// {uid:{time:~~~,count:~~~}}
// 시간이 40초 경과했는지 확인
// 40초 경과 했으면 null이랑 같은 취급
// 40초 안지났으면 카운트가 10 넘었는지 확인
// 카운트 10 안넘었으면 카운트 +1

export const setPushCounter = async (uid,nowCount,startTime) =>{
  try {
    if(nowCount==0){
      var countValue = JSON.stringify({time:Date.now(),count:nowCount+1})
    }
    else{
      var countValue = JSON.stringify({time:startTime,count:nowCount+1})
    }
    await AsyncStorage.setItem(uid, countValue)
  
  } catch (e) {
    console.log(e)
  }
}

export const setPushCustom = async (value) =>{

  try {
    await AsyncStorage.setItem('pushData',value)
  } catch (e) {
    console.log(e)
  }
}


export const pushCustom = async () =>{
  try {
    var pushData = await AsyncStorage.getItem('pushData')
    if (pushData == null ){
      setPushCustom(JSON.stringify(defaultPush))
      return defaultPush
    } else{
      return JSON.parse(pushData)
    }
  } catch (e) {
    console.log(e)
  }
}

// export const setIconList = async () =>{
//   try {
//     var iconList = await AsyncStorage.getItem('iconList')
//     if (iconList == null ){
//       await AsyncStorage.setItem('iconList',JSON.stringify(basicIconList))
//       return JSON.parse(basicIconList)
//     } else{
//       return JSON.parse(basicIconList)
//     }
//   } catch (e) {
//     console.log(e)
//   }
// }


export const removeValue = async (key) => {
  try {
    await AsyncStorage.removeItem(key)
  } catch(e) {
    console.log(e)
  }

  console.log("Storage key: "+key+' -Remove Done.')
}