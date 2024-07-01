import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Sharing from "expo-sharing";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MarkdownView } from "../../utils/markdown";
import AudioPlayer from "../audio/AudioPlayerV2";
import Document from "../notecontainer/Document";

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

const NoteDone = ({ note, contact = { id: 0, name: "Quick Notes" } }) => {
  const navigation = useNavigation();

  const TagSection = () => {
    if (note?.mentions) {
      return (
        <View style={{ flexDirection: "column" }}>
          <View style={styles.tagsection}>
            <Text style={styles.tagnote}>Tagged to: </Text>
            {note?.mentions?.map((item) => (
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
          </View>
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

  return (
    <View style={styles.container}>
      <View style={styles.noteaddedsection}>
        <AntDesign name="checkcircle" size={24} color="green" />
        <Text style={styles.noteaddedtext}>Note added</Text>
      </View>

      <View style={styles.notecontainer}>
        <TagSection />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            {note.content && (
              <MarkdownView style={styles.content}>{note.content}</MarkdownView>
            )}
            <ImageSection />
            <AudioSection />
            <DocumentSection />
          </View>
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
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: 1,
    borderColor: "#A5A6F6",
  },
  noteaddedsection: {
    alignItems: "center",
    justifyContent: "center",
  },
  noteaddedtext: {
    fontSize: 16,
    fontFamily: "WorkSans-Regular",
  },
  horizontalline: {
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#CACACB",
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
  notesarea: {
    padding: 15,
    backgroundColor: "#A5A6F62B",
    borderRadius: 5,
    marginTop: 5,
  },
  notescontent: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  notecontainer: {
    margin: 5,
    padding: 10,
    backgroundColor: "#A5A6F62B",
    borderRadius: 5,
  },
});

export default NoteDone;
