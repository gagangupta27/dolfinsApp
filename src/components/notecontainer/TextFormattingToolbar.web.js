import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import React from "react";

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
    paddingLeft: 20,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 4,
  },
  bold: {
    fontSize: 24,
    fontFamily: "Courier-Bold",
    color: "#b0b0b0",
  },
  italic: {
    fontSize: 24,
    fontFamily: "Courier-Italic",
    color: "#b0b0b0",
  },
  strikethrough: {
    fontSize: 24,
    fontFamily: "Courier",
    textDecorationLine: "line-through",
    color: "#b0b0b0",
  },
  //   icon: {
  //     width: 20,
  //     height: 20,
  //     // Add additional styling if necessary
  //   },
});

export default TextFormattingToolbar;
