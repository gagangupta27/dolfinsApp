import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Animated from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";
import BottomSheetModal from "../../components/common/BottomSheetModal";
import { setAuthData } from "../../redux/reducer/app";

const Apple = require("../../assets/js/Apple.js");

export default React.forwardRef(({}, ref) => {
  const authData = useSelector((state) => state.app.authData);
  const dispatch = useDispatch();

  const _bottomSheetRef = useRef();

  React.useImperativeHandle(
    ref,
    () => ({
      show,
      hide,
    }),
    []
  );

  //   useEffect(() => {
  //     Apple?.auth?.init({
  //       clientId: "com.dolfins.ai.appleSignin", // This is the service ID we created.
  //       scope: "name email", // To tell apple we want the user name and emails fields in the response it sends us.
  //       redirectURI: "https://dolfins.netlify.app", // As registered along with our service ID
  //       state: "origin:web", // Any string of your choice that you may use for some logic. It's optional and you may omit it.
  //       usePopup: true, // Important if we want to capture the data apple sends on the client side.
  //     });
  //   }, []);

  const show = () => {
    _bottomSheetRef?.current?.show();
  };

  const hide = () => {
    _bottomSheetRef?.current?.hide();
  };

  async function onAppleButtonPress() {
    const response = await Apple?.auth?.signIn();
    console.log("response", JSON.stringify(response));
    dispatch(setAuthData(response));
  }

  return (
    <BottomSheetModal
      MAX_HEIGHT_PERC={1}
      START_PERC={0.7}
      ref={_bottomSheetRef}
      ignoreKeyboardOpen={true}
      restrictClose={true}
      disbaleGesture={true}
      containerStyle={{
        backgroundColor: "#181b1a",
      }}
    >
      <View
        style={{
          paddingTop: 8,
          paddingBottom: 20,
          padding: 16,
          minHeight: 300,
          backgroundColor: "#181b1a",
        }}
      >
        <TouchableOpacity
          onPress={onAppleButtonPress}
          style={{
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000",
            padding: 16,
            flexDirection: "row",
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
            Sign In with Apple
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
});
