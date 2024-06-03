import React from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const WebViewScreen = ({ route }) => {
  const params = route.params;
  const uri = params.uri;

  return <WebView source={{ uri: uri }} style={{ flex: 1 }} />;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  mainview: {
    flex: 1,
  },
});
// Make sure to export your components
export default WebViewScreen;
