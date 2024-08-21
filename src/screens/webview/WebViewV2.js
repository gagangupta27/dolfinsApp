import * as WebBrowser from "expo-web-browser";

import { Modal, Platform, View } from "react-native";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import Buttons from "../../components/Buttons/Buttons";
import Header from "../../components/common/Header";
import { WebView } from "react-native-webview";

const AppleLogin = require("../../assets/html/AppleLogin.html");

const WebViewV2 = forwardRef(({}, ref) => {
  const [uri, setUri] = useState("");
  const [html, setHtml] = useState();
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    show,
    showHtml,
  }));

  const showHtml = (html) => {
    setHtml(html);
    setVisible(true);
  };

  const show = (uri) => {
    setUri(uri);
    setVisible(true);
  };

  const _handlePressButtonAsync = async () => {
    let result = await WebBrowser.openBrowserAsync("https://expo.dev");
    setResult(result);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setVisible(false)}
    >
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
          <View
            style={{
              flex: 1,
            }}
          >
            <Header
              subConatinerStyle={{ paddingTop: 0 }}
              onBackPress={() => setVisible(false)}
              showShadow={false}
            />
            <Buttons
              text="Apple Login"
              onPress={async () => {
                try {
                  const response = await window?.AppleID?.auth?.signIn();
                  console.log("response", response);
                } catch (err) {
                  console.log("err", err);
                }
              }}
            />
            {Platform.OS == "ios" && (
              <WebView
                source={{
                  ...(uri ? { uri: uri } : {}),
                  ...(html ? { html: html } : {}),
                }}
                style={{ flex: 1 }}
              />
            )}
            {Platform.OS == "web" && (
              <>
                <p>asdfghjk</p>
              </>
            )}
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
});

export default WebViewV2;
