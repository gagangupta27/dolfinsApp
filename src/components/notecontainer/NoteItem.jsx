import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { useRef, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import AudioPlayer from "../audio/AudioPlayerV2";
import Document from "./Document";

import * as Sharing from "expo-sharing";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { MarkdownView } from "../../utils/markdown";

import { AntDesign, Feather } from "@expo/vector-icons";

import { Linking } from "react-native";
import {
  BUTTON_NAME,
  EVENTS,
  useTrackWithPageInfo,
} from "../../utils/analytics";

const openFile = async (localUri) => {
  if (Platform.OS === "android") {
    // Android: Use IntentLauncher or Linking
    IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
      data: localUri,
      flags: 1,
    });
  } else {
    // iOS: Use Sharing
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(localUri);
    } else {
      Alert.alert("Sharing not available", "Unable to open file.");
    }
  }
};

const NoteItem = ({
  note,
  contact,
  setEditMode,
  onDelete,
  showAllTags = false,
}) => {
  const copyToClipboard = async (data) => {
    await Clipboard.setStringAsync(data);
    Toast.show({
      type: "success",
      text1: "Copied",
    });
    // toast message
    // copied to clipboard
  };
  const track = useTrackWithPageInfo();
  const noteContainerRef = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);

  const handleLongPress = () => {
    if (!note.readOnly) {
      track(EVENTS.BUTTON_TAPPED.NAME, {
        [EVENTS.BUTTON_TAPPED.KEYS.BUTTON_NAME]: BUTTON_NAME.CHANGE_NOTE,
      });
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const TagSection = () => {
    if (
      note.mentions.length > 0 &&
      note.mentions.some((item) => item.contactId != contact.id)
    ) {
      return (
        <View style={styles.tagsection}>
          <Text style={styles.tagnote}>Also tagged to: </Text>
          {note.mentions
            .filter((item) => item.contactId != contact.id)
            .map((item) => (
              <Text
                style={styles.individualTag}
                key={"mentions_" + item.contactId}
              >
                {item.name}
              </Text>
            ))}
          <View style={styles.horizontalline}></View>
        </View>
      );
    } else {
      return <View></View>;
    }
  };
  const ImageSection = () => {
    if (note.type == "image" && note.imageUri) {
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ImagePreviewScreen", { uri: note.imageUri });
          }}
          onLongPress={handleLongPress}
        >
          <Image
            source={{ uri: note.imageUri }}
            style={{ width: 120, height: 120 }}
          />
        </TouchableOpacity>
      );
    } else {
      return <View></View>;
    }
  };

  const AudioSection = () => {
    if (note.type == "audio" && note.audioUri) {
      return (
        <AudioPlayer
          audioUri={note.audioUri}
          volumeLevels={note.volumeLevels}
        />
      );
    } else {
      return <View></View>;
    }
  };

  const DocumentSection = () => {
    if (note.type == "document" && note.documentUri) {
      return (
        <TouchableOpacity
          style={(flex = 1)}
          onPress={() => openFile(note.documentUri)}
          onLongPress={handleLongPress}
        >
          <Document
            document={{
              documentName: note.documentName,
              documentUri: note.documentUri,
            }}
          />
        </TouchableOpacity>
      );
    } else {
      return <View></View>;
    }
  };

  const getFormattedDate = (updatedAt) => {
    const date = new Date(updatedAt);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    return day + " " + month;
  };
  const navigation = useNavigation();

  return (
    <View style={{ flexDirection: "column" }}>
      <TouchableWithoutFeedback onLongPress={handleLongPress}>
        <View ref={noteContainerRef} style={styles.notecontainer}>
          <TagSection />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 1, flexDirection: "column" }}>
              {note.content && (
                <MarkdownView
                  style={styles.content}
                  onLinkPress={(url) => {
                    Linking.openURL(url);
                  }} // Open a webpage in in-app browser
                >
                  {note.content}
                </MarkdownView>
              )}
              <ImageSection />
              <AudioSection />
              <DocumentSection />
            </View>
            <View style={{ flexDirection: "column" }}>
              {note.updatedAt && (
                <Text
                  style={{
                    maxWidth: 40,
                    padding: 3,
                    color: "#858585",
                    fontFamily: "Inter-Regular",
                    fontSize: 12,
                  }}
                >
                  {getFormattedDate(note.updatedAt)}
                </Text>
              )}
              <TouchableOpacity
                style={{ alignSelf: "center" }}
                onPress={() => copyToClipboard(note.content)}
              >
                <FontAwesome5 name="copy" size={12} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={handleCloseModal}
        backdropColor="rgba(0, 0, 0, 0.8)" // semi-transparent black
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 5,
            borderRadius: 5,
            ...styles.shadow,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              track(EVENTS.BUTTON_TAPPED.NAME, {
                [EVENTS.BUTTON_TAPPED.KEYS.BUTTON_NAME]: BUTTON_NAME.EDIT_NOTE,
              });
              setEditMode({ editMode: true, id: note._id });
              handleCloseModal();
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", padding: 5 }}
            >
              <Feather name="edit" size={24} color="black" />
              <Text
                style={{
                  marginLeft: 5,
                  fontSize: 16,
                  fontFamily: "WorkSans-Medium",
                  letterSpacing: -0.32,
                }}
              >
                Edit
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{ borderWidth: 1, borderColor: "#AFAFAF" }}></View>
          <TouchableOpacity
            onPress={() => {
              track(EVENTS.BUTTON_TAPPED.NAME, {
                [EVENTS.BUTTON_TAPPED.KEYS.BUTTON_NAME]:
                  BUTTON_NAME.DELETE_NOTE,
              });
              onDelete(note._id);
              handleCloseModal();
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", padding: 5 }}
            >
              <AntDesign name="delete" size={24} color="black" />
              <Text
                style={{
                  marginLeft: 5,
                  fontSize: 16,
                  fontFamily: "WorkSans-Medium",
                  letterSpacing: -0.32,
                }}
              >
                Delete
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  notecontainer: {
    margin: 5,
    padding: 10,
    backgroundColor: "#A5A6F62B",
    borderRadius: 5,
  },
  content: {
    flex: 1,
    padding: 3,
    color: "#000000",
    fontSize: 16,
    // fontWeight: '600', // 'normal' is not a valid value in React Native, '400' is equivalent to normal
    fontFamily: "WorkSans-Regular", // You will need to include the font in your project
  },
  item: {
    // justifyContent:'flex-end'
    alignItems: "flex-start",
    justifyContent: "center",
  },
  itemText: {
    paddingHorizontal: 6, // Vertical padding for each item
    marginHorizontal: 4,
    marginVertical: 2,
    backgroundColor: "#F8E6EF", // Border color for each item
    borderRadius: 5,
    height: 24,
    fontSize: 16, // Font size for item text
    color: "#000", // Text color for item text
  },
  tagsection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  tagnote: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  individualTag: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    backgroundColor: "#F8E6EF",
    borderRadius: 5,
    marginRight: 8,
    marginVertical: 5,
    paddingHorizontal: 4,
  },
  horizontalline: {
    marginVertical: 5,
    width: "100%",
    borderWidth: 1,
    borderColor: "#CACACB",
  },
});

export default NoteItem;
