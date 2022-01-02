    
 export const addRequestAndroid =(target)=>{

    fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          "Accept": 'application/json',
          'Content-Type': 'application/json',
          "Authorization": 'key='+`AAAAiohny80:APA91bH_71VhDRhTbJaI40rGhCyxejmUrpIw5FKB2-Om66_q_OojMzgLkuVTuse-9bGWHELcqloWIJd6dblE1knxieMlTF2JrScSqLotOPWVurK64UBoX5jfGS1Az2-ybNOojInNlBQc`,
        },
        body: JSON.stringify({
          "to": target,
          "data":{
            "title": "Mondrian",
            "body": "새로운 친구 요청이 왔습니다",
            "type": "FriendReq",
          },
          "content_available": true,
          "priority":"high",
        })
        })
 }   

     
 export const addRequestIos =(target)=>{

  fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        'Content-Type': 'application/json',
        "Authorization": 'key='+`AAAAiohny80:APA91bH_71VhDRhTbJaI40rGhCyxejmUrpIw5FKB2-Om66_q_OojMzgLkuVTuse-9bGWHELcqloWIJd6dblE1knxieMlTF2JrScSqLotOPWVurK64UBoX5jfGS1Az2-ybNOojInNlBQc`,
      },
      body: JSON.stringify({
        "to": target,
        "data":{
          "title": "Mondrian",
          "body": "새로운 친구 요청이 왔습니다",
          "type": "FriendReq",
        },
        "content_available": true,
        "priority":"high",
        notification:{
          "title":"Mondrian",
          "body":"새로운 친구 요청이 왔습니다",
          "sound":"default",
        },
      })
      })
}   


 export const acceptRequestAndroid =(target,name)=>{

  fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        'Content-Type': 'application/json',
        "Authorization": 'key='+`AAAAiohny80:APA91bH_71VhDRhTbJaI40rGhCyxejmUrpIw5FKB2-Om66_q_OojMzgLkuVTuse-9bGWHELcqloWIJd6dblE1knxieMlTF2JrScSqLotOPWVurK64UBoX5jfGS1Az2-ybNOojInNlBQc`,
      },
      body: JSON.stringify({
        "to": target,
        "data":{
          "title": "Mondrian",
          "body": name+"님이 요청을 수락하셨습니다",
          "type": "acceptReq",
        },
        "content_available": true,
        "priority":"high"
      })
      })
}   

export const acceptRequestIos =(target,name)=>{

  fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        'Content-Type': 'application/json',
        "Authorization": 'key='+`AAAAiohny80:APA91bH_71VhDRhTbJaI40rGhCyxejmUrpIw5FKB2-Om66_q_OojMzgLkuVTuse-9bGWHELcqloWIJd6dblE1knxieMlTF2JrScSqLotOPWVurK64UBoX5jfGS1Az2-ybNOojInNlBQc`,
      },
      body: JSON.stringify({
        "to": target,
        "data":{
          "title": "Mondrian",
          "body": name+"님이 요청을 수락하셨습니다",
          "type": "acceptReq",
        },
        "notification":{
          "title": "Mondrian",
          "body": name+"님이 요청을 수락하셨습니다",
          "sound":"default"
        },
        "content_available": true,
        "priority":"high"
      })
      })
}   

 export const goPushAndroid =(target,name,purpose)=>{

  fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        'Content-Type': 'application/json',
        "Authorization": 'key='+`AAAAiohny80:APA91bH_71VhDRhTbJaI40rGhCyxejmUrpIw5FKB2-Om66_q_OojMzgLkuVTuse-9bGWHELcqloWIJd6dblE1knxieMlTF2JrScSqLotOPWVurK64UBoX5jfGS1Az2-ybNOojInNlBQc`,
      },
      body: JSON.stringify({
        "to": target,
        "data":{
          "imageUrl": purpose.iconUrl,
          "title": "Mondrian",
          "pushTitle":purpose.title,
          "body": name+": "+purpose.body
        },
        "content_available": true,
        "priority":"high",
      })
      })
}   

export const goPushIos =(target,name,purpose)=>{

  fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        'Content-Type': 'application/json',
        "Authorization": 'key='+`AAAAiohny80:APA91bH_71VhDRhTbJaI40rGhCyxejmUrpIw5FKB2-Om66_q_OojMzgLkuVTuse-9bGWHELcqloWIJd6dblE1knxieMlTF2JrScSqLotOPWVurK64UBoX5jfGS1Az2-ybNOojInNlBQc`,
      },
      body: JSON.stringify({
        "to": target,
        "data":{
          "imageUrl": purpose.iconUrl,
          "title": "Mondrian",
          "pushTitle":purpose.title,
          "body": name+": "+purpose.body
        },
        notification:{
          "title":"Mondrian",
          "body":name+": "+purpose.body,
          "sound":"default",
          "subtitle":purpose.title,
        },
        "content_available": true,
        "priority":"high",
      })
      })
}   
  
  