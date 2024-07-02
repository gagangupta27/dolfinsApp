import * as Clipboard from "expo-clipboard";

import { KeyboardAvoidingView, Linking } from "react-native";
import React, { useCallback } from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import {
  createNoteAndAddToContact,
  deleteNote,
  updateNote,
} from "../../realm/queries/noteOperations";
import { useEffect, useRef, useState } from "react";
import { useQuery, useRealm } from "@realm/react";

import { BSON } from "realm";
import ContactNoteMap from "../../realm/models/ContactNoteMap";
import LinkedinDataConnectModal from "../../components/contact/LinkedinDataConnectModal";
import NavigationBarForContact from "../../components/contact/NavigationBarForContact";
import NewContactModal from "../../components/contact/NewContactModal";
import Note from "../../realm/models/Note";
import NotesList from "../../components/notecontainer/NotesList";
import Toast from "react-native-toast-message";
import { getEducationList, getWorkHistoryList } from "../../utils/linkedin";
import { useContact } from "../../realm/queries/contactOperations";
import { useTrackWithPageInfo } from "../../utils/analytics";
import ContactOrganisationMap from "../../realm/models/ContactOrganisationMap";
import NewNoteContainerV2 from "../../components/notecontainer/NewNoteContainerV2";
import Contact from "../../realm/models/Contact";
import { useFocusEffect } from "@react-navigation/native";

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

  const contactOrgMap = useQuery(
    ContactOrganisationMap,
    (tasks) => {
      return tasks.filtered("contact._id == $0", contact._id);
    },
    [update]
  );

  const [linkedinModalVisible, setLinkedinModalVisible] = useState(false);
  const [editMode, setEditMode] = useState({ editMode: false, id: null });
  const [contactEditVisible, setContactEditVisible] = useState(false);

  const noteIdS = useQuery(ContactNoteMap)
    .filtered("contactId == $0", contact._id)
    .map((o) => o?.noteId);
  const storedNotes = useQuery(Note)
    .filtered("_id IN $0", noteIdS || [])
    .sorted([["isPinned", true]]);

  const [notes, setNotes] = useState([]);
  const [update, forceUpdate] = useState(0);

  const db = useRef(null);

  const contactNote = useRef(null);
  const linkedinSummaryNote = useRef(null);
  const workHistoryNote = useRef(null);
  const educationNote = useRef(null);

  useFocusEffect(
    useCallback(() => {
      forceUpdate(new Date().valueOf());
    }, [])
  );

  const getContactInfo = useCallback(
    (ct) => {
      var data = "";
      if (ct) {
        if (ct.phoneNumbers && ct.phoneNumbers.length > 0) {
          data += "Phones: ";
          ct.phoneNumbers.forEach((phone, index) => {
            data += `<${phone}>${
              index < ct.phoneNumbers.length - 1 ? ", " : ""
            }`;
          });
          data += "\n";
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
        if (contactOrgMap && contactOrgMap.length > 0) {
          data += "Company: ";
          contactOrgMap.forEach((org, index) => {
            data += `${org.organisation.name}${
              index < contactOrgMap.length - 1 ? ", " : ""
            }`;
          });
          data += "\n";
        }
      }
      if (data) {
        data = "*Contact Info*\n\n \n" + data;
      }
      return data;
    },
    [update]
  );

  useEffect(() => {
    if (contact) {
      setupContactInfoNote(contact);
    }
    if (contact && contact.linkedinSummary) {
      setUpLinkedinSummary(contact.linkedinSummary);
    }
    if (contact && contact.linkedinProfileData) {
      setupWorkHistory(JSON.parse(contact.linkedinProfileData));
      setupEducation(JSON.parse(contact.linkedinProfileData));
    }
    updateNotes();
  }, [update, contactOrgMap]);

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
    if (educationNote.current) {
      qNotes.push(educationNote.current);
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

  const setupEducation = (data) => {
    const finalList = getEducationList(data);
    if (finalList) {
      educationNote.current = {
        _id: "education",
        contactId: contact._id,
        content: "*Education* \n\n \n\n" + finalList,
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
    if (
      mentions &&
      !mentions.some(
        (mention) =>
          String(mention?.contact?._id || mention?.organisation?._id) ===
          String(contact._id)
      ) &&
      params.contactId != "000000000000000000000000"
    ) {
      mentions.push({
        _id: new BSON.ObjectId(),
        contact: contact,
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
      mentions: mentions
        ? mentions?.map((o) => ({
            _id: new BSON.ObjectId(),
            ...(o?.contact
              ? { contact: o?.contact }
              : { organisation: o?.organisation }),
          }))
        : [],
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

    const noteId = await createNoteAndAddToContact(realm, contact._id, newNote);
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
    if (
      mentions &&
      !mentions.some(
        (mention) =>
          String(mention?.contact?._id || mention?.organisation?._id) ===
          String(contact._id)
      )
    ) {
      mentions.push({
        _id: new BSON.ObjectId(),
        contact: contact,
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
      volumeLevels: volumeLevels || [],
      documentUri: document ? document.documentUri : null,
      documentName: document ? document.documentName : null,
    };
    await updateNote(realm, noteId, updatedNote);
    setTimeout(() => {
      notesListRef.current.scrollToEnd({ animated: true });
      forceUpdate(new Date().valueOf());
    }, 500);
    setEditMode({ editMode: false, id: null });
  };

  const onDelete = async (noteId) => {
    deleteNote(realm, noteId);
    forceUpdate(new Date().getTime());
    setTimeout(() => {
      notesListRef.current.scrollToEnd({ animated: true });
    }, 500);
  };

  const onPinPress = async (note) => {
    await updateNote(realm, new BSON.ObjectId(note._id), {
      ...note,
      isPinned: !note?.isPinned,
    });
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
            showPin={true}
            onPinPress={onPinPress}
          />
        </View>
      </TouchableWithoutFeedback>
      <NewNoteContainerV2
        ref={noteRef}
        addNote={addNoteV2}
        contact={contact}
        note={editMode.editMode && firstNote}
        updateNote={updateNoteV2}
        mentionHasInput={false}
        type={"contact"}
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

export default ContactScreen;
