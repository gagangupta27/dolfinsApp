import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { setAuthData } from "../../redux/reducer/app";
import { useAuth0 } from "react-native-auth0";
import { useDispatch } from "react-redux";

const NavigationBarForHomeScreen = ({ onNewContactClick }) => {
  const { clearCredentials } = useAuth0();
  const dispatch = useDispatch();

  const clear = () => {
    clearCredentials();
    dispatch(setAuthData(null));
  };

  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={clear}>
        <Image
          source={require("../../assets/DolfinsCropped.png")}
          style={{ width: 80, height: 25 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={onNewContactClick}>
          <AntDesign name="pluscircle" size={20} color="#7879F1" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    height: 50, // Fixed height for the navbar
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    backgroundColor: "#FFFFFF", // Assuming a white navbar,
  },
  navTitle: {
    // fontWeight: 600, // Bold font for the title
    fontSize: 20, // Font size for the title
    color: "#000", // Assuming the title is black
  },
  iconsContainer: {
    flexDirection: "row", // Layout icons horizontally
  },
  iconButton: {
    marginLeft: 15, // Space out icons
  },
});

export default NavigationBarForHomeScreen;
