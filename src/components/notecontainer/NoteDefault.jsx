import React, { useRef } from "react";
import {
  StyleSheet,
  TextInput,
  View
} from "react-native";
import MultiModalOptions from "./MultiModalOptions";

const onClick = () => {};

const NoteDefault = ({}) => {
  const noteInputFieldRef = useRef();

  return (
    <View style={styles.container}>
      <View style={styles.textinputview}>
        <TextInput style={styles.textinput} multiline />
      </View>
      <MultiModalOptions
        recording={null}
        onStartRecording={onClick}
        onStopRecording={onClick}
        onImagePress={onClick}
        onDocumentPress={onClick}
        line={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: {
      width: -5,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  textinputview: {
    height: 40,
    flex: 1,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 15,
    backgroundColor: "rgba(165, 166, 246, 0.17)",

    flexDirection: "row",
    justifyContent: "space-between", // This will position the children at either end
    alignItems: "center",

    shadowColor: "#AEAFDC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, // This is not exactly the same as CSS due to lack of 'inset' support
    shadowRadius: 4,
    elevation: 5, // For Android - adjusts shadow depth; the higher the number, the deeper the shadow
  },
  textinput: {
    flex: 1,
    padding: 10,
  },
});

export default NoteDefault;
