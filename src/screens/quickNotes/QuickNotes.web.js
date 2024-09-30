import {
  FlatList,
  KeyboardAvoidingView,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Path, Svg } from "react-native-svg";
import { TouchableWithoutFeedback, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";

import Header from "../../components/common/Header";
import NewNoteContainerV2 from "../../components/notecontainer/NewNoteContainerV2.web";
import NotesList from "../../components/notecontainer/NotesList.web";
import React from "react";
import { generateUUID } from "../../utils/common";
import { setWebDataApi } from "../../redux/reducer/webSlice";

const QuickNotes = ({ route }) => {
  const [editMode, setEditMode] = useState({ editMode: false, id: null });
  const [loading, setLoading] = useState(false);

  const isDark = useSelector((state) => state.app.isDark);
  const webData = useSelector((state) => state.web.webData);

  const dispatch = useDispatch();
  const noteRef = useRef();

  const noteIds = Array.isArray(webData?.contactNoteMap)
    ? webData?.contactNoteMap
        ?.filter((o) => o?.contactId == "000000000000000000000000")
        ?.map((j) => j?.noteId)
    : [];

  const notes = Array.isArray(webData?.notes)
    ? webData?.notes?.filter((o) => [...noteIds].includes(o?._id))
    : [];

  const addNote = async (
    content,
    mentions,
    imageData,
    audioUri,
    audioText,
    volumeLevels,
    document
  ) => {
    if (
      !mentions.some(
        (mention) =>
          String(mention?.contact?._id || mention?.organisation?._id) ===
          "000000000000000000000000"
      )
    ) {
      mentions.push({
        _id: generateUUID(),
        contact: {
          _id: "000000000000000000000000",
        },
      });
    }
    let newLineIndex = content.indexOf("\n");
    let newConent = "";
    if (newLineIndex != -1) {
      newConent += `*${content.substring(
        0,
        newLineIndex
      )}*\n${content.substring(newLineIndex + 1)}`;
    } else {
      newConent = content;
    }
    setLoading(true);
    const newNoteID = generateUUID();
    dispatch(
      setWebDataApi({
        ...webData,
        notes: [
          ...(webData?.notes || []),
          {
            _id: newNoteID,
            content: newConent,
            mentions: mentions || [],
            type:
              imageData?.length > 0
                ? "image"
                : audioUri
                ? "audio"
                : document
                ? "document"
                : "text",
            imageData: imageData || [],
            audioUri: audioUri || null,
            audioText: audioText || null,
            volumeLevels: volumeLevels || [],
            documentUri: document ? document.documentUri : null,
            documentName: document ? document.documentName : null,
            isPinned: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        contactNoteMap: [
          ...(webData?.contactNoteMap || []),
          {
            _id: generateUUID(),
            contactId: "000000000000000000000000",
            noteId: newNoteID,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      })
    )
      .then((res) => {
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        alert("Error");
        console.log("err", err);
      });
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (noteRef.current) {
          noteRef.current.unfocus();
        }
      }}
    >
      <View style={{ flex: 1, backgroundColor: isDark ? "#181b1a" : "#fff" }}>
        <Header title={"All Quick Notes"} />
        <View
          style={{
            padding: 24,
          }}
        >
          <NotesList
            // ref={notesListRef}
            notes={notes}
            setEditMode={setEditMode}
            contact={{}}
            onDelete={() => {}}
            showPin={true}
            onPinPress={() => {}}
          />
        </View>

        <NewNoteContainerV2
          ref={noteRef}
          addNote={addNote}
          loadingAPI={loading}
          note={editMode.editMode && editMode.note}
          updateNote={() => {}}
          mentionHasInput={false}
          type={"contact"}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default QuickNotes;
