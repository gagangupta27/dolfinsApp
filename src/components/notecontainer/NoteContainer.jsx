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
import useAudioRecording from "../../hooks/AudioRecording";
import useContactPermission from "../../hooks/ContactPermission";
import useDocumentHandler from "../../hooks/DocumentHandler";
import useImageHandler from "../../hooks/ImageHandler";
import useSearchFilter from "../../hooks/SearchFilter";

const NewNoteContainer = forwardRef(
  ({ addNote, contact, note, updateNote, mentionHasInput = true }, ref) => {
    const noteInputFieldRef = useRef();
    const [shouldIncreaseHeight, setShouldIncreaseHeight] = useState(
      note ? true : false
    );
    const [isFocused, setIsFocused] = useState(note ? true : false);
    const [isMentionFocused, setIsMentionFocused] = useState(false);
    const [content, setContent] = useState(note ? note.content : "");
    const [isTagging, setIsTagging] = useState(false);
    const [mentionData, setMentionData] = useState(
      note && note.mentions
        ? note.mentions
        : contact.name != "Calendar"
        ? [{ contactId: contact.id, name: contact.name }]
        : []
    );

    useEffect(() => {
      if (note) {
        setShouldIncreaseHeight(true);
        setIsFocused(true);
        setContent(note.content);
      } else {
        setShouldIncreaseHeight(false);
        setIsFocused(false);
        setContent("");
      }
    }, [note]);

    const contacts = useContactPermission();
    const { searchText, setSearchText, searchFilter, filteredContacts } =
      useSearchFilter(contacts, mentionData);
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
      console.log(user);
      const remaining = mentionData.filter(
        (mention) => mention.contactId != (user.id || user?.contactId)
      );
      setMentionData(remaining);
    };

    const handleOptionSelect = (option) => {
      const exisiting = mentionData.filter(
        (mention) => mention.contactId == option.id
      );
      if (exisiting.length == 0) {
        setMentionData([
          ...mentionData,
          { contactId: option.id, name: option.name },
        ]);
      }
      setSearchText("");
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
      setMentionData([contact]);
      setIsFocused(false);
      setIsMentionFocused(false);
      setShouldIncreaseHeight(false);
    };

    useImperativeHandle(ref, () => ({
      unfocus: () => {
        Keyboard.dismiss();
        if (
          mentionData.length == 0 ||
          (mentionData.length == 1 &&
            mentionData.some((m) => m.id == contact.id))
        ) {
          setIsFocused(false);
          setIsMentionFocused(false);
          setShouldIncreaseHeight(false);
        }
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
            {searchText && filteredContacts.length > 0 && (
              <UserMentionOptionsDropdown
                filteredContacts={filteredContacts}
                onSelectOption={handleOptionSelect}
              />
            )}
            {
              <UserMentionDropdown
                data={mentionData}
                onMentionSelect={handleMentionSelect}
                searchText={searchText}
                setSearchText={searchFilter}
                setIsMentionFocused={setIsMentionFocused}
                hasTextInput={mentionHasInput}
              />
            }

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
              setContent={(txt) => {
                setContent(txt);
                if (txt?.includes("@")) {
                  setIsTagging(true);
                  console.log("true");
                } else {
                  setIsTagging(false);
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

export default NewNoteContainer;
