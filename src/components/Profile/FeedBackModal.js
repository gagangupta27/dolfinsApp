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
  const [feedBack, setFeedBack] = useState("");
  const [email, setEmail] = useState("");
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

  useEffect(() => {
    if (authData?.email) {
      setEmail(authData?.email);
    }
  }, [authData]);

  const show = () => {
    _bottomSheetRef?.current?.show();
  };

  const onSave = async () => {
    if (feedBack?.length < 5) {
      Alert.alert("Error", "Please Enter More Details!");
      return;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      Alert.alert("Error", "Invalid Email Address!");
      return;
    }

    setLoading(true);
    Api.post("/api/1.0/user/save_feedback", {
      email: email,
      feedback: feedBack,
    })
      .then((res) => {
        setFeedBack("");
        setLoading(false);
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
                Email
              </Text>
              <ExactTextBox
                content={email}
                setContent={setEmail}
                placeholder="Email"
                textAlignVertical="top"
                multiline={true}
                containerStyle={{
                  paddingTop: 10,
                }}
              />
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
                content={feedBack}
                setContent={setFeedBack}
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
