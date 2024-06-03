import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Dimensions } from "react-native";
import * as FileSystem from "expo-file-system";
import { WebView } from "react-native-webview";

const convertToBase64 = async (uri) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error("Error reading file", error);
  }
};

const PDFPreviewScreen = ({ route }) => {
  const uri = route.params.uri;
  const [pdfBase64, setPdfBase64] = useState("");

  useEffect(() => {
    const loadPdf = async () => {
      const base64String = await convertToBase64(uri);
      setPdfBase64(base64String);
    };

    loadPdf();
  }, [uri]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <WebView
        originWhitelist={["*"]}
        source={{
          html: `<iframe src="data:application/pdf;base64,${pdfBase64}" style="width:100%; height:100%;" frameborder="0" scrolling="yes"></iframe>`,
        }}
        style={styles.webview}
        scalesPageToFit={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  webview: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default PDFPreviewScreen;
