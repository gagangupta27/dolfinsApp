import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TextFormattingToolbar = ({
  onBoldPress,
  onItalicPress,
  onStrikethroughPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBoldPress} style={styles.button}>
        <Text style={styles.bold}>B</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onItalicPress} style={styles.button}>
        <Text style={styles.italic}>I</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onStrikethroughPress} style={styles.button}>
        <Text style={styles.strikethrough}>S</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={onUnorderedListPress} style={styles.button}>
        <Text>UL</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onOrderedListPress} style={styles.button}>
        <Text>OL</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "#FFFFFF", // Replace with your toolbar background color
    paddingLeft: 20,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF", // Replace with your button background color
  },
  bold: {
    fontSize: 24,
    fontFamily: "Courier-Bold",
  },
  italic: {
    fontSize: 24,
    fontFamily: "Courier-Italic",
  },
  strikethrough: {
    fontSize: 24,
    fontFamily: "Courier",
    textDecorationLine: "line-through",
  },
  //   icon: {
  //     width: 20,
  //     height: 20,
  //     // Add additional styling if necessary
  //   },
});

export default TextFormattingToolbar;
