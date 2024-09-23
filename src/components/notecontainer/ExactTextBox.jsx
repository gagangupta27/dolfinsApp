import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import { useSelector } from "react-redux";

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
  const isDark = useSelector((state) => state.app.isDark);

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.container, containerStyle]}
    >
      <TextInput
        style={[
          styles.textinput1,
          {
            textAlignVertical: textAlignVertical,
            outline: "none",
            color: isDark ? "#fff" : "#000",
          },
        ]}
        multiline={multiline}
        value={content}
        readOnly={!editable}
        onChangeText={setContent}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        placeholderTextColor="#858585"
      />
      {rightIcons()}
    </TouchableOpacity>
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
    outline: "none",
  },
});

export default ExactTextBox;
