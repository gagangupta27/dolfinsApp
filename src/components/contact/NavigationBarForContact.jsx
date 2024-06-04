import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { BSON } from "realm";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const NavigationBarForContact = ({
  contact,
  onLinkedinDataConnectModalOpen,
  onShare,
  showEdit = false,
  onEdit = () => {},
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
        {showEdit && (
          <TouchableOpacity
            style={[styles.iconButton, { marginLeft: 8 }]}
            onPress={onEdit}
          >
            <Svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                d="M2.87601 18.1156C2.92195 17.7021 2.94493 17.4954 3.00748 17.3022C3.06298 17.1307 3.1414 16.9676 3.24061 16.8171C3.35242 16.6475 3.49952 16.5005 3.7937 16.2063L17 3C18.1046 1.89543 19.8954 1.89543 21 3C22.1046 4.10457 22.1046 5.89543 21 7L7.7937 20.2063C7.49951 20.5005 7.35242 20.6475 7.18286 20.7594C7.03242 20.8586 6.86926 20.937 6.69782 20.9925C6.50457 21.055 6.29783 21.078 5.88434 21.124L2.49997 21.5L2.87601 18.1156Z"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        )}
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
