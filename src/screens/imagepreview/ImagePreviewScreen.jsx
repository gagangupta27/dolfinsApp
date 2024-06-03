import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";

const ImagePreviewScreen = ({ route }) => {
  const params = route.params;
  const uri = params.uri;

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      >
        <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
      </TouchableOpacity>
      <Image
        source={{ uri: uri }}
        style={{ width: "100%", height: "80%" }}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
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
export default ImagePreviewScreen;
