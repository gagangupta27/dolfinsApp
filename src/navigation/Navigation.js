import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import AskScreen from "../screens/ask/AskScreen.jsx";
import CalendarEventScreen from "../screens/calendar/CalendarEventScreen.jsx";
import ContactScreen from "../screens/contact/ContactScreen.jsx";
import HomeScreen from "../screens/home/HomeScreen.jsx";
import ImagePreviewScreen from "../screens/imagepreview/ImagePreviewScreen.jsx";
import LoginScreen from "../screens/login/LoginScreen.js";
import Menu from "../screens/profile/Menu.js";
import { NavigationContainer } from "@react-navigation/native";
import OrganisationScreen from "../screens/organisation/OrganisationScreen.jsx";
import PDFPreviewScreen from "../screens/pdfpreview/PDFPreviewScreen.jsx";
import React from "react";
import { Storage } from "../utils/storage.js";
import WebViewScreen from "../screens/webview/WebViewScreen.jsx";
import { createStackNavigator } from "@react-navigation/stack";
import { setAuthData } from "../redux/reducer/app.js";

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
            <Stack.Screen name="OrganisationScreen" component={OrganisationScreen} />
            <Stack.Screen name="Menu" component={Menu} />
            <Stack.Screen name="CalendarEventScreen" component={CalendarEventScreen} />
        </Stack.Navigator>
    );
}

export default function Navigation() {
    const authData = useSelector((state) => state.app.authData);
    const dispatch = useDispatch();
    const [fontsLoaded, setFontsLoaded] = useState(false);

    const [loaded, error] = Font.useFonts({
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

    useEffect(() => {
        (async () => {
            if (loaded || error) {
                await SplashScreen.preventAutoHideAsync();
                const authData = await Storage.getItem("authData");
                if (authData) {
                    dispatch(setAuthData(JSON.parse(authData)));
                }
                setFontsLoaded(true);
            }
        })();
    }, [loaded, error]);

    const linking = {
        prefixes: ["dolfins://"],
        config: {
            screens: {
                LoginScreen: "login",
                HomeScreen: "home",
            },
        },
    };

    return fontsLoaded ? (
        <View style={styles.container}>
            <NavigationContainer linking={linking}>
                {authData ? <LoggedInStack /> : <LoggedOutStack />}
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
