import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BSON } from "realm";

const NavigationBarForContact = ({
  contact,
  onLinkedinDataConnectModalOpen,
  onShare,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => {
          if (navigation.canGoBack()) navigation.goBack();
        }}
      >
        <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.navTitle}>{contact.name}</Text>
      <View
        style={[
          styles.iconsContainer,
          contact._id.equals(new BSON.ObjectId("000000000000000000000000"))
            ? { opacity: 0 }
            : {},
        ]}
      >
        <TouchableOpacity
          style={{ marginRight: 10, alignSelf: "center" }}
          onPress={onShare}
        >
          <Feather name="share" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            if (
              !contact._id.equals(new BSON.ObjectId("000000000000000000000000"))
            )
              onLinkedinDataConnectModalOpen();
          }}
        >
          <Image
            source={require("../../assets/linkedIn_icon_circle.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
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
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF", // Assuming a white navbar
    borderBottomWidth: 1, // Add a bottom border
    borderBottomColor: "#E8E8E8", // Light grey color for the bottom border
  },
  navTitle: {
    // fontWeight: '600', // Bold font for the title
    fontSize: 18, // Font size for the title
    color: "#000", // Assuming the title is black
  },
  iconsContainer: {
    flexDirection: "row", // Layout icons horizontally
  },
  iconButton: {
    // marginLeft: 15, // Space out icons
  },
});

export default NavigationBarForContact;
