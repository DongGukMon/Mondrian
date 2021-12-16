import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultPush = [
  {icon:require('../assets/icons/delivery-man.png'), iconUrl:'https://cdn-icons-png.flaticon.com/512/2830/2830175.png', title:"배달",body:"배고픈데 배민 시켜먹자"},
  {icon:require('../assets/icons/cheers.png'), iconUrl:'https://cdn-icons.flaticon.com/png/512/2058/premium/2058805.png?token=exp=1639145839~hmac=234bad7409f75ac8be3c226e4a3b08e0', title:"술",body:"술 먹으러 가자"},
  {icon:require('../assets/icons/fried-rice.png'), iconUrl:'https://cdn-icons.flaticon.com/png/512/2515/premium/2515157.png?token=exp=1639145859~hmac=73d0421d6efd58c43f758d7bef9a6f01', title:"밥",body:"밥먹었음? 밥먹으러 가자"},
  {icon:require('../assets/icons/coffee-cup.png'), iconUrl:'https://cdn-icons-png.flaticon.com/512/751/751621.png', title:"카페",body:"카페가실?"},
  {icon:require('../assets/icons/game-controller.png'), iconUrl:'https://cdn-icons-png.flaticon.com/512/2972/2972351.png', title:"게임",body:"협곡에서 만나"},
  {icon:require('../assets/icons/steering-wheel.png'), iconUrl:'https://cdn-icons-png.flaticon.com/512/1581/1581955.png', title:"드라이브",body:"답답한데 오늘 드라이브 어때"}
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

export const getLoginChecker = async () => {
  try {
    const value = await AsyncStorage.getItem('loginChecker')
    if(value == null) {
      setLoginChecker("true")
      return "true"
    }
    return value
  } catch(e) {
    console.log(e)
  }
}

export const setLoginChecker = async (value) => {
  try {
    await AsyncStorage.setItem('loginChecker', value)
  
  } catch (e) {
    console.log(e)
  }
}


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