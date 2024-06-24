import * as Clipboard from "expo-clipboard";

import { KeyboardAvoidingView, Linking } from "react-native";
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

const OrganisationScreen = ({ route }) => {
  const [editMode, setEditMode] = useState({ editMode: false, id: null });

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

  const contacts = useQuery(Contact);

  const addNoteV2 = async (
    content,
    mentions,
    imageUri,
    audioUri,
    volumeLevels,
    document
  ) => {
    if (
      Array.isArray(mentions) &&
      !mentions.some(
        (mention) => String(mention._id) === String(organisation._id)
      )
    ) {
      mentions.push({
        _id: organisation._id,
        name: organisation.name,
        type: "organisation",
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
      mentions: mentions,
      type: imageUri
        ? "image"
        : audioUri
        ? "audio"
        : document
        ? "document"
        : "text",
      imageUri: imageUri || null,
      audioUri: audioUri || null,
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
    volumeLevels,
    document
  ) => {
    if (
      Array.isArray(mentions) &&
      !mentions.some(
        (mention) => String(mention._id) === String(organisation._id)
      )
    ) {
      mentions.push({
        _id: organisation._id,
        name: organisation.name,
        type: "organisation",
      });
    }
    const updatedNote = {
      content: content,
      mentions: mentions, // Assuming mentions is an array of ids
      type: imageUri
        ? "image"
        : audioUri
        ? "audio"
        : document
        ? "document"
        : "text",
      imageUri: imageUri || null,
      audioUri: audioUri || null,
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
          mentions: JSON.stringify(note?.mentions || []),
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
            <Header title={organisation?.name} />
            {/*             <NavigationBarForContact
              contact={{}}
              showEdit={true}
              onShare={onShare}
              showLinkedin={false}
              onEdit={() => {}}
            />  */}
            <NotesList
              ref={notesListRef}
              notes={Array.isArray(storedNotes) ? storedNotes : []}
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
          mentions={contacts}
          addNote={addNoteV2}
          note={editMode.editMode && editMode.note}
          updateNote={updateNoteV2}
          mentionHasInput={false}
          type={"organisation"}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default OrganisationScreen;
