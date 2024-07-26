import { StyleSheet, TextInput, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

const ExactTextBox = ({
  content,
  setContent,
  setIsFocused = (x) => {},
  placeholder = "Add Note",
  containerStyle = {},
  rightIcons = () => {},
  textAlignVertical = "top",
  multiline = true,
  editable = true,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.textinput1, { textAlignVertical: textAlignVertical }]}
        multiline={multiline}
        value={content}
        editable={editable}
        onChangeText={setContent}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        placeholderTextColor="#858585"
      />
      {rightIcons()}
    </View>
  );
};

const styles = StyleSheet.create({
  textinputview1: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.17)",
    borderWidth: 0.5,
    borderRadius: 6,
  },
  textinput1: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
});

export default ExactTextBox;
