import * as AuthSession from "expo-auth-session";

import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef } from "react";
import Svg, { Rect } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../redux/store";
import { Storage } from "../../utils/storage";
import Swiper from "react-native-swiper";
import auth0 from "../../utils/auth";
import { identify } from "../../utils/analytics";
import { setAuthData } from "../../redux/reducer/app";
import { useAuth0 } from "react-native-auth0";
import { useTrackWithPageInfo } from "../../utils/analytics";

const LoginScreen = ({ navigation }) => {
  const track = useTrackWithPageInfo();

  const { authorize } = useAuth0();

  const authData = useSelector((state: RootState) => state.app.authData);
  const dispatch = useDispatch();

  const redirectUri = AuthSession.makeRedirectUri({ path: "login" });

  const onPress = async () => {
    try {
      if (authData && authData.refreshToken) {
        // Token has expired, attempt re-authentication
        const newCredentials = await auth0.auth.refreshToken({
          refreshToken: authData.refreshToken,
          scope: "openid profile email offline_access",
        });
        const user = await auth0.auth.userInfo({
          token: newCredentials.accessToken,
        });
        const updatedAuthData = {
          ...authData,
          ...newCredentials,
        };

        identify(user.email, user);

        track("Login Success Using Refresh Token");
        dispatch(setAuthData(updatedAuthData));
        await Storage.setItem("authData", JSON.stringify(updatedAuthData));
      } else {
        const newCredentials = await authorize({
          redirectUrl: redirectUri,
          scope: "openid profile email offline_access",
        });
        const user = await auth0.auth.userInfo({
          token: newCredentials.accessToken,
        });
        identify(user.email, user);
        track("Login Success");
        dispatch(setAuthData(newCredentials));
        await Storage.setItem("authData", JSON.stringify(newCredentials));
      }
    } catch (e) {
      handleLoginFailure(e);
    }
  };

  const swiperRef = useRef(null);

  const handleLoginFailure = (e) => {
    track("Login Failure", { Reason: e.toString() });
  };

  const nextStep = () => {
    swiperRef.current.scrollBy(1);
  };

  const screenWidth = Dimensions.get("window").width;

  const OnboardingPage1 = () => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Image
        source={require("../../assets/onboarding1_resize.png")}
        style={{
          marginVertical: 10,
          width: screenWidth * 0.9,
          height: screenWidth * 0.9,
        }}
        resizeMode="contain"
      />
      <Text
        style={{
          marginHorizontal: 20,
          marginVertical: 10,
          color: "#7879F1",
          fontSize: 24,
          fontFamily: "WorkSans-Medium",
        }}
      >
        This is your Note corner
      </Text>
      <Text
        style={{
          minHeight: 90,
          marginHorizontal: 20,
          marginVertical: 20,
          color: "#59606E",
          fontFamily: "WorkSans-Medium",
          fontSize: 18,
        }}
      >
        Understand your customers better. Let’s close more deals.
      </Text>
      <View
        style={{
          marginVertical: 20,
          marginHorizontal: 20,
          flexDirection: "row",
          paddingHorizontal: 15,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <Svg width="58" height="8" viewBox="0 0 58 8" fill="none">
            <Rect x="0.5" width="33" height="8" rx="4" fill="#7879F1" />
            <Rect x="37.5" width="8" height="8" rx="4" fill="#D9D9D9" />
            <Rect x="49.5" width="8" height="8" rx="4" fill="#D9D9D9" />
          </Svg>
        </View>
        <TouchableOpacity onPress={nextStep}>
          <Image
            source={require("../../assets/Next.png")}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const OnboardingPage2 = () => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Image
        source={require("../../assets/onboarding2_resize.png")}
        style={{
          marginVertical: 10,
          width: screenWidth * 0.9,
          height: screenWidth * 0.9,
        }}
        resizeMode="contain"
      />
      <Text
        style={{
          marginHorizontal: 20,
          marginVertical: 10,
          color: "#7879F1",
          fontSize: 24,
          fontFamily: "WorkSans-Medium",
        }}
      >
        Sync and add notes on the go
      </Text>
      <Text
        style={{
          minHeight: 90,
          marginHorizontal: 20,
          marginVertical: 20,
          color: "#59606E",
          fontFamily: "WorkSans-Medium",
          fontSize: 18,
        }}
      >
        Instantly add notes during travels, events, or meetings. Sync contacts
        effortlessly with LinkedIn and your calendar.
      </Text>
      <View
        style={{
          marginVertical: 20,
          marginHorizontal: 20,
          flexDirection: "row",
          paddingHorizontal: 15,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <Svg width="58" height="8" viewBox="0 0 58 8" fill="none">
            <Rect x="0.5" width="8" height="8" rx="4" fill="#D9D9D9" />
            <Rect x="12.5" width="33" height="8" rx="4" fill="#7879F1" />
            <Rect x="49.5" width="8" height="8" rx="4" fill="#D9D9D9" />
          </Svg>
        </View>
        <TouchableOpacity onPress={nextStep}>
          <Image
            source={require("../../assets/Next.png")}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const OnboardingPage3 = () => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Image
        source={require("../../assets/onboarding3_resize.png")}
        style={{
          marginVertical: 10,
          width: screenWidth * 0.9,
          height: screenWidth * 0.9,
        }}
        resizeMode="contain"
      />
      <Text
        style={{
          marginHorizontal: 20,
          marginVertical: 10,
          color: "#7879F1",
          fontSize: 24,
          fontFamily: "WorkSans-Medium",
        }}
      >
        Connect Better, Sell Smarter
      </Text>
      <Text
        style={{
          minHeight: 90,
          marginHorizontal: 20,
          marginVertical: 20,
          color: "#59606E",
          fontFamily: "WorkSans-Medium",
          fontSize: 18,
        }}
      >
        With Dolfin's AI assistant, remember little details that make big
        differences.
      </Text>
      <View
        style={{
          marginVertical: 20,
          marginHorizontal: 20,
          flexDirection: "row",
          paddingHorizontal: 15,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <Svg width="58" height="8" viewBox="0 0 58 8" fill="none">
            <Rect x="0.5" width="8" height="8" rx="4" fill="#D9D9D9" />
            <Rect x="12.5" width="8" height="8" rx="4" fill="#D9D9D9" />
            <Rect x="24.5" width="33" height="8" rx="4" fill="#7879F1" />
          </Svg>
        </View>
        <TouchableOpacity onPress={nextStep}>
          <Image
            source={require("../../assets/Next.png")}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const LoginPage = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        source={require("../../assets/Dolfins.png")}
        style={{
          marginVertical: 10,
          width: screenWidth * 0.8,
          height: screenWidth * 0.8,
        }}
        resizeMode="contain"
      />
      <View
        style={{
          width: "80%",
          marginTop: 20,
          paddingVertical: 5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: "Urbanist-Regular",
            color: "#59606E",
          }}
        >
          Let's sign you in
        </Text>
      </View>

      <TouchableOpacity
        onPress={onPress}
        style={{
          width: "80%",
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 50,
          backgroundColor: "#7879F1",
          padding: 16,
        }}
      >
        <Text
          style={{ fontFamily: "Urbanist-Bold", color: "white", fontSize: 16 }}
        >
          Sign In/Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    return (
      <Swiper
        ref={swiperRef}
        loop={false}
        showsButtons={false}
        showsPagination={false}
      >
        <OnboardingPage1 />
        <OnboardingPage2 />
        <OnboardingPage3 />
        <LoginPage />
      </Swiper>
    );
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});

export default LoginScreen;
