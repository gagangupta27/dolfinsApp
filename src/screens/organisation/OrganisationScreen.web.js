import {
  Linking,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";

import AddOrgModalWeb from "../../components/organisation/AddOrgModal.web";
import Feather from "@expo/vector-icons/Feather";
import Header from "../../components/common/Header";
import NewNoteContainerV2 from "../../components/notecontainer/NewNoteContainerV2.web";
import NotesList from "../../components/notecontainer/NotesList.web";
import React from "react";
import { View } from "react-native";
import { generateUUID } from "../../utils/common";
import { setWebDataApi } from "../../redux/reducer/webSlice";

const OrganisationScreen = ({ route }) => {
  const [editMode, setEditMode] = useState({ editMode: false, id: null });
  const [loading, setLoading] = useState(false);

  const isDark = useSelector((state) => state.app.isDark);
  const webData = useSelector((state) => state.web.webData);

  const dispatch = useDispatch();
  const noteRef = useRef(null);
  const _editOrgModal = useRef(null);

  const organisation = Array.isArray(webData?.organisations)
    ? webData?.organisations?.find(
        (o) => o?._id == route?.params?.organisation?._id
      )
    : null;

  const noteIds = Array.isArray(webData?.noteOrganisationMap)
    ? webData?.noteOrganisationMap
        ?.filter((o) => o?.organisationId == organisation?._id)
        ?.map((j) => j?.noteId)
    : [];

  const notes = Array.isArray(webData?.notes)
    ? webData?.notes?.filter((o) => [...noteIds].includes(o?._id))
    : [];

  console.log("notes", notes);

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
      mentions &&
      !mentions.some(
        (mention) =>
          String(mention?.contact?._id || mention?.organisation?._id) ===
          String(organisation._id)
      )
    ) {
      mentions.push({
        _id: generateUUID(),
        organisation: organisation,
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
        noteOrganisationMap: [
          ...(webData?.noteOrganisationMap || []),
          {
            _id: generateUUID(),
            organisationId: organisation?._id,
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
        <Header
          rightIcons={() => (
            <TouchableOpacity
              style={[{ marginLeft: 8 }]}
              onPress={() =>
                _editOrgModal?.current?.show("Edit Organization", organisation)
              }
            >
              <Feather name="edit-2" size={24} color="#b0b0b0" />
            </TouchableOpacity>
          )}
          title={organisation?.name}
        />
        <View
          style={{
            padding: 24,
          }}
        >
          <View
            style={{
              padding: 16,
              backgroundColor: "#1f2221",
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "#b0b0b0",
              }}
            >
              {organisation?.name}
            </Text>
            <TouchableOpacity
              style={{
                paddingTop: 8,
              }}
              onPress={() => Linking.openURL(organisation?.linkedinUrl)}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "blue",
                }}
              >
                {organisation?.linkedinUrl}
              </Text>
            </TouchableOpacity>
            {Array.isArray(organisation?.links) &&
              organisation?.links?.length > 0 && (
                <View
                  style={{
                    marginTop: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#b0b0b0",
                    }}
                  >
                    {"Additional Links"}
                  </Text>
                  {organisation?.links?.map((o, idx) => (
                    <TouchableOpacity
                      style={{
                        paddingTop: 8,
                      }}
                      key={idx}
                      onPress={() => Linking.openURL(o)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: "blue",
                        }}
                      >
                        {o}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
          </View>
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
        <AddOrgModalWeb ref={_editOrgModal} />
        <NewNoteContainerV2
          ref={noteRef}
          addNote={addNote}
          loadingAPI={loading}
          note={editMode.editMode && editMode.note}
          updateNote={() => {}}
          mentionHasInput={false}
          type={"organisation"}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default OrganisationScreen;
