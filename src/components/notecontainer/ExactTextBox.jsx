import { StyleSheet, TextInput, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

const ExactTextBox = ({
  content,
  setContent,
  setIsFocused = (x) => {},
  placeholder = "Add Note",
  containerStyle = {},
  rightIcons = () => {},
}) => {
  return (
    <View style={[styles.textinputview1, containerStyle]}>
      <View style={styles.shadowContainer}>
        {/* Top Shadow */}
        <LinearGradient
          colors={["black", "rgba(0, 0, 0, 0)"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.topShadow}
        />
        {/* Left Shadow */}
        <LinearGradient
          colors={["black", "rgba(0, 0, 0, 0)"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.sideShadow}
        />
        {/* Right Shadow */}
        <LinearGradient
          colors={["black", "rgba(0, 0, 0, 0)"]}
          start={{ x: 1, y: 0.5 }}
          end={{ x: 0, y: 0.5 }}
          style={[styles.rightShadow]}
        />
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.textinput1}
          multiline
          value={content}
          onChangeText={setContent}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          placeholderTextColor="#858585" // This is to give the placeholder the subtle color
        />
        {rightIcons()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textinputview1: {
    height: 50,
    flex: 1,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
  },
  container: {
    flex: 1,
    marginHorizontal: 5,
    marginTop: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.17)",
    position: "absolute", // Position text input absolutely to overlap the SVG
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textinput1: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    textAlignVertical: "top", // Add this line
  },
  shadowContainer: {
    position: "absolute",
    borderRadius: 15,
    top: 0, // Adjust this to control the vertical position of the shadow
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%", // Adjust this to control the fade out distance
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-start", // Align gradient to the top,
    zIndex: -1,
  },
  topShadow: {
    position: "absolute",
    top: 0,
    height: 15, // Adjust the height to control the fade length of the shadow
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
  },
  sideShadow: {
    position: "absolute",
    left: 0,
    width: 5, // Adjust the width to control the fade width of the shadow
    height: "100%",
    borderRadius: 15,
    overflow: "hidden",
  },
  rightShadow: {
    position: "absolute",
    right: 0,
    width: 5,
    height: "100%",
    borderRadius: 15,
    overflow: "hidden",
  },
});

export default ExactTextBox;
