    
 export const addRequest =(target)=>{

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
        // "notification":{
        //   content_available: true,
        // },
        "priority":"high",
        "content_available": true
        })
        })
 }   

 export const acceptRequest =(target,name)=>{
  //  console.log(target)
  //  console.log(name)

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
        // "notification":{
        //   content_available: true,
        // },
        "priority":"high",
        "content_available": true
      })
      })
}   

 export const goPush =(target,name,purpose)=>{

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
        // "notification":{
          // content_available: true,
        // },
        "priority":"high",
        "content_available": true
      })
      })
}   
  