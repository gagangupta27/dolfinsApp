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
      <View style={styles.nameContainer}>
        <TouchableOpacity
          style={[styles.iconButton, { paddingRight: 10 }]}
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
          }}
        >
          <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
        </TouchableOpacity>
        {contact && contact?._id != "000000000000000000000000" && (
          <View
            style={{
              paddingRight: 10,
            }}
          >
            {contact?.imageAvailable && contact?.image && (
              <Image
                source={{ uri: contact?.image }}
                style={{ height: 24, width: 24, borderRadius: 100 }}
              />
            )}

            {(!contact?.imageAvailable || !contact?.image) && (
              <Svg
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M7.73379 10.0234C7.73379 12.9278 10.0954 15.2895 13 15.2895C15.9045 15.2895 18.2661 12.9277 18.2661 10.0232C18.2661 7.11877 15.9045 4.75698 13 4.75698C10.0954 4.75698 7.73379 7.11878 7.73379 10.0234ZM9.27399 10.0233C9.27399 7.96651 10.9432 6.29729 13 6.29729C15.0567 6.29729 16.7259 7.96673 16.7259 10.0233C16.7259 12.08 15.0567 13.7492 13 13.7492C10.9432 13.7492 9.27399 12.08 9.27399 10.0233Z"
                  fill="#212427"
                  stroke="#212427"
                  stroke-width="0.3"
                />
                <Path
                  d="M0.85 13C0.85 19.7188 6.31276 25.15 13 25.15C19.6876 25.15 25.15 19.6876 25.15 13C25.15 6.3124 19.6876 0.85 13 0.85C6.31265 0.85 0.85 6.28119 0.85 13ZM2.39031 13C2.39031 7.16031 7.16036 2.39031 13 2.39031C18.8397 2.39031 23.6097 7.16031 23.6097 13C23.6097 18.8397 18.8397 23.6097 13 23.6097C7.16031 23.6097 2.39031 18.8397 2.39031 13Z"
                  fill="#212427"
                  stroke="#212427"
                  stroke-width="0.3"
                />
                <Path
                  d="M5.38194 21.4969L5.50746 21.5806L5.59042 21.4546C7.2371 18.9542 10.0118 17.4601 13 17.4601C15.9578 17.4601 18.7021 18.9236 20.3486 21.363L20.432 21.4867L20.5561 21.4039L21.5794 20.7218L21.7045 20.6383L21.6208 20.5134C19.7014 17.6501 16.4609 15.9197 13 15.9197C9.5076 15.9197 6.23572 17.6817 4.31647 20.6076L4.23481 20.7321L4.35869 20.8147L5.38194 21.4969Z"
                  fill="#212427"
                  stroke="#212427"
                  stroke-width="0.3"
                />
              </Svg>
            )}
          </View>
        )}

        <Text style={styles.navTitle}>{contact.name}</Text>
      </View>
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
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    // paddingRight: 15, // Space out icons
  },
});

export default NavigationBarForContact;
