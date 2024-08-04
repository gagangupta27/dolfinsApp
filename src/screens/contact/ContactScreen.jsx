import * as Clipboard from "expo-clipboard";

import { KeyboardAvoidingView, Linking } from "react-native";
import React, { useCallback } from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import {
  createNoteAndAddToContact,
  deleteNote,
  updateNote,
} from "../../realm/queries/noteOperations";
import { getEducationList, getWorkHistoryList } from "../../utils/linkedin";
import { useEffect, useRef, useState } from "react";
import { useObject, useQuery, useRealm } from "@realm/react";

import { BSON } from "realm";
import ContactNoteMap from "../../realm/models/ContactNoteMap";
import ContactOrganisationMap from "../../realm/models/ContactOrganisationMap";
import LinkedinDataConnectModal from "../../components/contact/LinkedinDataConnectModal";
import NavigationBarForContact from "../../components/contact/NavigationBarForContact";
import NewContactModal from "../../components/contact/NewContactModal";
import NewNoteContainerV2 from "../../components/notecontainer/NewNoteContainerV2";
import Note from "../../realm/models/Note";
import NotesList from "../../components/notecontainer/NotesList";
import Organisation from "../../realm/models/Organisation";
import Toast from "react-native-toast-message";
import useQuickNote from "../../hooks/useQuickNote";
import { useTrackWithPageInfo } from "../../utils/analytics";

const ContactScreen = ({ route }) => {
  const track = useTrackWithPageInfo();
  const realm = useRealm();

  const noteRef = useRef(null);
  const notesListRef = useRef(null);
  const quickNoteRef = useQuickNote();
  const params = route.params;

  const contact =
    params.contactId != String(quickNoteRef._id)
      ? useObject("Contact", new BSON.ObjectId(params.contactId))
      : quickNoteRef;

  const contactOrgIds = useQuery(ContactOrganisationMap)
    .filtered("contactId == $0", contact._id)
    .map((o) => o?.organisationId);

  const contactOrgs = useQuery(Organisation).filtered(
    "_id IN $0",
    contactOrgIds
  );

  const [editMode, setEditMode] = useState({ editMode: false, id: null });
  const [contactEditVisible, setContactEditVisible] = useState(false);
  const [notes, setNotes] = useState([]);

  const noteIdS = useQuery(ContactNoteMap)
    .filtered("contactId == $0", contact._id)
    .map((o) => o?.noteId);

  const storedNotes = useQuery(Note)
    .filtered("_id IN $0", noteIdS || [])
    .sorted([["isPinned", true]]);

  const _linkedInRef = useRef();

  console.log("reload");

  useEffect(() => {
    let notes = [];
    if (contact?._id && contact?.id != quickNoteRef?._id) {
      notes.push({
        _id: -7, //"NOTE THINGY"
        contactId: contact?._id,
        content: getContactInfo(contact),
        mentions: [],
        type: "text",
        nonEditable: true,
        readOnly: true,
      });
    }
    if (contact && contact?.linkedinSummary) {
      notes.push({
        _id: "quick_summary",
        contactId: contact?._id,
        content: "*Quick Summary* \n\n \n\n" + contact?.linkedinSummary,
        mentions: [],
        type: "text",
        nonEditable: true,
        readOnly: true,
      });
    }
    if (contact && contact?.linkedinProfileData) {
      const dat = JSON.parse(contact?.linkedinProfileData);
      const workHistoryContent = getWorkHistoryList(dat);
      const educationContent = getEducationList(dat);
      if (workHistoryContent) {
        notes.push(
          contact.linkedinProfileData
            ? {
                _id: "final_list",
                contactId: contact?._id,
                content: "*Work history* \n\n \n\n" + workHistoryContent,
                mentions: [],
                type: "text",
                nonEditable: true,
                readOnly: true,
              }
            : null
        );
      }
      if (educationContent) {
        notes.push({
          _id: "education",
          contactId: contact?._id,
          content: "*Education* \n\n \n\n" + educationContent,
          mentions: [],
          type: "text",
          nonEditable: true,
          readOnly: true,
        });
      }
    }
    setNotes(notes);
  }, [
    contact?.linkedinProfileData,
    contact?.linkedinSummary,
    JSON.stringify(contact?._id),
    JSON.stringify(contact?.phoneNumbers),
    JSON.stringify(contact?.emails),
    JSON.stringify(contact?.addresses),
    JSON.stringify(contact?.note),
    JSON.stringify(contactOrgs),
  ]);

  const getContactInfo = (ct) => {
    var data = "";
    if (ct) {
      if (ct?.phoneNumbers && ct?.phoneNumbers?.length > 0) {
        data += "Phones: ";
        ct?.phoneNumbers?.forEach((phone, index) => {
          data += `<${phone}>${
            index < ct?.phoneNumbers?.length - 1 ? ", " : ""
          }`;
        });
        data += "\n";
      }
      if (ct?.emails && ct?.emails?.length > 0 && ct?.emails?.[0]) {
        data = data + "Email: <" + ct.emails?.[0] + ">\n";
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
      if (contactOrgs && contactOrgs?.length > 0) {
        data += "Company: ";
        contactOrgs?.forEach((org, index) => {
          data += `${org?.name}${index < contactOrgs?.length - 1 ? ", " : ""}`;
        });
        data += "\n";
      }
      if (ct?.department) {
        data += `Department: ${ct?.department} `;
        data += "\n";
      }
      if (ct?.jobTitle) {
        data += `Job Title: ${ct?.jobTitle} `;
        data += "\n";
      }
    }
    if (data) {
      data = "*Contact Info*\n\n \n" + data;
    }
    return data;
  };

  const addNoteV2 = async (
    content,
    mentions,
    imageUri,
    imageText,
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
          String(contact._id)
      ) &&
      params.contactId != String(quickNoteRef._id)
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
      imageText: imageText || "",
      audioUri: audioUri || null,
      audioText: audioText || null,
      volumeLevels: volumeLevels || [],
      documentUri: document ? document.documentUri : null,
      documentName: document ? document.documentName : null,
    };

    const noteId = await createNoteAndAddToContact(realm, contact._id, newNote);
    setTimeout(() => {
      notesListRef.current.scrollToEnd({ animated: true });
    }, 500);
  };

  const updateNoteV2 = async (
    noteId,
    content,
    mentions,
    imageUri,
    imageText,
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
      imageText: imageText || "",
      audioUri: audioUri || null,
      audioText: audioText || null,
      volumeLevels: volumeLevels || [],
      documentUri: document ? document.documentUri : null,
      documentName: document ? document.documentName : null,
    };
    await updateNote(realm, noteId, updatedNote);
    setTimeout(() => {
      notesListRef.current.scrollToEnd({ animated: true });
    }, 500);
    setEditMode({ editMode: false, id: null });
  };

  const onDelete = async (noteId) => {
    deleteNote(realm, noteId);
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
    _linkedInRef.current?.show();
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
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={64}
      behavior={"padding"}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <LinkedinDataConnectModal
          contacId={contact?._id || ""}
          ref={_linkedInRef}
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
