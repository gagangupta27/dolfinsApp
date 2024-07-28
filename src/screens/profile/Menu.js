import { AntDesign, Entypo } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Fontisto from "@expo/vector-icons/Fontisto";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import FeedBackModal from "../../components/Profile/FeedBackModal";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Header from "../../components/common/Header";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ProfileModal from "../../components/ProfileModal";
import WebViewV2 from "../webview/WebViewV2";
import { setAuthData } from "../../redux/reducer/app";
import * as CloudStore from "react-native-cloud-store";
import ExportImportModal from "./ExportImportModal";

const Menu = ({ route }) => {
  const authData = useSelector((state) => state.app.authData);

  const dispatch = useDispatch();
  const _webViewRef = useRef();
  const _profileRef = useRef();
  const _feedBackRef = useRef();
  const _exportImportRef = useRef();

  useEffect(() => {
    (async () => {
      const available = await CloudStore.isICloudAvailable();
      console.log("available", available);
      /*       await CloudStore.writeFile(filePathForWrite, fileContentForWrite, {
        override: true,
      }); */
    })();
  }, []);

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
      icon: () => <Fontisto name="export" size={24} color="black" />,
      manuName: "Export Data",
      onPress: () => {
        _exportImportRef?.current?.exportData();
      },
    },
    {
      icon: () => <Fontisto name="import" size={24} color="black" />,
      manuName: "Import Data",
      onPress: () => {},
    },
    {
      icon: () => <FontAwesome5 name="sync-alt" size={24} color="black" />,
      manuName: "Sync iCould",
      onPress: () => {},
    },
    {
      icon: () => <FontAwesome6 name="discord" size={24} color="black" />,
      manuName: "Contact Us",
      onPress: () => {
        Linking.openURL("https://discord.com/channels/@me/1266497641089335348");
      },
    },
    {
      icon: () => <MaterialIcons name="feedback" size={24} color="black" />,
      manuName: "FeedBack",
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
      <ExportImportModal ref={_exportImportRef} />
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
