import { Keyboard, StyleSheet, View } from "react-native";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import ExactTextBox from "./ExactTextBox";
import MultiModalOptions from "./MultiModalOptions";
import NoteInputField from "./NoteInputField";
import TextFormattingToolbar from "./TextFormattingToolbar";
import UserMentionDropdown from "./UserMentionDropdown";
import UserMentionOptionsDropdown from "./UserMentionOptionsDropdown";
import { getLastSubstringAfterAt } from "../../utils/common";
import useAudioRecording from "../../hooks/AudioRecording";
import useDocumentHandler from "../../hooks/DocumentHandler";
import useImageHandler from "../../hooks/ImageHandler";
import useSearchFilter from "../../hooks/SearchFilter";
import { BSON } from "realm";
import { useQuery } from "@realm/react";
import Contact from "../../realm/models/Contact";
import Organisation from "../../realm/models/Organisation";

const NewNoteContainerV2 = forwardRef(
  ({ addNote, note, updateNote, mentionHasInput = true }, ref) => {
    const noteInputFieldRef = useRef();
    const [shouldIncreaseHeight, setShouldIncreaseHeight] = useState(
      note ? true : false
    );
    const [isFocused, setIsFocused] = useState(note ? true : false);
    const [isMentionFocused, setIsMentionFocused] = useState(false);
    const [content, setContent] = useState(note ? note?.content || "" : "");
    const [mentionData, setMentionData] = useState([]);

    const allContacts = useQuery(Contact);
    const allOrgs = useQuery(Organisation);

    useEffect(() => {
      if (note) {
        setShouldIncreaseHeight(true);
        setIsFocused(true);
        setContent(note.content);
        setMentionData(
          note?.mentions?.filter((o) => {
            return String(o?._id) != "000000000000000000000000";
          }) || []
        );
      } else {
        setShouldIncreaseHeight(false);
        setIsFocused(false);
        setContent("");
      }
    }, [note]);

    const { searchText, setSearchText, searchFilter, filteredContacts } =
      useSearchFilter(
        [
          ...allContacts.map((o) => ({ contact: o })),
          ...allOrgs.map((o) => ({ organisation: o })),
        ],
        mentionData
      );

    const {
      recording,
      onStartRecording,
      onStopRecording,
      audioUri,
      setAudioUri,
      setRecording,
      volumeLevels,
      setVolumeLevels,
    } = useAudioRecording(note && note.audioUri ? note.audioUri : null);
    const { document, onDocumentPress, setDocument } = useDocumentHandler(
      note && note.documentUri && note.documentName
        ? { documentUri: note.documentUri, documentName: note.documentName }
        : null
    );
    const { imageUri, onImagePress, setImageUri } = useImageHandler(
      note && note.imageUri ? note.imageUri : null
    );

    const handleMentionSelect = (user) => {
      setContent((prev) => {
        return prev?.replace(
          `*${user?.contact?.name || user?.organisation?.name}*`,
          ""
        );
      });
      setSearchText("");
      setMentionData((prev) =>
        prev.filter((o) => {
          return (
            String(o?.contact?._id || o?.organisation?._id) !=
            String(user?.contact?._id || user?.organisation?._id)
          );
        })
      );
    };

    const handleOptionSelect = async (option) => {
      setMentionData([
        ...mentionData,
        {
          _id: new BSON.ObjectId(),
          ...option,
        },
      ]);
      const str = await getLastSubstringAfterAt(content);
      let newConent = content;
      if (str !== null) {
        const boldSubstring = `*${
          option?.organisation?.name || option?.contact?.name
        }* `;
        newConent = newConent.replace(`@${str}`, boldSubstring);
      }
      setContent(newConent);
      setSearchText("");
      setTimeout(() => {
        noteInputFieldRef?.current?.moveCurorToLast(newConent);
      }, 300);
    };

    const handleBoldPress = () => {
      noteInputFieldRef.current.onBoldPress();
    };
    const handleItalicPress = () => {
      noteInputFieldRef.current.onItalicPress();
    };
    const handleStrikethroughPress = () => {
      noteInputFieldRef.current.onStrikethroughPress();
    };

    const addOrUpdateNote = (
      content,
      mentions,
      imageUri,
      audioUri,
      volumeLevels,
      document
    ) => {
      if (note) {
        updateNote(
          note._id,
          content,
          mentions,
          imageUri,
          audioUri,
          volumeLevels,
          document
        );
      } else {
        addNote(content, mentions, imageUri, audioUri, volumeLevels, document);
      }
    };

    const clear = () => {
      setImageUri(null);
      setRecording(null);
      setAudioUri(null);
      setVolumeLevels([]);
      setDocument(null);
      setMentionData([]);
      setIsFocused(false);
      setIsMentionFocused(false);
      setShouldIncreaseHeight(false);
    };

    useImperativeHandle(ref, () => ({
      unfocus: () => {
        Keyboard.dismiss();
        setIsFocused(false);
        setIsMentionFocused(false);
        setShouldIncreaseHeight(false);
      },
    }));

    useEffect(() => {
      if (
        isFocused ||
        isMentionFocused ||
        imageUri ||
        audioUri ||
        document ||
        recording
      ) {
        setShouldIncreaseHeight(true);
      } else {
        setShouldIncreaseHeight(false);
      }
    }, [imageUri, audioUri, document, isFocused, isMentionFocused, recording]);

    return (
      <View>
        {!shouldIncreaseHeight && (
          <View style={styles.container1}>
            <ExactTextBox
              content={content}
              setContent={setContent}
              setIsFocused={setIsFocused}
            />
            <MultiModalOptions
              recording={recording}
              onStartRecording={onStartRecording}
              onStopRecording={onStopRecording}
              onImagePress={onImagePress}
              onDocumentPress={onDocumentPress}
            />
          </View>
        )}
        {shouldIncreaseHeight && (
          <View style={styles.container}>
            {searchText && (
              <UserMentionOptionsDropdown
                filteredContacts={filteredContacts}
                onSelectOption={handleOptionSelect}
              />
            )}

            <UserMentionDropdown
              data={mentionData}
              onMentionSelect={handleMentionSelect}
              searchText={searchText}
              setSearchText={searchFilter}
              setIsMentionFocused={setIsMentionFocused}
              hasTextInput={mentionHasInput}
            />
            <NoteInputField
              ref={noteInputFieldRef}
              addNote={addOrUpdateNote}
              mentions={mentionData}
              imageUri={imageUri}
              audioUri={audioUri}
              recording={recording}
              onStopRecording={onStopRecording}
              volumeLevels={volumeLevels}
              document={document}
              content={content}
              setContent={async (txt) => {
                setContent(txt);
                const matches = await getLastSubstringAfterAt(txt);
                if (matches && matches?.length > 0) {
                  searchFilter(matches);
                  setSearchText(matches);
                } else {
                  searchFilter("");
                  setSearchText("");
                }
              }}
              setIsFocused={setIsFocused}
              autoFocus={isFocused}
              clear={clear}
            />

            <View style={styles.lowerpart}>
              {!recording && (
                <TextFormattingToolbar
                  onBoldPress={handleBoldPress}
                  onItalicPress={handleItalicPress}
                  onStrikethroughPress={handleStrikethroughPress}
                />
              )}
              {!imageUri && !audioUri && !document && !recording && (
                <View>
                  <View style={styles.verticalline}></View>
                  <MultiModalOptions
                    recording={recording}
                    onStartRecording={onStartRecording}
                    onStopRecording={onStopRecording}
                    onImagePress={onImagePress}
                    onDocumentPress={onDocumentPress}
                  />
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderWidth: 1,
    borderColor: "#A5A6F6",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: {
      width: -5,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    paddingTop: 15,
  },
  lowerpart: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  container1: {
    borderWidth: 1,
    borderColor: "#A5A6F6",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: {
      width: -5,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  shadowContainer: {
    position: "absolute",
    borderTopLeftRadius: 15,
    borderTopEndRadius: 15,
    top: 0, // Adjust this to change the position of the shadow
    left: 0,
    right: 0,
    height: 10,
    overflow: "hidden", // This is crucial to ensure the shadow doesn't show on other sides
    alignItems: "center",
  },
  shadow: {
    height: 20, // Adjust the height to control how far the shadow extends
    width: "100%",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5, // Only needed for Android
  },
  gradientShadow: {
    borderTopLeftRadius: 15,
    borderTopEndRadius: 15,
    width: "100%",
    height: 10, // Same as the container height to create a fading effect
  },
});

export default NewNoteContainerV2;
