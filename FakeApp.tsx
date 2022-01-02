import {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen'

const FakeApp = () => {
  useEffect(() => {
      SplashScreen.hide();
  }, []);

  return null;
}

export default FakeApp;