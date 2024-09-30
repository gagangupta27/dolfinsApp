import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";

import { AntDesign, Feather } from "@expo/vector-icons";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { useRef, useState } from "react";

import Document from "./Document";
import { FontAwesome5 } from "@expo/vector-icons";
import { Linking } from "react-native";
import { MarkdownView } from "../../utils/markdown";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";

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
  showPin = false,
  onPinPress = () => {},
}) => {
  const copyToClipboard = async (data) => {
    await Clipboard.setStringAsync(data);
  };
  const noteContainerRef = useRef(null);
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);

  const handleLongPress = () => {
    if (!note.readOnly) {
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const TagSection = () => {
    if (
      note?.mentions &&
      note?.mentions?.some(
        (item) =>
          String(item?.contact?._id || item?.organisation?._id) !=
          String(contact?._id)
      )
    ) {
      return (
        <View style={styles.tagsection}>
          <Text style={styles.tagnote}>Also tagged to: </Text>
          {note?.mentions
            .filter(
              (item) =>
                String(item?.contact?._id || item?.organisation?._id) !=
                String(contact?._id)
            )
            .map((item) => (
              <Text
                style={styles.individualTag}
                key={
                  "mentions_" +
                  String(item?.contact?._id || item?.organisation?._id)
                }
              >
                {item?.contact?.name || item?.organisation?.name}
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
    if (
      note.type == "image" &&
      note?.imageData &&
      note?.imageData?.length > 0
    ) {
      return (
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          {note?.imageData?.map((o, idx) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ImagePreviewScreen", {
                  uri: o?.uri || "",
                });
              }}
              style={{
                marginRight: 10,
              }}
              key={idx}
            >
              <Image
                source={{ uri: o?.uri || "" }}
                style={{ width: 120, height: 120 }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
    } else {
      return <View></View>;
    }
  };

  const AudioSection = () => {
    if (note.type == "audio" && note.audioUri) {
      //   return (
      //     <AudioPlayer
      //       audioUri={note.audioUri}
      //       volumeLevels={note.volumeLevels}
      //     />
      //   );
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

  if (!note || (note?.isValid && !note?.isValid())) {
    return <></>;
  }

  return (
    <View style={{ flexDirection: "column", marginBottom: 10 }}>
      <TouchableOpacity style={styles.row} onLongPress={handleLongPress}>
        <View ref={noteContainerRef} style={styles.notecontainer}>
          <TagSection />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
              }}
            >
              {note.content && (
                <Text
                  style={styles.content}
                  onLinkPress={(url) => {
                    Linking.openURL(url);
                  }} // Open a webpage in in-app browser
                >
                  {note.content}
                </Text>
              )}
              <ImageSection />
              <AudioSection />
              <DocumentSection />
            </View>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity onPress={() => copyToClipboard(note.content)}>
                <FontAwesome5 name="copy" size={15} color="#b0b0b0" />
              </TouchableOpacity>
              {showPin && note?._id != -7 && (
                <TouchableOpacity
                  style={{ paddingVertical: 10 }}
                  onPress={onPinPress}
                >
                  <Svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={note?.isPinned ? "black" : "none"}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <Path
                      d="M8.3767 15.6163L2.71985 21.2732M11.6944 6.64181L10.1335 8.2027C10.0062 8.33003 9.94252 8.39369 9.86999 8.44427C9.80561 8.48917 9.73616 8.52634 9.66309 8.555C9.58077 8.58729 9.49249 8.60495 9.31592 8.64026L5.65145 9.37315C4.69915 9.56361 4.223 9.65884 4.00024 9.9099C3.80617 10.1286 3.71755 10.4213 3.75771 10.7109C3.8038 11.0434 4.14715 11.3867 4.83387 12.0735L11.9196 19.1592C12.6063 19.8459 12.9497 20.1893 13.2821 20.2354C13.5718 20.2755 13.8645 20.1869 14.0832 19.9928C14.3342 19.7701 14.4294 19.2939 14.6199 18.3416L15.3528 14.6771C15.3881 14.5006 15.4058 14.4123 15.4381 14.33C15.4667 14.2569 15.5039 14.1875 15.5488 14.1231C15.5994 14.0505 15.663 13.9869 15.7904 13.8596L17.3512 12.2987C17.4326 12.2173 17.4734 12.1766 17.5181 12.141C17.5578 12.1095 17.5999 12.081 17.644 12.0558C17.6936 12.0274 17.7465 12.0048 17.8523 11.9594L20.3467 10.8904C21.0744 10.5785 21.4383 10.4226 21.6035 10.1706C21.7481 9.95025 21.7998 9.68175 21.7474 9.42348C21.6875 9.12813 21.4076 8.84822 20.8478 8.28839L15.7047 3.14526C15.1448 2.58543 14.8649 2.30552 14.5696 2.24565C14.3113 2.19329 14.0428 2.245 13.8225 2.38953C13.5705 2.55481 13.4145 2.91866 13.1027 3.64636L12.0337 6.14071C11.9883 6.24653 11.9656 6.29944 11.9373 6.34905C11.9121 6.39313 11.8836 6.43522 11.852 6.47496C11.8165 6.51971 11.7758 6.56041 11.6944 6.64181Z"
                      stroke="#b0b0b0"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </Svg>
                </TouchableOpacity>
              )}
              {note.updatedAt && (
                <Text
                  style={{
                    maxWidth: 40,
                    padding: 3,
                    color: "#b0b0b0",
                    fontFamily: "Inter-Regular",
                    fontSize: 12,
                  }}
                >
                  {getFormattedDate(note.updatedAt)}
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={handleCloseModal}
        backdropColor="rgba(0, 0, 0, 0.8)" // semi-transparent black
      >
        <View
          style={{
            backgroundColor: "#1f2221",
            padding: 5,
            borderRadius: 5,
            ...styles.shadow,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setEditMode({ editMode: true, id: note._id, note: note });
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
    borderRadius: 5,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1f2221",
    // paddingRight: 10,
  },
  content: {
    flex: 1,
    padding: 3,
    color: "#b0b0b0",
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
    color: "#b0b0b0",
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
