import * as Clipboard from "expo-clipboard";

import { Alert, KeyboardAvoidingView, Linking } from "react-native";
import React, { useCallback } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import {
  createNoteAndAddToContact,
  deleteNote,
  updateNote,
  useContactNotes,
} from "../../realm/queries/noteOperations";
import { useEffect, useRef, useState } from "react";

import { BSON } from "realm";
import LinkedinDataConnectModal from "../../components/contact/LinkedinDataConnectModal";
import NavigationBarForContact from "../../components/contact/NavigationBarForContact";
import NewContactModal from "../../components/contact/NewContactModal";
import NewNoteContainer from "../../components/notecontainer/NoteContainer";
import NotesList from "../../components/notecontainer/NotesList";
import Toast from "react-native-toast-message";
import { getWorkHistoryList } from "../../utils/linkedin";
import { useContact } from "../../realm/queries/contactOperations";
import { useRealm } from "@realm/react";
import { useTrackWithPageInfo } from "../../utils/analytics";

// import
const ContactScreen = ({ route }) => {
  const track = useTrackWithPageInfo();
  const realm = useRealm();

  const noteRef = useRef(null);

  const notesListRef = useRef(null);

  const params = route.params;

  const contact =
    params.contactId != "000000000000000000000000"
      ? useContact(realm, new BSON.ObjectId(params.contactId))
      : {
          _id: new BSON.ObjectId("000000000000000000000000"),
          name: "Quick Notes",
        };
  const [linkedinModalVisible, setLinkedinModalVisible] = useState(false);
  const [editMode, setEditMode] = useState({ editMode: false, id: null });
  const [contactEditVisible, setContactEditVisible] = useState(false);

  const [notes, setNotes] = useState([]);
  const [update, forceUpdate] = useState(0);

  const db = useRef(null);
  const storedNotes = useContactNotes(realm, contact._id);

  const contactNote = useRef(null);
  const linkedinSummaryNote = useRef(null);
  const workHistoryNote = useRef(null);

  const getContactInfo = useCallback((ct) => {
    var data = "";
    if (ct) {
      if (ct.phoneNumbers && ct.phoneNumbers.length > 0) {
        data = data + "Phone: <" + ct.phoneNumbers[0] + ">\n";
      }
      if (ct.emails && ct.emails.length > 0 && ct.emails[0]) {
        data = data + "Email: <" + ct.emails[0] + ">\n";
      }
      if (
        ct?.addresses &&
        Array.isArray(JSON.parse(JSON.stringify(ct?.addresses))) &&
        ct?.addresses?.length > 0
      ) {
        const address = JSON.parse(JSON.stringify(ct?.addresses))?.[0];
        data =
          data +
          `Address: ${address?.street} ${address?.city} ${address?.region} ${address?.country} ${address?.postalCode}  \n`;
      }
      if (ct?.note) {
        data = data + "note: " + ct?.note + "\n";
      }
    }
    if (data) {
      data = "*Contact Info*\n\n \n" + data;
    }
    return data;
  }, []);

  useEffect(() => {
    if (contact) {
      setupContactInfoNote(contact);
    }
    if (contact && contact.linkedinSummary) {
      setUpLinkedinSummary(contact.linkedinSummary);
    }
    if (contact && contact.linkedinProfileData) {
      setupWorkHistory(JSON.parse(contact.linkedinProfileData));
    }
    updateNotes();
  }, [update]);

  const updateNotes = () => {
    const qNotes = [];
    if (contactNote.current) {
      qNotes.push(contactNote.current);
    }
    if (linkedinSummaryNote.current) {
      qNotes.push(linkedinSummaryNote.current);
    }
    if (workHistoryNote.current) {
      qNotes.push(workHistoryNote.current);
    }
    setNotes(qNotes);
  };

  const setupContactInfoNote = (contact) => {
    const contactInfo = getContactInfo(contact);
    if (contactInfo) {
      contactNote.current = {
        _id: -7, //"NOTE THINGY"
        contactId: contact._id,
        content: contactInfo,
        mentions: [],
        type: "text",
        nonEditable: true,
        readOnly: true,
      };
    }
  };

  const setUpLinkedinSummary = (linkedinSummary) => {
    if (linkedinSummary) {
      linkedinSummaryNote.current = {
        _id: "quick_summary",
        contactId: contact._id,
        content: "*Quick Summary* \n\n \n\n" + linkedinSummary,
        mentions: [],
        type: "text",
        nonEditable: true,
        readOnly: true,
      };
    }
  };

  const setupWorkHistory = (data) => {
    const finalList = getWorkHistoryList(data);
    if (finalList) {
      workHistoryNote.current = {
        _id: "final_list",
        contactId: contact._id,
        content: "*Work history* \n\n \n\n" + finalList,
        mentions: [],
        type: "text",
        nonEditable: true,
        readOnly: true,
      };
    }
  };

  const addNoteV2 = async (
    content,
    mentions,
    imageUri,
    audioUri,
    volumeLevels,
    document
  ) => {
    if (!mentions.some((mention) => mention.contactId === contact.id)) {
      mentions.push({ contactId: contact.id, name: contact.name });
    }
    const newNote = {
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

    const noteId = createNoteAndAddToContact(realm, contact._id, newNote);
    // for (let mention of mentions) {
    //   await saveMapping(db.current, noteId, mention.id);
    // }
    setTimeout(() => {
      notesListRef.current.scrollToEnd({ animated: true });
    }, 500);

    forceUpdate(new Date().getTime());
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
    if (!mentions.some((mention) => mention.contactId === contact.id)) {
      mentions.push({ contactId: contact.id, name: contact.name });
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
    forceUpdate(new Date().getTime());
  };

  const onDelete = async (noteId) => {
    deleteNote(realm, noteId);
    forceUpdate(new Date().getTime());
    setTimeout(() => {
      notesListRef.current.scrollToEnd({ animated: true });
    }, 500);
  };

  const onLinkedinDataConnectModalOpen = () => {
    setLinkedinModalVisible(true);
  };
  const filteredNotes = storedNotes.filter((n) => n._id.equals(editMode.id));
  const firstNote = filteredNotes.length > 0 ? filteredNotes[0] : null;

  const onShare = () => {
    const allNotes = [...notes, ...storedNotes];
    const text = allNotes.map((n) => n.content).join("\n\n");
    copyToClipboard(text);

    const subject = encodeURIComponent("Notes about " + contact.name);
    const body = encodeURIComponent(
      "All Notes about " + contact.name + "\n\n" + text
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

  const CommonComponent = () => (
    <View style={{ flex: 1 }}>
      <LinkedinDataConnectModal
        db={db.current}
        visible={linkedinModalVisible}
        onClose={() => {
          setLinkedinModalVisible(false);
        }}
        contact={contact}
        forceUpdate={forceUpdate}
      />
      <TouchableWithoutFeedback
        onPress={() => {
          noteRef.current.unfocus();
        }}
      >
        <View style={{ flex: 1 }}>
          <NavigationBarForContact
            contact={contact}
            showEdit={true}
            onLinkedinDataConnectModalOpen={onLinkedinDataConnectModalOpen}
            onShare={onShare}
            onEdit={() => setContactEditVisible(true)}
          />
          <NotesList
            ref={notesListRef}
            notes={[...notes, ...storedNotes]}
            setEditMode={setEditMode}
            contact={contact}
            onDelete={onDelete}
          />
        </View>
      </TouchableWithoutFeedback>
      <NewNoteContainer
        ref={noteRef}
        addNote={addNoteV2}
        contact={contact}
        note={editMode.editMode && firstNote}
        updateNote={updateNoteV2}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={64}
      behavior={"padding"}
      style={{ flex: 1 }}
    >
      <CommonComponent />
      <NewContactModal
        visible={contactEditVisible}
        onClose={() => setContactEditVisible(false)}
        onSubmit={() => setContactEditVisible(false)}
        title={"Edit Conatct"}
        existingId={contact?._id}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
export default ContactScreen;
