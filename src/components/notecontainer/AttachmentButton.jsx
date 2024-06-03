import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const AttachmentButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text>A</Text>
    </TouchableOpacity>
  );
};

// You can define your styles for the button here
const styles = StyleSheet.create({
  button: {
    // Define your styles for the button
    padding: 10, // Example padding
    borderRadius: 5, // Example border radius for a rounded button
    backgroundColor: "#E0E0E0", // Example background color
    // Add more styling as needed
  },
});

export default AttachmentButton;
