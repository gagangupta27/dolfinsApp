import {
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

import BottomSheetModal from "./common/BottomSheetModal";
import ExactTextBox from "./notecontainer/ExactTextBox";
import Feather from "@expo/vector-icons/Feather";
import { setAuthData } from "../redux/reducer/app";
import useImageHandler from "../hooks/ImageHandler";

export default React.forwardRef((props, ref) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const authData = useSelector((state) => state.app.authData);

  const { imageUri, onImagePress, setImageUri } = useImageHandler();

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
    if (authData) {
      if (authData?.name || authData?.fullName?.givenName) {
        setName(authData?.name || authData?.fullName?.givenName);
      }
      if (authData?.email) {
        setEmail(authData?.email);
      }
      if (authData?.picture) {
        setImageUri(authData?.picture);
      }
    }
  }, [authData]);

  const show = () => {
    _bottomSheetRef?.current?.show();
  };

  const onSave = async () => {
    dispatch(
      setAuthData({
        ...authData,
        email: email,
        fullName: { givenName: name },
        name: name,
        picture: imageUri,
      })
    );
    _bottomSheetRef?.current?.hide();
  };

  return (
    <BottomSheetModal
      MAX_HEIGHT_PERC={1}
      START_PERC={0.7}
      ref={_bottomSheetRef}
    >
      <View style={{ paddingTop: 8, paddingBottom: 20, padding: 16 }}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 200,
          }}
        >
          <View>
            <TouchableOpacity activeOpacity={0.6} onPress={onSave}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  lineHeight: 28,
                  textAlign: "right",
                }}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              paddingVertical: 20,
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Image
              style={{
                height: 100,
                width: 100,
                borderRadius: 100,
                backgroundColor: "black",
              }}
              source={{ uri: imageUri }}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                height: 30,
                width: 30,
                borderRadius: 100,
                position: "absolute",
                bottom: 20,
                right: 10,
                borderWidth: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={onImagePress}
            >
              <Feather name="edit-2" size={18} color="black" />
            </TouchableOpacity>
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
              Name
            </Text>
            <ExactTextBox
              content={name}
              setContent={setName}
              placeholder="Name"
              textAlignVertical="center"
              multiline={false}
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
              Email
            </Text>
            <ExactTextBox
              content={email}
              setContent={setEmail}
              placeholder="Name"
              textAlignVertical="center"
              multiline={false}
              editable={false}
            />
          </View>
        </ScrollView>
      </View>
    </BottomSheetModal>
  );
});
