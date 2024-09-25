import { Keyboard, StyleSheet, View } from "react-native";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import ExactTextBox from "./ExactTextBox";
import MultiModalOptions from "./MultiModalOptions.web";
import NoteInputField from "./NoteInputField.web";
import TextFormattingToolbar from "./TextFormattingToolbar.web";
import UserMentionOptionsDropdown from "./UserMentionOptionsDropdown";
import { getLastSubstringAfterAt } from "../../utils/common";
import useAudioRecording from "../../hooks/useAudioRecording.web";
import useDocumentHandler from "../../hooks/DocumentHandler.web";
import useMultiImageHandler from "../../hooks/useMultiImageHandler.web";
import useSearchFilter from "../../hooks/SearchFilter";

const NewNoteContainerV2 = forwardRef(
  ({ addNote, note, updateNote, mentionHasInput = false }, ref) => {
    const noteInputFieldRef = useRef();
    const [shouldIncreaseHeight, setShouldIncreaseHeight] = useState(
      note ? true : false
    );
    const [isFocused, setIsFocused] = useState(note ? true : false);
    const [isMentionFocused, setIsMentionFocused] = useState(false);
    const [content, setContent] = useState(note ? note?.content || "" : "");
    const [mentionData, setMentionData] = useState([]);

    const allContacts = [];
    const allOrgs = [];
    const quickNoteRef = [];

    useEffect(() => {
      if (note) {
        setShouldIncreaseHeight(true);
        setIsFocused(true);
        setContent(note.content);
        setMentionData(
          note?.mentions?.filter((o) => {
            return String(o?._id) != String(quickNoteRef._id);
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
    const { imageData, onImagePress, setImageData } = useMultiImageHandler(
      note && note?.imageData && note?.imageData?.length > 0
        ? note.imageData
        : []
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

    // const handleOptionSelect = async (option) => {
    //   setMentionData([
    //     ...mentionData,
    //     {
    //       _id: new BSON.ObjectId(),
    //       ...option,
    //     },
    //   ]);
    //   const str = await getLastSubstringAfterAt(content);
    //   let newConent = content;
    //   if (str !== null) {
    //     const boldSubstring = `*${
    //       option?.organisation?.name || option?.contact?.name
    //     }* `;
    //     newConent = newConent.replace(`@${str}`, boldSubstring);
    //   }
    //   setContent(newConent);
    //   setSearchText("");
    //   setTimeout(() => {
    //     noteInputFieldRef?.current?.moveCurorToLast(newConent);
    //   }, 300);
    // };

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
      imageData,
      audioUri,
      audioText,
      volumeLevels,
      document
    ) => {
      if (note) {
        updateNote(
          note._id,
          content,
          mentions,
          imageData,
          audioUri,
          audioText,
          volumeLevels,
          document
        );
      } else {
        addNote(
          content,
          mentions,
          imageData,
          audioUri,
          audioText,
          volumeLevels,
          document
        );
      }
    };

    const clear = () => {
      setImageData([]);
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
        imageData?.length > 0 ||
        audioUri ||
        document ||
        recording
      ) {
        setShouldIncreaseHeight(true);
      } else {
        setShouldIncreaseHeight(false);
      }
    }, [imageData, audioUri, document, isFocused, isMentionFocused, recording]);

    return (
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        {!shouldIncreaseHeight && (
          <View style={styles.container1}>
            <ExactTextBox
              content={content}
              setContent={setContent}
              setIsFocused={setIsFocused}
              rightIcons={() => (
                <MultiModalOptions
                  recording={recording}
                  onStartRecording={onStartRecording}
                  onStopRecording={onStopRecording}
                  onImagePress={onImagePress}
                  onDocumentPress={onDocumentPress}
                />
              )}
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

            {/* <UserMentionDropdown
              data={mentionData}
              onMentionSelect={handleMentionSelect}
              searchText={searchText}
              setSearchText={searchFilter}
              setIsMentionFocused={setIsMentionFocused}
              hasTextInput={mentionHasInput}
            /> */}
            <NoteInputField
              ref={noteInputFieldRef}
              addNote={addOrUpdateNote}
              mentions={mentionData}
              imageData={imageData}
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
              {imageData?.length == 0 &&
                !audioUri &&
                !document &&
                !recording && (
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
    backgroundColor: "#1f2221",
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
    backgroundColor: "#1f2221",
  },
  container1: {
    backgroundColor: "#1f2221",
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
});

export default NewNoteContainerV2;
