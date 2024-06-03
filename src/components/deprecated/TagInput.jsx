import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * Experimental component for tagging someone.
 * It has two components which are superimposed on each other.
 * One is TextInput where user can write, and another View which is a styled version of the inputText.
 *
 * For Testing - The styling is done by splitting the inputText into words and then checking if the word starts with '#'.
 * If it does, we color it blue.
 *
 */
const TagInput = () => {
  const [inputText, setInputText] = useState("");

  const onChangeText = (text) => {
    setInputText(text);
  };

  const renderStyledText = () => {
    return inputText.split(" ").map((word, index) => {
      let style = styles.regularText;
      if (word.startsWith("#")) {
        style = styles.tagText;
      }

      return (
        <Text key={index} style={style}>
          {word}{" "}
        </Text>
      );
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.touchableArea}
        onPress={() => this.input.focus()}
      >
        <View style={styles.textContainer}>{renderStyledText()}</View>
      </TouchableOpacity>
      <TextInput
        ref={(ref) => (this.input = ref)}
        style={styles.input}
        onChangeText={onChangeText}
        value={inputText}
        placeholder="Type here..."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  touchableArea: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  textContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "transparent",
  },
  regularText: {
    // Regular text style
  },
  tagText: {
    color: "blue", // Tag text style
  },
});

export default TagInput;
