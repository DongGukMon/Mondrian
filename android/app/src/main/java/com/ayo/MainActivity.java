package com.ayo;


import com.facebook.react.ReactActivity;
import android.os.Bundle;

import org.devio.rn.splashscreen.SplashScreen; // splash

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "AYO";
  }

  @Override
protected void onCreate(Bundle savedInstanceState) {
  SplashScreen.show(this); //splash
  super.onCreate(null);
}
}
