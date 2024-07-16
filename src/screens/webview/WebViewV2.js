import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, View } from "react-native";
import { WebView } from "react-native-webview";
import Header from "../../components/common/Header";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const WebViewV2 = forwardRef(({}, ref) => {
  const [uri, setUri] = useState("");
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    show,
  }));

  const show = (uri) => {
    setUri(uri);
    setVisible(true);
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
            <WebView source={{ uri: uri }} style={{ flex: 1 }} />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
});

export default WebViewV2;
