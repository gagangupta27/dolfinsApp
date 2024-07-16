import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@realm/react";

const Dropdown = forwardRef(
  (
    { options = [], onOptionSelected = () => {}, placeholder = "Search..." },
    ref
  ) => {
    const [searchText, setSearchText] = useState("");
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [showOptions, setShowOptions] = useState(false);

    useImperativeHandle(ref, () => ({
      onRefresh: () => {
        setSearchText("");
      },
    }));

    const filterOptions = (text) => {
      setSearchText(text);
      setFilteredOptions(
        options?.filter((option) =>
          option?.name?.toLowerCase().includes(text.toLowerCase())
        )
      );
      setShowOptions(true);
    };

    const onOptionPress = (option) => {
      setSearchText(option?.name);
      onOptionSelected(option);
      setShowOptions(false);
      Keyboard.dismiss();
    };

    return (
      <View style={styles.textinputview1}>
        <View style={styles.shadowContainer}>
          {/* Top Shadow */}
          <LinearGradient
            colors={["black", "rgba(0, 0, 0, 0)"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.topShadow}
          />
          {/* Left Shadow */}
          <LinearGradient
            colors={["black", "rgba(0, 0, 0, 0)"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.sideShadow}
          />
          {/* Right Shadow */}
          <LinearGradient
            colors={["black", "rgba(0, 0, 0, 0)"]}
            start={{ x: 1, y: 0.5 }}
            end={{ x: 0, y: 0.5 }}
            style={[styles.rightShadow]}
          />
        </View>
        <View style={styles.container}>
          <TextInput
            value={searchText}
            onFocus={() => setShowOptions(true)}
            onChangeText={filterOptions}
            placeholder={placeholder}
            style={styles.textinput1}
            placeholderTextColor="#858585" // This is to give the placeholder the subtle color
          />
          {showOptions && (
            <View
              style={{
                position: "absolute",
                top: 50,
                height: 200,
                backgroundColor: "white",
                left: 0,
                right: 0,
                zIndex: 1000,
                elevation: 20,
                shadowColor: "black",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                borderRadius: 10,
                overflow: "hidden",
                padding: 10,
                borderWidth: 0.4,
                borderColor: "gray",
              }}
            >
              <FlatList
                data={filteredOptions}
                contentContainerStyle={{
                  backgroundColor: "white",
                }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => onOptionPress(item)}
                    style={{
                      paddingVertical: 10,
                      borderBottomWidth: 0.5,
                      borderColor: "gray",
                    }}
                  >
                    <Text>{item?.name}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item?._id}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
);

export default Dropdown;

const styles = StyleSheet.create({
  textinputview1: {
    height: 50,
    flex: 1,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.17)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  container: {
    flex: 1,
    marginHorizontal: 5,
    marginTop: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#fff",
    position: "absolute", // Position text input absolutely to overlap the SVG
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  textinput1: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.17)", // Make sure TextInput has a transparent background
    textAlignVertical: "top", // Add this line
  },
  shadowContainer: {
    position: "absolute",
    borderRadius: 15,
    top: 0, // Adjust this to control the vertical position of the shadow
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%", // Adjust this to control the fade out distance
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-start", // Align gradient to the top,
  },
  topShadow: {
    position: "absolute",
    top: 0,
    height: 15, // Adjust the height to control the fade length of the shadow
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
  },
  sideShadow: {
    position: "absolute",
    left: 0,
    width: 5, // Adjust the width to control the fade width of the shadow
    height: "100%",
    borderRadius: 15,
    overflow: "hidden",
  },
  rightShadow: {
    position: "absolute",
    right: 0,
    width: 5,
    height: "100%",
    borderRadius: 15,
    overflow: "hidden",
  },
});
