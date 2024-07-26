import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Api from "../../utils/Api";
import BottomSheetModal from "../common/BottomSheetModal";
import ExactTextBox from "../notecontainer/ExactTextBox";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default React.forwardRef((props, ref) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const authData = useSelector((state) => state.app.authData);

  const { imageUri, onImagePress, setImageUri } = {};

  const dispatch = useDispatch();
  const _bottomSheetRef = useRef();

  React.useImperativeHandle(
    ref,
    () => ({
      show,
    }),
    []
  );

  const show = () => {
    _bottomSheetRef?.current?.show();
  };

  const onSave = async () => {
    setLoading(true);
    Api.post("/api/1.0/user/save_feedback", {
      email: "test@example.com",
      feedback: "amazing app",
    })
      .then((res) => {
        setLoading(false);
        console.log("res", res);
        _bottomSheetRef?.current?.hide();
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error:", error);
      });
  };

  return (
    <BottomSheetModal
      MAX_HEIGHT_PERC={1}
      START_PERC={0.7}
      ref={_bottomSheetRef}
      ignoreKeyboardOpen={true}
    >
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        scrollEnabled={true}
        style={{ flex: 1, backgroundColor: "white" }}
      >
        <View style={{ paddingTop: 8, paddingBottom: 20, padding: 16 }}>
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 200,
            }}
          >
            <View
              style={{
                alignItems: "flex-end",
                paddingRight: 20,
              }}
            >
              {loading && (
                <ActivityIndicator
                  style={{
                    paddingRight: 20,
                  }}
                  color={"black"}
                  size="small"
                />
              )}
              {!loading && (
                <TouchableOpacity activeOpacity={0.6} onPress={onSave}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "700",
                      lineHeight: 28,
                    }}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                paddingBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  lineHeight: 20,
                  fontWeight: "500",
                  paddingBottom: 8,
                }}
              >
                FeedBack
              </Text>
              <ExactTextBox
                content={name}
                setContent={setName}
                placeholder="Enter FeedBack"
                textAlignVertical="top"
                multiline={true}
                containerStyle={{
                  minHeight: 300,
                  paddingTop: 10,
                }}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAwareScrollView>
    </BottomSheetModal>
  );
});
