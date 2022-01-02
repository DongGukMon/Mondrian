/**
 * @format
 */
import React from 'react';

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import PushNotification from "react-native-push-notification";
import messaging from '@react-native-firebase/messaging';
import {getEnabled} from './utils/localStorage'


import FakeApp from './FakeApp'


messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  var isEnabled = await getEnabled()
  
  if(isEnabled=="true"){
    Platform.OS === 'android' && PushNotification.localNotification({
      channelId:"channel-id",
      title:Platform.OS==="android" ?remoteMessage.data?.pushTitle : remoteMessage.data?.title,
      subtitle:remoteMessage.data?.pushTitle,
      color:'#CE85F8',
      smallIcon: "ic_notification",
      message:remoteMessage.data?.body,
      picture:Platform.OS==='ios' && remoteMessage.data.imageUrl,
      largeIconUrl:remoteMessage.data.imageUrl,
      data:remoteMessage.data
    })
  }

});

PushNotification.createChannel(
    {
      channelId: "channel-id", // (required)
      channelName: "My channel", // (required)
     
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );





function HeadlessCheck({ isHeadless }) {
  console.log(isHeadless)
  if (isHeadless) {
    console.log("Headless");
    // return <App/>;
    return <FakeApp/>;  {/* Notice this component, it is not the App Component but a different one*/}
  }

  return <App/>;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);


// AppRegistry.registerComponent(appName, () => App);


