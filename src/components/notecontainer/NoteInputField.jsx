import {
  BUTTON_NAME,
  EVENTS,
  INPUT_NAME,
  useTrackWithPageInfo,
} from "../../utils/analytics";
import {
  Dimensions,
  Image,
  ScrollView,
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
import ExportImportModal from "../../screens/profile/ExportImportModal";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Loader from "../common/Loader";
import Recording from "../audio/Recording";
import SendButtonIcon from "../icons/SendButtonIcon";
import { useSelector } from "react-redux";

const NoteInputField = forwardRef(
  (
    {
      addNote,
      setIsFocused,
      content,
      setContent,
      mentions,
      imageData,
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
    const _loadingRef = useRef();

    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const [loading, setLoading] = useState(false);

    const authData = useSelector((state) => state.app.authData);

    const buttonClicked = async () => {
      if (content || imageData?.length > 0 || audioUri || document) {
        track(EVENTS.INPUT_DONE.NAME, {
          [EVENTS.INPUT_START.KEYS.INPUT_NAME]: INPUT_NAME.ADD_TEXT,
        });
        let audioText = "";
        if (audioUri) {
          setLoading(true);
          const formData = new FormData();
          formData.append("audio", {
            uri: audioUri,
            type: "audio/m4a",
            name: "audio.m4a",
          });

          audioText = await fetch(
            "https://dolfins-server-development.up.railway.app/api/1.0/user/transcribe_audio",
            {
              method: "POST",
              body: formData,
              headers: {
                "Content-Type": "multipart/form-data",
                authorization: "Bearer " + authData?.idToken,
              },
            }
          )
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              return data?.transcript || "";
            })
            .catch((error) => {
              console.error("Error transcribing audio:", error);
              setLoading(false);
              return "";
            });
          setLoading(false);
        }
        let tempImageData = [];
        let count = 0;
        if (imageData && imageData?.length > 0) {
          for await (const image of imageData) {
            ++count;
            _loadingRef?.current?.showLoading(
              "Converting Images",
              `Preparing Data\n${count}/${imageData?.length}`
            );
            const formData = new FormData();
            formData.append("image", {
              uri: image?.uri,
              type: "png/jpeg",
              name: "image.png",
            });

            let imageText = await fetch(
              "https://dolfins-server-development.up.railway.app/api/1.0/user/ocr/image",
              {
                method: "POST",
                body: formData,
                headers: {
                  "Content-Type": "multipart/form-data",
                  authorization: "Bearer " + authData?.idToken,
                },
              }
            )
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                return data?.text || "";
              })
              .catch((error) => {
                console.error("Error transcribing image:", error);
                setLoading(false);
                return "";
              });
            tempImageData.push({ ...image, imageText: imageText });
          }
          _loadingRef?.current?.hide();
          setLoading(false);
        }

        addNote(
          `${content}${
            audioText?.length > 0 ? `\n\nTranscribed Audio: ${audioText}` : ""
          }${
            tempImageData?.length > 0
              ? `\n\nImage Description :${tempImageData?.map(
                  (o) => `${o?.imageText} \n\n`
                )}`
              : ""
          }`,
          mentions,
          tempImageData,
          audioUri,
          audioText,
          volumeLevels ? volumeLevels : [],
          document
        );
        track(EVENTS.BUTTON_TAPPED.NAME, {
          [EVENTS.BUTTON_TAPPED.KEYS.BUTTON_NAME]: BUTTON_NAME.CONNECT_INTEL,
        });

        setContent("");
        clear();
      }
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
        <View style={styles.container}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              backgroundColor: "rgba(255, 255, 255, 0.17)",
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
                  placeholder="Add note about this contact..."
                  placeholderTextColor="#858585" // This is to give the placeholder the subtle color
                  keyboardType="default"
                  returnKeyType="done"
                  onFocus={onFocus}
                  autoFocus={autoFocus}
                  autoCapitalize="none"
                />
              )}
              {imageData && imageData?.length > 0 && (
                <ScrollView horizontal>
                  {imageData?.map((o, idx) => (
                    <Image
                      source={{ uri: o?.uri }}
                      key={idx}
                      style={{ width: 70, height: 70, marginRight: 10 }}
                    />
                  ))}
                </ScrollView>
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
              {(imageData?.length > 0 || audioUri || document) && (
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
        <Loader loading={loading} />
        <ExportImportModal
          hideCancel={true}
          showPercentage={false}
          ref={_loadingRef}
          containserStyle={{
            paddingBottom: 100,
          }}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  textinputview: {
    backgroundColor: "#FFFFFF",
    height: Dimensions.get("screen").height * 0.4,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.17)",
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
