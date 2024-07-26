import { AntDesign, Entypo } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import FeedBackModal from "../../components/Profile/FeedBackModal";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Header from "../../components/common/Header";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ProfileModal from "../../components/ProfileModal";
import WebViewV2 from "../webview/WebViewV2";
import { setAuthData } from "../../redux/reducer/app";

const Menu = ({ route }) => {
  const authData = useSelector((state) => state.app.authData);

  console.log("authData", authData);

  const dispatch = useDispatch();
  const _webViewRef = useRef();
  const _profileRef = useRef();
  const _feedBackRef = useRef();

  const menuData = [
    {
      icon: () => <AntDesign name="user" size={24} color="black" />,
      manuName: "My Profile",
      route: "ProfileSetup",
      onPress: () => {
        _profileRef?.current?.show();
      },
    },
    {
      icon: () => <Entypo name="text-document" size={24} color="black" />,
      manuName: "Terms & Conditions",
      route: "TermConditions",
      onPress: () => {
        _webViewRef?.current?.show("https://dolfins.ai/tnc.html");
      },
    },
    {
      icon: () => <Entypo name="text-document" size={24} color="black" />,
      manuName: "Privacy Policy",
      route: "PrivacyPolicy",
      onPress: () => {
        _webViewRef?.current?.show("https://dolfins.ai/privacy.html");
      },
    },
    {
      icon: () => <FontAwesome6 name="discord" size={24} color="black" />,
      manuName: "Contact Us",
      route: "PrivacyPolicy",
      onPress: () => {
        _webViewRef?.current?.show("https://dolfins.ai/privacy.html");
      },
    },
    {
      icon: () => <MaterialIcons name="feedback" size={24} color="black" />,
      manuName: "FeedBack",
      route: "PrivacyPolicy",
      onPress: () => {
        _feedBackRef?.current?.show();
      },
    },
    {
      icon: () => <AntDesign name="logout" size={24} color="black" />,
      manuName: "Logout",
      onPress: () => {
        dispatch(setAuthData());
      },
    },
    {
      icon: () => <AntDesign name="delete" size={24} color="black" />,
      manuName: "Delete Account",
    },
  ];

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={64}
      behavior="padding"
      style={{ flex: 1 }}
    >
      <Header showShadow={false} />
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          padding: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Image
            source={{ uri: authData?.picture }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 100,
              backgroundColor: "black",
              marginRight: 16,
            }}
          />
          <View>
            {(authData?.name || authData?.fullName?.givenName) && (
              <Text>{`${
                authData?.name || authData?.fullName?.givenName
              }`}</Text>
            )}
            {authData?.email && <Text>{authData?.email || ""}</Text>}
            {authData?.phone && <Text>{authData?.phone}</Text>}
          </View>
        </View>
        <View
          style={{
            paddingTop: 20,
          }}
        >
          {menuData?.map((item) => {
            return (
              <TouchableOpacity
                key={item.manuName}
                onPress={() => (item?.onPress ? item.onPress() : {})}
                style={styles.menuContainer}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ paddingHorizontal: 16 }}>{item?.icon()}</View>
                  <Text
                    style={{
                      color: "black",
                    }}
                  >
                    {item.manuName}
                  </Text>
                </View>
                <View style={{ paddingRight: 16 }}>
                  <Entypo name="chevron-right" size={24} color="black" />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <WebViewV2 ref={_webViewRef} />
      <ProfileModal ref={_profileRef} />
      <FeedBackModal ref={_feedBackRef} />
    </KeyboardAvoidingView>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container1: {
    flexDirection: "row",
    backgroundColor: "white",
    marginVertical: 8,
  },
  profileDataContainer: {
    justifyContent: "space-between",
    flex: 1,
    paddingRight: 16,
  },
  menuContainer: {
    flexDirection: "row",
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 2,
    borderColor: "#F7F7F7",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
