import * as Clipboard from "expo-clipboard";

import { KeyboardAvoidingView, Linking, TouchableOpacity } from "react-native";
import React from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import {
  createNoteAndAddToOrganisation,
  deleteNote,
  updateNote,
} from "../../realm/queries/noteOperations";
import { useRef, useState } from "react";
import { useObject, useQuery, useRealm } from "@realm/react";

import Toast from "react-native-toast-message";
import { useTrackWithPageInfo } from "../../utils/analytics";
import Organisation from "../../realm/models/Organisation";
import NoteOrganisationMap from "../../realm/models/NoteOrganisationMap";
import Header from "../../components/common/Header";
import { BSON } from "realm";
import NewNoteContainerV2 from "../../components/notecontainer/NewNoteContainerV2";
import Contact from "../../realm/models/Contact";
import NotesList from "../../components/notecontainer/NotesList";
import { Path, Svg } from "react-native-svg";
import AddOrgModal from "../../components/organisation/AddOrgModal";

const OrganisationScreen = ({ route }) => {
  const [editMode, setEditMode] = useState({ editMode: false, id: null });
  const [addOrgModalVisible, setAddOrgModalVisible] = useState(false);

  const track = useTrackWithPageInfo();
  const realm = useRealm();
  const noteRef = useRef(null);
  const notesListRef = useRef(null);

  const organisation = useObject(
    Organisation,
    new BSON.ObjectID(route?.params?.organisationId)
  );

  const storedNotes = useQuery(NoteOrganisationMap)
    .filtered("organisation._id == $0", organisation?._id)
    .sorted([["note.isPinned", true]])
    .filter((o) => o?.note)
    .map((o) => o?.note);

  const summaryNote = organisation.summary
    ? [
        {
          _id: "summary",
          contactId: organisation._id,
          content: "*Summary* \n\n" + organisation.summary,
          mentions: [],
          type: "text",
          nonEditable: true,
          readOnly: true,
        },
      ]
    : [];

  const addNoteV2 = async (
    content,
    mentions,
    imageUri,
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
        _id: new BSON.ObjectId(),
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
    const newNote = {
      content: newConent,
      mentions: mentions || [],
      type: imageUri
        ? "image"
        : audioUri
        ? "audio"
        : document
        ? "document"
        : "text",
      imageUri: imageUri || null,
      audioUri: audioUri || null,
      audioText: audioText || null,
      volumeLevels: volumeLevels || [],
      documentUri: document ? document.documentUri : null,
      documentName: document ? document.documentName : null,
    };

    const noteId = await createNoteAndAddToOrganisation(
      realm,
      organisation._id,
      newNote
    );

    setTimeout(() => {
      notesListRef?.current?.scrollToEnd({ animated: true });
    }, 500);
  };

  const updateNoteV2 = async (
    noteId,
    content,
    mentions,
    imageUri,
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
        _id: new BSON.ObjectId(),
        organisation: organisation,
      });
    }
    const updatedNote = {
      content: content,
      mentions: mentions || [],
      type: imageUri
        ? "image"
        : audioUri
        ? "audio"
        : document
        ? "document"
        : "text",
      imageUri: imageUri || null,
      audioUri: audioUri || null,
      audioText: audioText || null,
      volumeLevels: volumeLevels || [],
      documentUri: document ? document.documentUri : null,
      documentName: document ? document.documentName : null,
    };
    updateNote(realm, noteId, updatedNote);
    setTimeout(() => {
      notesListRef.current.scrollToEnd({ animated: true });
    }, 500);
    setEditMode({ editMode: false, id: null });
  };

  const onDelete = async (noteId) => {
    await deleteNote(realm, noteId);
    setTimeout(() => {
      notesListRef?.current?.scrollToEnd({ animated: true });
    }, 500);
  };

  const onPinPress = async (note) => {
    realm.write(() => {
      realm.create(
        "Note",
        {
          ...note,
          isPinned: !note?.isPinned,
          mentions: note?.mentions || [],
        },
        "modified"
      );
    });
  };

  const onShare = () => {
    const allNotes = [...storedNotes];
    const text = allNotes.map((n) => n.content).join("\n\n");
    copyToClipboard(text);

    const subject = encodeURIComponent("Notes about " + organisation?.name);
    const body = encodeURIComponent(
      "All Notes about " + organisation?.name + "\n\n" + text
    );

    const mailtoURL = `mailto:?subject=${subject}&body=${body}`;

    Linking.canOpenURL(mailtoURL)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle mailto URL");
        } else {
          return Linking.openURL(mailtoURL);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const copyToClipboard = async (data) => {
    await Clipboard.setStringAsync(data);
    Toast.show({
      type: "success",
      text1: "Copied",
    });
    // toast message
    // copied to clipboard
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={64}
      behavior={"padding"}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback
          onPress={() => {
            noteRef.current.unfocus();
          }}
        >
          <View style={{ flex: 1 }}>
            <Header
              rightIcons={() => (
                <TouchableOpacity
                  style={[{ marginLeft: 8 }]}
                  onPress={() => setAddOrgModalVisible(true)}
                >
                  <Svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <Path
                      d="M2.87601 18.1156C2.92195 17.7021 2.94493 17.4954 3.00748 17.3022C3.06298 17.1307 3.1414 16.9676 3.24061 16.8171C3.35242 16.6475 3.49952 16.5005 3.7937 16.2063L17 3C18.1046 1.89543 19.8954 1.89543 21 3C22.1046 4.10457 22.1046 5.89543 21 7L7.7937 20.2063C7.49951 20.5005 7.35242 20.6475 7.18286 20.7594C7.03242 20.8586 6.86926 20.937 6.69782 20.9925C6.50457 21.055 6.29783 21.078 5.88434 21.124L2.49997 21.5L2.87601 18.1156Z"
                      stroke="black"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </Svg>
                </TouchableOpacity>
              )}
              title={organisation?.name}
            />
            <NotesList
              ref={notesListRef}
              notes={
                Array.isArray(storedNotes)
                  ? [...storedNotes, ...summaryNote]
                  : [...summaryNote]
              }
              setEditMode={setEditMode}
              contact={{}}
              onDelete={onDelete}
              showPin={true}
              onPinPress={onPinPress}
            />
          </View>
        </TouchableWithoutFeedback>
        <NewNoteContainerV2
          ref={noteRef}
          addNote={addNoteV2}
          note={editMode.editMode && editMode.note}
          updateNote={updateNoteV2}
          mentionHasInput={false}
          type={"organisation"}
        />
        <AddOrgModal
          visible={addOrgModalVisible}
          onClose={() => setAddOrgModalVisible(false)}
          onSubmit={() => {}}
          existingId={organisation?._id}
          title="Edit Org"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default OrganisationScreen;
