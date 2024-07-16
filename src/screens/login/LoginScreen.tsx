import * as AuthSession from "expo-auth-session";

import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign, Entypo } from "@expo/vector-icons";

import Animated from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { RootState } from "../../redux/store";
import auth0 from "../../utils/auth";
import { identify } from "../../utils/analytics";
import { setAuthData } from "../../redux/reducer/app";
import { useAuth0 } from "react-native-auth0";
import { useTrackWithPageInfo } from "../../utils/analytics";

const width = Dimensions.get("window").width;

const DATA = [
  {
    src: require("../../assets/Onboarding2.webp"),
    title: "Converse",
    style: { width: 298, height: 292 },
  },
  {
    src: require("../../assets/Onboarding1.webp"),
    title: "Contextualize",
    style: { width: 331, height: 274 },
  },
  {
    src: require("../../assets/Onboarding3.webp"),
    title: "Connect ",
    style: { width: 293, height: 293.6 },
  },
];

const LoginScreen = () => {
  const track = useTrackWithPageInfo();

  const { authorize } = useAuth0();
  const [currentIndex, setCurrentIndex] = useState(0);
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
        dispatch(setAuthData({ ...newCredentials, ...user }));
      }
    } catch (e) {
      handleLoginFailure(e);
    }
  };

  const _carouselRef = useRef(null);

  const handleLoginFailure = (e) => {
    track("Login Failure", { Reason: e.toString() });
  };

  const nextStep = () => {
    const currentIdx = _carouselRef.current?.getCurrentIndex() || currentIndex;
    setCurrentIndex(currentIdx + 1);
    _carouselRef.current.next({ count: 1, animated: true });
  };

  const LoginPage = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 60, marginBottom: 100 }}>
        dolfins.ai
      </Text>
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
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
          padding: 16,
          flexDirection: "row",
          marginTop: 50,
        }}
      >
        <AntDesign name="apple1" size={24} color="white" />
        <Text
          style={{
            fontFamily: "Urbanist-Bold",
            color: "white",
            fontSize: 16,
            paddingLeft: 16,
          }}
        >
          Apple Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          marginTop: 100,
        }}
      >
        {currentIndex == 3 && <LoginPage />}
        {currentIndex != 3 && (
          <>
            <Carousel
              width={width}
              enabled={false}
              ref={_carouselRef}
              height={500}
              autoPlay={false}
              data={DATA}
              scrollAnimationDuration={1000}
              onSnapToItem={(index: number) => setCurrentIndex(index)}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  <Image source={item?.src} style={item.style} />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 36,
                      color: "#040404",
                      marginTop: 52,
                    }}
                  >
                    {item?.title}
                  </Text>
                </View>
              )}
            />
            <View
              style={{
                position: "absolute",
                padding: 38,
                bottom: 0,
                width: "100%",
              }}
            >
              <View
                style={[
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingBottom: 40,
                  },
                ]}
              >
                {DATA &&
                  Array.isArray(DATA) &&
                  DATA?.map((item, index) => (
                    <Animated.View
                      key={index}
                      style={{
                        backgroundColor:
                          currentIndex == index ? "#040404" : "#D9D9D9",
                        borderRadius: 100,
                        marginHorizontal: 5,
                        height: 8,
                        width: currentIndex == index ? 25 : 8,
                      }}
                    ></Animated.View>
                  ))}
              </View>
              <TouchableOpacity
                style={{
                  width: "100%",
                  backgroundColor: "#040404",
                  padding: 10,
                  borderRadius: 15,
                }}
                activeOpacity={0.8}
                onPress={nextStep}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#FCFCFC",
                    textAlign: "center",
                  }}
                >
                  NEXT
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
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
