import {
  BUTTON_NAME,
  EVENTS,
  INPUT_NAME,
  useTrackWithPageInfo,
} from "../../utils/analytics";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import AudioPlayer from "../audio/AudioPlayerV2";
import Document from "./Document";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Recording from "../audio/Recording";
import SendButtonIcon from "../icons/SendButtonIcon";

const NoteInputField = forwardRef(
  (
    {
      addNote,
      setIsFocused,
      content,
      setContent,
      mentions,
      imageUri,
      audioUri,
      recording,
      onStopRecording,
      document,
      clear,
      autoFocus,
      volumeLevels,
    },
    ref
  ) => {
    const track = useTrackWithPageInfo();
    const textInputRef = useRef(null);

    const [selection, setSelection] = useState({ start: 0, end: 0 });

    const buttonClicked = () => {
      if (content || imageUri || audioUri || document) {
        track(EVENTS.INPUT_DONE.NAME, {
          [EVENTS.INPUT_START.KEYS.INPUT_NAME]: INPUT_NAME.ADD_TEXT,
        });
        addNote(
          content,
          mentions,
          imageUri,
          audioUri,
          volumeLevels ? volumeLevels : [],
          document
        );
        track(EVENTS.BUTTON_TAPPED.NAME, {
          [EVENTS.BUTTON_TAPPED.KEYS.BUTTON_NAME]: BUTTON_NAME.CONNECT_INTEL,
        });
      }
      setContent("");
      clear();
    };

    useImperativeHandle(
      ref,
      () => ({
        onBoldPress: () => {
          const { start, end } = selection;
          const beforeMatch = content.substring(0, start);
          const match = content.substring(start, end);
          const afterMatch = content.substring(end);
          setContent(beforeMatch + "*" + match + "*" + afterMatch);
          textInputRef.current.focus();
          setTimeout(() => {
            if (start != end) {
              setSelection({ start: start, end: end + 2 });
            } else {
              setSelection({ start: start + 1, end: start + 1 });
            }
          }, 50);
        },
        onItalicPress: () => {
          const { start, end } = selection;
          const beforeMatch = content.substring(0, start);
          const match = content.substring(start, end);
          const afterMatch = content.substring(end);
          setContent(beforeMatch + "_" + match + "_" + afterMatch);
          textInputRef.current.focus();
          setTimeout(() => {
            if (start != end) {
              setSelection({ start: start, end: end + 2 });
            } else {
              setSelection({ start: start + 1, end: start + 1 });
            }
          }, 50);
        },
        onStrikethroughPress: () => {
          const { start, end } = selection;
          const beforeMatch = content.substring(0, start);
          const match = content.substring(start, end);
          const afterMatch = content.substring(end);
          setContent(beforeMatch + "~" + match + "~" + afterMatch);
          textInputRef.current.focus();
          setTimeout(() => {
            if (start != end) {
              setSelection({ start: start, end: end + 2 });
            } else {
              setSelection({ start: start + 1, end: start + 1 });
            }
          }, 50);
        },
        focus: () => {
          textInputRef.current.focus();
        },
        moveCurorToLast: (text) => {
          textInputRef.current.setNativeProps({
            selection: { start: text.length, end: text.length },
          });
        },
      }),
      [textInputRef]
    );

    const onSelectionChange = (event) => {
      setSelection(event.nativeEvent.selection);
    };

    const onFocus = () => {
      track(EVENTS.INPUT_START.NAME, {
        [EVENTS.INPUT_START.KEYS.INPUT_NAME]: INPUT_NAME.ADD_TEXT,
      });
      setIsFocused(true);
    };

    return (
      <View style={[styles.textinputview]}>
        <View style={styles.shadowContainer}>
          {/* Top Shadow */}
          <LinearGradient
            colors={["rgba(174,175,220, 1)", "rgba(165, 166, 246, 0)"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.topShadow}
          />
          {/* Left Shadow */}
          <LinearGradient
            colors={["rgba(174,175,220, 1)", "rgba(165, 166, 246, 0.17)"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.sideShadow}
          />
          {/* Right Shadow */}
          <LinearGradient
            colors={["rgba(174,175,220, 1)", "rgba(165, 166, 246, 0.17)"]}
            start={{ x: 1, y: 0.5 }}
            end={{ x: 0, y: 0.5 }}
            style={[styles.rightShadow]}
          />
        </View>
        <View style={styles.container}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              backgroundColor: "rgba(165, 166, 246, 0.17)",
              paddingBottom: 5,
            }}
          >
            <View style={{ flex: 1, flexDirection: "column" }}>
              {!recording && (
                <TextInput
                  ref={textInputRef}
                  style={[styles.textinput]}
                  multiline
                  value={content}
                  onChangeText={setContent}
                  selection={selection}
                  onSelectionChange={onSelectionChange}
                  placeholder="Add dope about this contact..."
                  placeholderTextColor="#858585" // This is to give the placeholder the subtle color
                  keyboardType="default"
                  returnKeyType="done"
                  onFocus={onFocus}
                  autoFocus={autoFocus}
                  autoCapitalize="none"
                />
              )}
              {imageUri && (
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: 70, height: 70 }}
                />
              )}
              {recording && (
                <Recording
                  volumeLevels={volumeLevels}
                  onStopRecording={onStopRecording}
                />
              )}
              {audioUri && (
                <AudioPlayer audioUri={audioUri} volumeLevels={volumeLevels} />
              )}
              {document && <Document document={document} />}
            </View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-evenly",
                height: "100%",
              }}
            >
              {(imageUri || audioUri || document) && (
                <TouchableOpacity onPress={clear}>
                  <Feather name="x" size={24} color="black" />
                </TouchableOpacity>
              )}
              {!recording && (
                <TouchableOpacity onPress={buttonClicked}>
                  <View style={styles.feather}>
                    <SendButtonIcon />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  textinputview: {
    backgroundColor: "#FFFFFF",
    height: 120,
    // flex:1,
    borderRadius: 15,
    backgroundColor: "rgba(165, 166, 246, 0.17)",

    flexDirection: "row",
    justifyContent: "space-between", // This will position the children at either end
    alignItems: "center",

    marginHorizontal: 10,
    overflow: "hidden",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 5,
    marginTop: 5,
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
    paddingTop: 10,
    paddingHorizontal: 10,
    textAlignVertical: "top", // Add this line
  },
  feather: {
    margin: 5,
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

export default NoteInputField;
