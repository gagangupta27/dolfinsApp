import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

/**
 * Wanted to build a WYSIWYG kind of editor! This was a fun component to work on.
 * Eventually did simple markdown
 */
const MyTextInput = ({ content, setContent, placeholder, onFocus }) => {
  const [formattedContent, setFormattedContent] = useState([]);

  useEffect(() => {
    const newFormattedContent = [];
    const lines = content.split("\n");
    for (const i in lines) {
      const line = lines[i];
      const words = line.split(" ");
      for (const j in words) {
        const word = words[j];
        if (word.startsWith("*") && word.endsWith("*")) {
          newFormattedContent.push(
            <Text style={{ fontFamily: "Roboto_Mono-Bold" }} key={word}>
              {word}{" "}
            </Text>
          );
        } else if (word.startsWith("_") && word.endsWith("_")) {
          newFormattedContent.push(
            <Text style={{ fontFamily: "Roboto_Mono-Italic" }} key={word}>
              {word}{" "}
            </Text>
          );
        } else {
          newFormattedContent.push(
            <Text style={{ fontFamily: "Roboto_Mono-Regular" }} key={word}>
              {word}{" "}
            </Text>
          );
        }
      }
    }
    setFormattedContent(newFormattedContent);
  }, [content]);

  return (
    <View style={styles.container}>
      <Text style={{ position: "absolute", left: 0, right: 0, flex: 1 }}>
        {formattedContent}
      </Text>
      <TextInput
        multiline
        style={styles.input}
        value={content}
        onChangeText={setContent}
        onFocus={onFocus}
        placeholder={placeholder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    fontFamily: "Roboto_Mono-Regular",
    color: "transparent",
  },
});

export default MyTextInput;
