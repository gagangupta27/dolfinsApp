import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import AskScreen from "../screens/ask/AskScreen";
import CalendarEventScreen from "../screens/calendar/CalendarEventScreen";
import ContactScreen from "../screens/contact/ContactScreen";
import HomeScreen from "../screens/home/HomeScreen";
import ImagePreviewScreen from "../screens/imagepreview/ImagePreviewScreen";
import LoginScreen from "../screens/login/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import PDFPreviewScreen from "../screens/pdfpreview/PDFPreviewScreen";
import React from "react";
import { RootState } from "../redux/store";
import { Storage } from "../utils/storage";
import WebViewScreen from "../screens/webview/WebViewScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { setAuthData } from "../redux/reducer/app";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

function LoggedOutStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

function LoggedInStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AskScreen" component={AskScreen} />
      <Stack.Screen name="ContactScreen" component={ContactScreen} />
      <Stack.Screen name="WebViewScreen" component={WebViewScreen} />
      <Stack.Screen name="ImagePreviewScreen" component={ImagePreviewScreen} />
      <Stack.Screen name="PDFPreviewScreen" component={PDFPreviewScreen} />
      <Stack.Screen
        name="CalendarEventScreen"
        component={CalendarEventScreen}
      />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  const authData = useSelector((state: RootState) => state.app.authData);
  const dispatch = useDispatch();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    return Font.loadAsync({
      "WorkSans-Regular": require("../assets/Work_Sans/static/WorkSans-Regular.ttf"),
      "WorkSans-Bold": require("../assets/Work_Sans/static/WorkSans-Bold.ttf"),
      "WorkSans-Italic": require("../assets/Work_Sans/static/WorkSans-Italic.ttf"),
      "WorkSans-Medium": require("../assets/Work_Sans/static/WorkSans-Medium.ttf"),
      "WorkSans-SemiBold": require("../assets/Work_Sans/static/WorkSans-SemiBold.ttf"),
      Courier: require("../assets/Courier_Prime/CourierPrime-Regular.ttf"),
      "Courier-Italic": require("../assets/Courier_Prime/CourierPrime-Italic.ttf"),
      "Courier-Bold": require("../assets/Courier_Prime/CourierPrime-Bold.ttf"),
      "Roboto_Mono-Regular": require("../assets/Roboto_Mono/static/RobotoMono-Regular.ttf"),
      "Roboto_Mono-Italic": require("../assets/Roboto_Mono/static/RobotoMono-Italic.ttf"),
      "Roboto_Mono-Bold": require("../assets/Roboto_Mono/static/RobotoMono-Bold.ttf"),
      "Inter-Regular": require("../assets/Inter/static/Inter-Regular.ttf"),
      "Inter-Bold": require("../assets/Inter/static/Inter-Bold.ttf"),
      "Urbanist-Medium": require("../assets/Urbanist/static/Urbanist-Medium.ttf"),
      "Urbanist-Regular": require("../assets/Urbanist/static/Urbanist-Regular.ttf"),
      "Urbanist-Bold": require("../assets/Urbanist/static/Urbanist-Bold.ttf"),
    });
  };

  useEffect(() => {
    (async () => {
      await SplashScreen.preventAutoHideAsync();
      const authData = await Storage.getItem("authData");
      if (authData) {
        dispatch(setAuthData(JSON.parse(authData as string)));
      }
      await loadFonts();
      await SplashScreen.hideAsync();
      setFontsLoaded(true);
    })();
  }, []);

  const linking = {
    prefixes: ["dolfins://"],
    config: {
      screens: {
        LoginScreen: "login",
        HomeScreen: "home",
      },
    },
  };

  const currentTime = new Date().getTime();
  const isLoggedIn = authData;

  return fontsLoaded ? (
    <View style={styles.container}>
      <NavigationContainer linking={linking}>
        {isLoggedIn ? <LoggedInStack /> : <LoggedOutStack />}
      </NavigationContainer>
    </View>
  ) : (
    <View></View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
