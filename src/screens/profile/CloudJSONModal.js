import { Text, View } from "react-native";
import React, { useRef } from "react";

import { useDispatch, useSelector } from "react-redux";

import BottomSheetModal from "../../components/common/BottomSheetModal";
import Buttons from "../../components/Buttons/Buttons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default React.forwardRef(({}, ref) => {
  const authData = useSelector((state) => state.app.authData);

  const _bottomSheetRef = useRef();
  const onICloudPressRef = useRef();
  const onJSONPressRef = useRef();

  React.useImperativeHandle(
    ref,
    () => ({
      show,
      hide,
    }),
    []
  );

  const show = async (onICloudPress = () => {}, onJSONPress = () => {}) => {
    _bottomSheetRef?.current?.show();
    onICloudPressRef.current = onICloudPress;
    onJSONPressRef.current = onJSONPress;
  };

  const hide = () => {
    _bottomSheetRef?.current?.hide();
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
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
            }}
          >
            {"Select Option"}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Buttons
              text="iCloud"
              containerStyle={{ flex: 1, marginTop: 50, marginRight: 8 }}
              isInverse
              onPress={() => {
                hide();
                if (onICloudPressRef.current) {
                  onICloudPressRef.current();
                }
              }}
              iconStyle={{
                paddingRight: 8,
              }}
              imageIcon={() => (
                <MaterialCommunityIcons
                  name="apple-icloud"
                  size={24}
                  color="black"
                />
              )}
            />
            <Buttons
              text="Files"
              containerStyle={{ flex: 1, marginTop: 50, marginLeft: 8 }}
              isInverse
              onPress={() => {
                if (onJSONPressRef.current) {
                  onJSONPressRef.current();
                }
              }}
              iconStyle={{
                paddingRight: 8,
              }}
              imageIcon={() => (
                <FontAwesome name="files-o" size={24} color="black" />
              )}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </BottomSheetModal>
  );
});
