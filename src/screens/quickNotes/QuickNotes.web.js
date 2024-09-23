import { KeyboardAvoidingView, Linking, TouchableOpacity } from "react-native";
import { Path, Svg } from "react-native-svg";
import { TouchableWithoutFeedback, View } from "react-native";
import { useRef, useState } from "react";

import Header from "../../components/common/Header";
import React from "react";
import { useSelector } from "react-redux";

const QuickNotes = ({ route }) => {
  const [editMode, setEditMode] = useState({ editMode: false, id: null });
  const [addOrgModalVisible, setAddOrgModalVisible] = useState(false);

  const isDark = useSelector((state) => state.app.isDark);

  const noteRef = useRef(null);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={64}
      behavior={"padding"}
      style={{ flex: 1, backgroundColor: isDark ? "#181b1a" : "#fff" }}
    >
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback
          onPress={() => {
            noteRef.current.unfocus();
          }}
        >
          <View style={{ flex: 1 }}>
            <Header title={"All Quick Notes"} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </KeyboardAvoidingView>
  );
};

export default QuickNotes;
