import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { Entypo } from "@expo/vector-icons";
import React from "react";

const UserMentionDropdown = ({
  data,
  onMentionSelect,
  searchText,
  setSearchText,
  setIsMentionFocused,
  hasTextInput = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.list}>
        {data?.map((item, index) => (
          <View
            style={[
              styles.item,
              {
                backgroundColor: item?.organisation ? "#F8E6EF" : "#D0A0BF",
              },
            ]}
            key={index}
          >
            <Text style={styles.itemText}>
              {item?.organisation?.name || item?.contact?.name}
            </Text>
            <TouchableOpacity key={index} onPress={() => onMentionSelect(item)}>
              <Entypo name="cross" size={16} color="black" />
            </TouchableOpacity>
          </View>
        ))}
        {hasTextInput && (
          <View style={styles.addmentiondbox}>
            <View style={styles.searchicon}>
              <Svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M13 13L17 17"
                  stroke="#858585"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <Path
                  d="M1 7.85714C1 11.6442 4.07005 14.7143 7.85714 14.7143C9.75394 14.7143 11.471 13.9441 12.7123 12.6994C13.9495 11.4591 14.7143 9.74743 14.7143 7.85714C14.7143 4.07005 11.6442 1 7.85714 1C4.07005 1 1 4.07005 1 7.85714Z"
                  stroke="#858585"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>
            </View>
            <TextInput
              style={styles.textinput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Mention a name to tag"
              placeholderTextColor="#858585" // This is to give the placeholder the subtle color
              keyboardType="default"
              returnKeyType="done"
              onFocus={() => setIsMentionFocused(true)}
              onBlur={() => setIsMentionFocused(false)}
            ></TextInput>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(241, 120, 182, 0.04)", // Background color for the dropdown container
    marginHorizontal: 10,
    borderRadius: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  list: {
    padding: 5, // Inner spacing for the list
    maxWidth: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    flex: 1,
  },
  item: {
    paddingHorizontal: 6, // Vertical padding for each item
    marginHorizontal: 4,
    marginVertical: 2,
    backgroundColor: "#F8E6EF", // Border color for each item
    borderRadius: 5,
    height: 24,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16, // Font size for item text
    color: "#000", // Text color for item text
    fontFamily: "Inter-Regular",
  },
  textinput: {
    flex: 1,
    marginVertical: 2,
    fontSize: 16,
    color: "#000",
    paddingLeft: 4,
    fontFamily: "Inter-Regular",
  },
  addmentiondbox: {
    flex: 1,
    minWidth: 190,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginVertical: 2,
    marginHorizontal: 2,
  },
  searchicon: {
    padding: 2,
  },
});

export default UserMentionDropdown;
