import {
  ActivityIndicator,
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BUTTON_NAME,
  EVENTS,
  GLOBAL_KEYS,
  MODAL_IDENTIFIER_NAME,
  MODAL_NAME,
  useTrackWithPageInfo,
} from "../../utils/analytics";
import Svg, { Path } from "react-native-svg";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  getEducationList,
  getQuickSummary,
  getWorkHistoryList,
} from "../../utils/linkedin";
import {
  updateLinkedinProfile,
  updateLinkedinSummary,
} from "../../realm/queries/contactOperations";
import { useObject, useRealm } from "@realm/react";

import Api from "../../utils/Api";
import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import NotesList from "../notecontainer/NotesList";

const LinkedinDataConnectModal = forwardRef(({ contacId = "" }, ref) => {
  const track = useTrackWithPageInfo();
  const realm = useRealm();

  const contact = contacId ? useObject("Contact", contacId) : {};

  const [visible, setVisible] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [fetchingDataError, setFetchingDataError] = useState(null);
  const [notes, setNotes] = useState([]);
  const [linkedinProfileUrl, setLinkedinProfileUrl] = useState(
    contact.linkedinProfileUrl || ""
  );

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true);
      track(EVENTS.LANDED_ON_MODAL.NAME, {
        [GLOBAL_KEYS.MODAL_NAME]: MODAL_NAME.CONNECT_DATA,
        [GLOBAL_KEYS.MODAL_IDENTIFIER]: MODAL_IDENTIFIER_NAME.LINKEDIN,
      });
    },
  }));

  useEffect(() => {
    if (contact && contact?.linkedinProfileData) {
      const newNotes = [];
      const Dat = JSON.parse(contact?.linkedinProfileData);
      const workHistoryContent = getWorkHistoryList(Dat);
      const educationContent = getEducationList(Dat);
      if (workHistoryContent) {
        newNotes.push({
          _id: "Work_history",
          contactId: contact?.id,
          content: "*Work history* \n\n \n\n" + workHistoryContent,
          mentions: [],
          type: "text",
          nonEditable: true,
          readOnly: true,
        });
      }
      if (educationContent) {
        newNotes.push({
          _id: "education",
          contactId: contact?.id,
          content: "*Education* \n\n \n\n" + educationContent,
          mentions: [],
          type: "text",
          nonEditable: true,
          readOnly: true,
        });
      }
      setNotes(newNotes);
    } else {
      setNotes([]);
    }
  }, [contact?.linkedinProfileData, JSON.stringify(contact?._id)]);

  const fetchLinkedinData = async () => {
    return new Promise((resolve, reject) => {
      Api.post("/api/1.0/user/linkedin-details", {
        profile_url: linkedinProfileUrl,
      })
        .then((res) => {
          const data = res?.data;
          if (data && data?.response) {
            resolve(data?.response);
            updateLinkedinProfile(realm, contact._id, data.response);
          } else {
            resolve(null);
            setFetchingDataError(
              "Having trouble connecting to linkedin at the moment.\n Could you check if the linkedin profile url is correct?"
            );
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          resolve(null);
        });
    });
  };

  const fetchLinkedinSummary = async (data) => {
    let quickSummary = await getQuickSummary(JSON.stringify(data));
    updateLinkedinSummary(realm, contact._id, quickSummary);
    return quickSummary;
  };

  const scrape = async () => {
    track(EVENTS.BUTTON_TAPPED.NAME, {
      [GLOBAL_KEYS.MODAL_NAME]: MODAL_NAME.CONNECT_DATA,
      [GLOBAL_KEYS.MODAL_IDENTIFIER]: MODAL_IDENTIFIER_NAME.LINKEDIN,
      [EVENTS.BUTTON_TAPPED.KEYS.BUTTON_NAME]: BUTTON_NAME.ADD_LINKEDIN_URL,
      [EVENTS.BUTTON_TAPPED.KEYS.BUTTON_IDENTIFIER]: linkedinProfileUrl,
    });
    setFetchingDataError(null);
    setFetchingData(true);
    const data = await fetchLinkedinData();
    if (!data) {
      setFetchingData(false);
      return;
    }

    const quickSummary = await fetchLinkedinSummary(data);
    if (!quickSummary) {
      return;
    }
    setFetchingData(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                marginVertical: 10,
                fontFamily: "WorkSans-Bold",
                fontSize: 19,
              }}
            >
              {contact.name}'s LinkedIn
            </Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Entypo name="circle-with-cross" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginVertical: 2,
              borderWidth: 1,
              borderColor: "#D9D9D9",
            }}
          ></View>
          <View style={{}}>
            <View style={[styles.textinputview]}>
              <View style={styles.shadowContainer}>
                {/* Top Shadow */}
                <LinearGradient
                  colors={["black", "rgba(0, 0, 0, 0)"]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.topShadow}
                />
                {/* Left Shadow */}
                <LinearGradient
                  colors={["black", "rgba(0, 0, 0, 0)"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.sideShadow}
                />
                {/* Right Shadow */}
                <LinearGradient
                  colors={["black", "rgba(0, 0, 0, 0)"]}
                  start={{ x: 1, y: 0.5 }}
                  end={{ x: 0, y: 0.5 }}
                  style={[styles.rightShadow]}
                />
              </View>
              <View style={styles.textcontainer}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    backgroundColor: "rgba(255, 255, 255, 0.17)",
                  }}
                >
                  <View style={{ flex: 1, flexDirection: "column" }}>
                    <TextInput
                      style={[styles.textinput]}
                      value={linkedinProfileUrl}
                      onChangeText={setLinkedinProfileUrl}
                      placeholder="Linkedin Url - https://linkedin.com/in/username"
                      placeholderTextColor="#858585" // This is to give the placeholder the subtle color
                      keyboardType="default"
                      returnKeyType="done"
                    />
                  </View>
                </View>
              </View>
            </View>
            {!contact?.linkedinProfileData && fetchingData && (
              <Button
                style={{
                  margin: 20,
                  padding: 10,
                  justifyContent: "flex-start",
                  backgroundColor: "#F178B6",
                  borderRadius: 5,
                }}
                onPress={scrape}
                title={fetchingData ? "Fetching" : "Connect Linkedin"}
              ></Button>
            )}

            <TouchableOpacity
              style={{
                alignItems: "center",
                alignSelf: "center",
                marginLeft: 20,
              }}
              onPress={scrape}
            >
              <Svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M20 8C20 8 17.995 5.26822 16.3662 3.63824C14.7373 2.00827 12.4864 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19C14.1031 19 17.5649 16.2543 18.6482 12.5M20 8V2M20 8H14"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>
          {fetchingDataError ? (
            <View
              style={{
                alignItems: "center",
                padding: 30,
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontFamily: "WorkSans-Bold",
                  fontSize: 16,
                  letterSpacing: -0.32,
                  color: "red",
                }}
              >
                {fetchingDataError}
              </Text>
            </View>
          ) : fetchingData ? (
            <View
              style={{
                alignItems: "center",
                padding: 30,
                flexDirection: "row",
              }}
            >
              <ActivityIndicator
                style={{ padding: 15 }}
                size="small"
                color="#0000ff"
              />
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "WorkSans-Bold",
                    fontSize: 16,
                    letterSpacing: -0.32,
                  }}
                >
                  We're working our magic
                </Text>
                <Text
                  style={{
                    fontFamily: "WorkSans-Regular",
                    fontSize: 16,
                    letterSpacing: -0.32,
                  }}
                >
                  This may take 60 seconds
                </Text>
              </View>
            </View>
          ) : (
            <NotesList
              notes={[
                contact && contact?.linkedinSummary
                  ? {
                      _id: "quick_summary",
                      contactId: contact?.id,
                      content:
                        "*Quick Summary* \n\n \n\n" + contact?.linkedinSummary,
                      mentions: [],
                      type: "text",
                      nonEditable: true,
                    }
                  : null,
                ...notes,
              ]}
              setEditMode={(x) => {}}
              contact={contact}
              onDelete={(x) => {}}
            />
          )}
        </View>
      </View>
    </Modal>
  );
});

export default memo(LinkedinDataConnectModal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginTop: 80,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: "#A5A6F6",
    borderWidth: 1,
    padding: 20,
  },
  done: {
    fontSize: 20,
    fontFamily: "WorkSans-Bold",
    color: "#000",
  },
  textinputview: {
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    height: 50,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.17)",
    flexDirection: "row",
    justifyContent: "space-between", // This will position the children at either end
    alignItems: "center",
    marginHorizontal: 10,
    overflow: "hidden",
  },
  textcontainer: {
    flex: 1,
    flexDirection: "row",
    margin: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#FFFFFF",
    position: "absolute", // Position text input absolutely to overlap the SVG
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  textinput: {
    flex: 1,
    paddingHorizontal: 10,
    textAlignVertical: "top", // Add this line
  },
  shadowContainer: {
    position: "absolute",
    borderRadius: 15,
    top: 0, // Adjust this to control the vertical position of the shadow
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%", // Adjust this to control the fade out distance
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-start", // Align gradient to the top,
    zIndex: -1,
  },
  topShadow: {
    position: "absolute",
    top: 0,
    height: 15, // Adjust the height to control the fade length of the shadow
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
  },
  sideShadow: {
    position: "absolute",
    left: 0,
    width: 5, // Adjust the width to control the fade width of the shadow
    height: "100%",
    borderRadius: 15,
    overflow: "hidden",
  },
  rightShadow: {
    position: "absolute",
    right: 0,
    width: 5,
    height: "100%",
    borderRadius: 15,
    overflow: "hidden",
  },
});
