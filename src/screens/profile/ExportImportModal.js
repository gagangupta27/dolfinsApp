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

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BottomSheetModal from "../../components/common/BottomSheetModal";
import Buttons from "../../components/Buttons/Buttons";
import { useRealm } from "@realm/react";
import {
  getContactNoteMap,
  getContactRaw,
} from "../../realm/queries/contactOperations";
import { getQuickNotesRaw } from "../../realm/queries/noteOperations";
import {
  getRawContactOrganisationMap,
  getRawNoteOrganisationMap,
  getRawOrg,
} from "../../realm/queries/organisationOperations";

export default React.forwardRef((props, ref) => {
  const [title, setTitle] = useState();
  const [loadingText, setLoadingText] = useState();
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(false);

  const authData = useSelector((state) => state.app.authData);
  const realm = useRealm();

  const dispatch = useDispatch();
  const _bottomSheetRef = useRef();

  React.useImperativeHandle(
    ref,
    () => ({
      exportData,
      hide,
    }),
    []
  );

  const exportData = async () => {
    setTitle("Export you Data");
    setLoading(true);
    setLoadingText("Preparing Data\n Can take a few minutes...");
    _bottomSheetRef?.current?.show();
    setPercentage(0);
    setTimeout(async () => {
      await prepareJSON();
    }, 1000);
  };

  const hide = () => {
    _bottomSheetRef?.current?.hide();
  };

  const prepareJSON = async () => {
    setPercentage(0);
    const rawConatcs = await getContactRaw(realm);
    setPercentage(10);
    const rawQuickNotes = await getQuickNotesRaw(realm);
    setPercentage(20);
    const rawContactNoteMap = await getContactNoteMap(realm);
    setPercentage(30);
    const rawOrg = await getRawOrg(realm);
    setPercentage(40);
    const rawNoteOrganisationMap = await getRawNoteOrganisationMap(realm);
    setPercentage(50);
    const rawContactOrganisationMap = await getRawContactOrganisationMap(realm);
    setPercentage(60);
    console.log(rawContactOrganisationMap);
    return;
  };

  return (
    <BottomSheetModal
      MAX_HEIGHT_PERC={1}
      START_PERC={0.7}
      ref={_bottomSheetRef}
      ignoreKeyboardOpen={true}
      restrictClose={true}
      disbaleGesture={true}
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
            {title}
          </Text>
          {loading && (
            <ActivityIndicator
              style={{ paddingVertical: 20 }}
              color={"gray"}
              size="large"
            />
          )}
          <Text
            style={{
              fontSize: 13,
              textAlign: "center",
            }}
          >
            {loadingText}
          </Text>
          <Text
            style={{
              fontSize: 13,
              textAlign: "center",
              marginTop: 20,
            }}
          >
            {`${percentage}%`}
          </Text>
          <Buttons
            text="Cancel"
            containerStyle={{ width: "100%", marginTop: 50 }}
            onPress={hide}
          />
        </View>
      </KeyboardAwareScrollView>
    </BottomSheetModal>
  );
});
