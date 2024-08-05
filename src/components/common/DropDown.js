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

import Accordion from "./Accordian";
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
      setSearchText("");
      onOptionSelected(option);
      setShowOptions(false);
      Keyboard.dismiss();
    };

    return (
      <View style={styles.textinputview1}>
        <View style={styles.container}>
          <TextInput
            value={searchText}
            onFocus={() => setShowOptions(true)}
            onChangeText={filterOptions}
            placeholder={placeholder}
            style={styles.textinput1}
            placeholderTextColor="#858585" // This is to give the placeholder the subtle color
          />
          <Accordion
            viewKey="dropdown"
            isExpanded={showOptions}
            enterFrom="top"
          >
            <FlatList
              data={filteredOptions}
              contentContainerStyle={{
                backgroundColor: "white",
              }}
              style={{
                maxHeight: 300,
              }}
              nestedScrollEnabled={true}
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
          </Accordion>
        </View>
      </View>
    );
  }
);

export default Dropdown;

const styles = StyleSheet.create({
  textinputview1: {
    minHeight: 50,
    flex: 1,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.17)",
    borderWidth: 1,
  },
  container: {
    flex: 1,
    marginHorizontal: 5,
    marginTop: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#fff",
  },
  textinput1: {
    flex: 1,
    paddingVertical: 5,
    minHeight: 50,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.17)", // Make sure TextInput has a transparent background
    textAlignVertical: "top", // Add this line
  },
});
