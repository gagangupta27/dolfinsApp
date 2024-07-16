import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Feather } from "@expo/vector-icons";
import React from "react";

const MultiModalOptions = ({
  recording,
  onStartRecording,
  onStopRecording,
  onImagePress,
  onDocumentPress,
  line = true,
}) => {
  return (
    <View style={styles.container}>
      {line && <View style={styles.verticalline}></View>}
      {recording && (
        <TouchableOpacity onPress={onStopRecording} style={styles.optionButton}>
          <Feather name="stop-circle" size={24} color="#000" />
        </TouchableOpacity>
      )}
      {!recording && (
        <TouchableOpacity
          onPress={onStartRecording}
          style={styles.optionButton}
        >
          <Feather name="mic" size={24} color="#000" />
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={onImagePress} style={styles.optionButton}>
        <Feather name="image" size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDocumentPress} style={styles.optionButton}>
        <Feather name="file" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#FFFFFF", // Background color for the options container
  },
  optionButton: {
    padding: 5,
    color: "#000",
  },
  optionText: {
    color: "#black",
    fontSize: 16,
    color: "#000000", // Text color for the option
  },
  verticalline: {
    width: 1,
    height: "100%",
    backgroundColor: "#C4C4C4", // Change
    marginRight: 10,
  },
});

export default MultiModalOptions;
