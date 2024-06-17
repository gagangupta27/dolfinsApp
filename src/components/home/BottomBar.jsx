import { StyleSheet, TextInput, View } from "react-native";

import { Feather } from "@expo/vector-icons";
import { useState } from "react";

const BottomBar = ({ addNote }) => {
  const [currentNote, setCurrentNote] = useState("");

  const buttonClicked = () => {
    if (currentNote) {
      addNote(currentNote);
      setCurrentNote("");
    }
  };

  return (
    <View style={styles.bottomBar}>
      <View style={styles.textinputview}>
        <TextInput
          style={styles.textinput}
          multiline
          value={currentNote}
          onChangeText={setCurrentNote}
          placeholder="Add notes about this contact..."
          placeholderTextColor="#858585" // This is to give the placeholder the subtle color
          keyboardType="default"
          returnKeyType="done"
        />
        <Feather
          style={styles.feather}
          name="send"
          size={24}
          color="#4B4B4B"
          onPress={buttonClicked}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    width: "100%",
    alignSelf: "center",
    height: 77,
    borderWidth: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: "#A5A6F6",
    borderColor: "#FFF",
    backgroundColor: "#FFF", // This is assuming you have set --Base-color to #FFF somewhere
    shadowOffset: { width: -5, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5, // Elevation is used to add shadow on Android, adjust the value as needed
  },
  textinputview: {
    height: 50,
    flex: 1,
    margin: 10,
    borderRadius: 15,
    backgroundColor: "rgba(165, 166, 246, 0.17)",
    shadowColor: "#FFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, // This is not exactly the same as CSS due to lack of 'inset' support
    shadowRadius: 4,
    elevation: 6, // For Android - adjusts shadow depth; the higher the number, the deeper the shadow
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // This will position the children at either end
  },
  textinput: {
    flex: 1, // Take up all available space
    padding: 10,
  },
  feather: {
    marginRight: 10,
    marginLeft: 5,
  },
});

export default BottomBar;
