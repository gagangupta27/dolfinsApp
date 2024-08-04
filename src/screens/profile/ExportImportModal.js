import * as CloudStore from "react-native-cloud-store";

import { ActivityIndicator, Alert, Text, View } from "react-native";
import {
  PathUtils,
  defaultICloudContainerPath,
} from "react-native-cloud-store";
import React, { useEffect, useRef, useState } from "react";
import {
  getContactNoteMap,
  getContactRaw,
  getRawMentions,
  importContactNoteMap,
  importContacts,
  importMentions,
} from "../../realm/queries/contactOperations";
import {
  getRawContactOrganisationMap,
  getRawNoteOrganisationMap,
  getRawOrg,
  importContactOrgMap,
  importNoteOrganisationMap,
  importOrgs,
} from "../../realm/queries/organisationOperations";
import { useDispatch, useSelector } from "react-redux";

import BottomSheetModal from "../../components/common/BottomSheetModal";
import Buttons from "../../components/Buttons/Buttons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import Toast from "react-native-toast-message";
import {
  getNotesRaw,
  getQuickNotesRaw,
  importNotes,
} from "../../realm/queries/noteOperations";
import { useRealm } from "@realm/react";

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
      importData,
      syncICloud,
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
    let json = await prepareJSON();
    const path = RNFS.CachesDirectoryPath + "/dolfins.json";
    RNFS.writeFile(path, JSON.stringify(json), "utf8")
      .then(async (success) => {
        setPercentage(100);
        console.log("FILE WRITTEN!");
        try {
          const shareOptions = {
            title: "Share JSON File",
            url: path,
            type: "application/json",
          };
          await Share.open(shareOptions)
            .then(() => {
              hide();
            })
            .catch((err) => {
              hide();
            });
        } catch (error) {
          console.error("Error sharing file:", error);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const importData = async (fileUrl) => {
    setPercentage(0);
    setTitle("Imprting you Data");
    setLoading(true);
    setLoadingText("Preparing Data\n Can take a few minutes...");
    _bottomSheetRef?.current?.show();
    const fileContents = await RNFS.readFile(fileUrl, "utf8");
    const jsonData = JSON.parse(fileContents);
    console.log("jsonData", Object.keys(jsonData));
    setPercentage(10);
    await importContacts(realm, jsonData?.contacts || []);
    setPercentage(20);
    await importOrgs(realm, jsonData?.organisations || []);
    setPercentage(30);
    // await importMentions(realm, jsonData?.mentions || []);
    setPercentage(40);
    await importNotes(realm, jsonData?.notes || []);
    setPercentage(50);
    await importContactNoteMap(realm, jsonData?.contactNoteMap || []);
    setPercentage(60);
    await importNoteOrganisationMap(realm, jsonData?.noteOrganisationMap || []);
    setPercentage(70);
    await importContactOrgMap(realm, jsonData?.contactOrganisationMap || []);
    setPercentage(80);
  };

  const syncICloud = async () => {
    let isAvailable = await CloudStore.isICloudAvailable();
    if (!isAvailable) {
      Alert.alert("Error", "iCould not available");
      return;
    }
    setTitle("Sync Data to iCloud");
    setLoading(true);
    setLoadingText("Preparing Data\n Can take a few minutes...");
    _bottomSheetRef?.current?.show();
    setPercentage(0);
    let json = await prepareJSON();
    setLoadingText("Syncing Data\n Can take a few minutes...");
    try {
      await CloudStore.writeFile(
        PathUtils.join(defaultICloudContainerPath, "Documents/backup.json"),
        JSON.stringify(json),
        {
          override: true,
        }
      )
        .then((res) => {
          console.log("res", res);
        })
        .catch((err) => {
          Alert.alert("Error", "Error Syncing to iCloud");
          console.log("err", err);
        });
    } catch (err) {
      Alert.alert("Error", "Error Syncing to iCloud");
    }
  };

  const hide = () => {
    _bottomSheetRef?.current?.hide();
  };

  const prepareJSON = async () => {
    await new Promise((r) => setTimeout(r, 1000));
    setPercentage(0);
    const rawConatcs = await getContactRaw(realm);
    setPercentage(10);
    // const rawQuickNotes = await getQuickNotesRaw(realm);
    setPercentage(20);
    const rawNotes = await getNotesRaw(realm);
    console.log("rawNotes", rawNotes);
    setPercentage(20);
    const rawOrg = await getRawOrg(realm);
    setPercentage(30);
    const rawContactNoteMap = await getContactNoteMap(realm);
    setPercentage(40);
    const rawNoteOrganisationMap = await getRawNoteOrganisationMap(realm);
    setPercentage(50);
    const rawContactOrganisationMap = await getRawContactOrganisationMap(realm);
    setPercentage(60);
    const rawMentions = await getRawMentions(realm);
    setPercentage(70);
    return {
      contacts: rawConatcs,
      // quickNotes: rawQuickNotes,
      organisations: rawOrg,
      contactNoteMap: rawContactNoteMap,
      noteOrganisationMap: rawNoteOrganisationMap,
      contactOrganisationMap: rawContactOrganisationMap,
      mentions: rawMentions,
      notes: rawNotes,
    };
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
