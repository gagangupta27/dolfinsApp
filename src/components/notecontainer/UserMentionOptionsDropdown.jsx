import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import React from "react";

const UserMentionOptionsDropdown = ({
  filteredContacts,
  onSelectOption,
  containerStyle = {},
}) => {
  const handleItemClick = (item) => {
    onSelectOption(item);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemClick(item)}>
      <View style={styles.item}>
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <FlatList
        data={filteredContacts}
        renderItem={renderItem}
        keyExtractor={(item, index) => "S_" + index.toString()}
        style={styles.list}
        horizontal
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF", // Background color for the dropdown container
    margin: 5,
    borderRadius: 10,
  },
  list: {
    paddingHorizontal: 10, // Inner spacing for the list
  },
  item: {
    paddingHorizontal: 6, // Vertical padding for each item
    marginHorizontal: 4,
    paddingVertical: 2,
    marginVertical: 2,
    backgroundColor: "#F8E6EF", // Border color for each item
    borderRadius: 5,
    height: 25,
  },
  itemText: {
    fontSize: 16, // Font size for item text
    color: "#000", // Text color for item text
    fontFamily: "Inter-Regular",
  },
});

export default UserMentionOptionsDropdown;
