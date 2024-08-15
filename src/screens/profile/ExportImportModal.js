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
  importContactNoteMap,
  importContacts,
} from "../../realm/queries/contactOperations";
import {
  getEventNoteMap,
  getRawEvents,
  importCalendarEventNoteMap,
  importEvents,
} from "../../realm/queries/calendarEventOperations";
import { getNotesRaw, importNotes } from "../../realm/queries/noteOperations";
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
import CloudJSONModal from "./CloudJSONModal";
import Contact from "../../realm/models/Contact";
import ContactNoteMap from "../../realm/models/ContactNoteMap";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Note from "../../realm/models/Note";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import Toast from "react-native-toast-message";
import { useRealm } from "@realm/react";

export default React.forwardRef(
  (
    {
      percentageProp = 0,
      showPercentage = true,
      hideCancel = false,
      containserStyle = {},
    },
    ref
  ) => {
    const [title, setTitle] = useState();
    const [loadingText, setLoadingText] = useState();
    const [percentage, setPercentage] = useState(0);
    const [loading, setLoading] = useState(false);

    const authData = useSelector((state) => state.app.authData);
    const realm = useRealm();

    const dispatch = useDispatch();
    const _bottomSheetRef = useRef();
    const _cloudJSONRef = useRef();

    React.useImperativeHandle(
      ref,
      () => ({
        exportData,
        exportCSV,
        importData,
        importICloud,
        hide,
        showLoading,
      }),
      []
    );

    useEffect(() => {
      setPercentage(percentageProp);
    }, [percentageProp]);

    const showLoading = async (title = "", loadingtext = "") => {
      setTitle(title);
      setLoading(true);
      setLoadingText(loadingtext);
      _bottomSheetRef?.current?.show();
      setPercentage(0);
    };

    const exportData = async () => {
      setTitle("Export you Data");
      setLoading(true);
      setLoadingText("Preparing Data\n Can take a few minutes...");
      _bottomSheetRef?.current?.show();
      setPercentage(0);
      let json = await prepareJSON();
      const path = RNFS.CachesDirectoryPath + "/dolfins.json";
      _cloudJSONRef?.current?.show(
        async () => {
          setLoadingText("Syncing Data\n To iCloud");
          let isAvailable = await CloudStore.isICloudAvailable();
          if (!isAvailable) {
            Alert.alert("Error", "iCould not available");
            return;
          }
          try {
            await CloudStore.writeFile(
              PathUtils.join(
                defaultICloudContainerPath,
                "Documents/backup.json"
              ),
              JSON.stringify(json),
              {
                override: true,
              }
            )
              .then(async (res) => {
                setTimeout(() => {
                  hide();
                  Alert.alert(
                    "Success",
                    "Data Successfully Exported to iCloud!"
                  );
                }, 1000);
              })
              .catch((err) => {
                Alert.alert("Error", "Error Syncing to iCloud");
                console.log("err", err);
              });
          } catch (err) {
            Alert.alert("Error", "Error Syncing to iCloud");
          }
        },
        async () => {
          RNFS.writeFile(path, JSON.stringify(json), "utf8")
            .then(async (success) => {
              setPercentage(100);
              try {
                const shareOptions = {
                  title: "Share JSON File",
                  url: path,
                  type: "application/json",
                };
                await Share.open(shareOptions)
                  .then(() => {
                    _cloudJSONRef?.current?.hide();
                    setTimeout(() => {
                      hide();
                    }, 500);
                  })
                  .catch((err) => {
                    _cloudJSONRef?.current?.hide();
                    setTimeout(() => {
                      hide();
                    }, 500);
                  });
              } catch (error) {
                console.error("Error sharing file:", error);
              }
            })
            .catch((err) => {
              console.log(err.message);
            });
        }
      );
    };

    const exportCSV = async () => {
      setTitle("Export you Data");
      setLoading(true);
      setLoadingText("Preparing Data\n Can take a few minutes...");
      _bottomSheetRef?.current?.show();
      setPercentage(0);
      let contactJSON = [];
      realm.write(() => {
        const contacts = realm
          .objects(Contact)
          .filtered("id != $0", "000000000000000000000000");
        contactJSON.push([...Object.keys(contacts[0]), "notes"]);
        for (const contact of contacts) {
          try {
            const allContactNoteIds = realm
              .objects(ContactNoteMap)
              .filtered(`contactId == $0`, contact?._id)
              .map((o) => o.noteId);

            const allNotes = realm
              .objects(Note)
              .filtered(`_id IN $0`, allContactNoteIds);

            contactJSON.push([
              ...Object.values({
                ...contact,
                emails: contact.emails.join(", "),
                phoneNumbers: contact.phoneNumbers.join(", "),
                addresses:
                  contact.addresses
                    .map(
                      (addr) =>
                        `${addr.street}, ${addr.city}, ${addr.region}, ${addr.country}, ${addr.postalCode}`
                    )
                    .join("; ") || "", // Convert addresses to a single string
                notes: allNotes.map((n) => n.content).join(", "),
              }),
            ]);
          } catch (err) {
            console.log("err", err);
          }
        }
      });
      const path = RNFS.CachesDirectoryPath + "/dolfinsCSV.csv";

      const csvContent = contactJSON.map((e) => e.join(",")).join("\n");

      RNFS.writeFile(path, csvContent, "utf8")
        .then(async (success) => {
          setPercentage(100);
          try {
            const shareOptions = {
              title: "Share JSON File",
              url: path,
              type: "application/json",
            };
            await Share.open(shareOptions)
              .then(() => {
                setTimeout(() => {
                  hide();
                }, 500);
              })
              .catch((err) => {
                setTimeout(() => {
                  hide();
                }, 500);
              });
          } catch (error) {
            console.error("Error sharing file:", error);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };

    const importData = async (fileUrl = null, data = null) => {
      setPercentage(0);
      setTitle("Importing you Data");
      setLoading(true);
      setLoadingText("Preparing Data\n Can take a few minutes...");
      _bottomSheetRef?.current?.show();
      let jsonData = {};
      if (fileUrl) {
        const fileContents = await RNFS.readFile(fileUrl, "utf8");
        jsonData = JSON.parse(fileContents);
      } else {
        jsonData = JSON.parse(data);
      }
      setPercentage(10);
      await importContacts(realm, jsonData?.contacts || []);
      setPercentage(20);
      await importOrgs(realm, jsonData?.organisations || []);
      setPercentage(40);
      await importNotes(realm, jsonData?.notes || []);
      setPercentage(50);
      await importEvents(realm, jsonData?.events || []);
      setPercentage(50);
      await importContactNoteMap(realm, jsonData?.contactNoteMap || []);
      setPercentage(60);
      await importNoteOrganisationMap(
        realm,
        jsonData?.noteOrganisationMap || []
      );
      setPercentage(70);
      await importContactOrgMap(realm, jsonData?.contactOrganisationMap || []);
      setPercentage(80);
      await importCalendarEventNoteMap(
        realm,
        jsonData?.calendarEventNoteMap || []
      );
      setPercentage(100);
      await new Promise((r) => setTimeout(r, 1000));
      hide();
      Alert.alert("Success", "Data Imported SuccessFully!");
    };

    const importICloud = async () => {
      let isAvailable = await CloudStore.isICloudAvailable();
      if (!isAvailable) {
        Alert.alert("Error", "iCould not available");
        return;
      }
      setTitle("Sync Data to iCloud");
      setLoading(true);
      setLoadingText("Syncing Data\n Can take a few minutes...");
      await new Promise((r) => setTimeout(r, 1000));
      try {
        await CloudStore.readFile(
          PathUtils.join(defaultICloudContainerPath, "Documents/backup.json")
        )
          .then((res) => {
            importData(null, res);
          })
          .catch((err) => {
            Alert.alert("Error", "Error Fetching from iCloud");
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
      const rawNotes = await getNotesRaw(realm);
      setPercentage(20);
      const rawOrg = await getRawOrg(realm);
      setPercentage(30);
      const rawEvents = await getRawEvents(realm);
      setPercentage(40);
      const rawContactNoteMap = await getContactNoteMap(realm);
      setPercentage(50);
      const rawNoteOrganisationMap = await getRawNoteOrganisationMap(realm);
      setPercentage(60);
      const rawContactOrganisationMap = await getRawContactOrganisationMap(
        realm
      );
      setPercentage(70);
      const rawEventNoteMap = await getEventNoteMap(realm);
      setPercentage(100);
      return {
        contacts: rawConatcs,
        organisations: rawOrg,
        events: rawEvents,
        notes: rawNotes,
        contactNoteMap: rawContactNoteMap,
        noteOrganisationMap: rawNoteOrganisationMap,
        contactOrganisationMap: rawContactOrganisationMap,
        calendarEventNoteMap: rawEventNoteMap,
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
          <View
            style={[
              { paddingTop: 8, paddingBottom: 20, padding: 16 },
              containserStyle,
            ]}
          >
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
            {showPercentage && (
              <Text
                style={{
                  fontSize: 13,
                  textAlign: "center",
                  marginTop: 20,
                }}
              >
                {`${percentage}%`}
              </Text>
            )}
            {!hideCancel && (
              <Buttons
                text="Cancel"
                containerStyle={{ width: "100%", marginTop: 50 }}
                onPress={hide}
              />
            )}
          </View>
          <CloudJSONModal ref={_cloudJSONRef} />
        </KeyboardAwareScrollView>
      </BottomSheetModal>
    );
  }
);
