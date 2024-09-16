import React, { memo, useEffect, useRef } from "react";

import Address from "../realm/models/ContactAddress";
import CalendarEvent from "../realm/models/CalendarEvent";
import CalendarEventNoteMap from "../realm/models/CalendarEventNoteMap";
import Chat from "../realm/models/Chat";
import Contact from "../realm/models/Contact";
import ContactNoteMap from "../realm/models/ContactNoteMap";
import ContactOrganisationMap from "../realm/models/ContactOrganisationMap";
import ImageData from "../realm/models/ImageData";
import Mentions from "../realm/models/Mentions";
import Note from "../realm/models/Note";
import NoteOrganisationMap from "../realm/models/NoteOrganisationMap";
import Organisation from "../realm/models/Organisation";
import { useRealm } from "@realm/react";

const SyncWrapper = ({ children }) => {
  const realm = useRealm();

  const calendarEvent = realm.objects(CalendarEvent);
  const note = realm.objects(Note);
  const calendarEventNoteMap = realm.objects(CalendarEventNoteMap);
  const contactNoteMap = realm.objects(ContactNoteMap);
  const contact = realm.objects(Contact);
  const chat = realm.objects(Chat);
  const address = realm.objects(Address);
  const organisation = realm.objects(Organisation);
  const noteOrganisationMap = realm.objects(NoteOrganisationMap);
  const CcontactOrganisationMap = realm.objects(ContactOrganisationMap);
  const mentions = realm.objects(Mentions);
  const imageData = realm.objects(ImageData);

  function onCalendarEventChange(calendarEvents, changes) {
    changes.deletions.forEach((index) => {
      console.log(`CalendarEvent #${index} has been deleted.`);
    });
    changes.insertions.forEach((index) => {
      const insertedEvent = calendarEvents[index];
      console.log(`New CalendarEvent added: ${insertedEvent.title}!`);
    });
    changes.modifications.forEach((index) => {
      const modifiedEvent = calendarEvents[index];
      console.log(`CalendarEvent modified: ${modifiedEvent.title}!`);
    });
  }

  function onNoteChange(notes, changes) {
    changes.deletions.forEach((index) => {
      console.log(`Note #${index} has been deleted.`);
    });
    changes.insertions.forEach((index) => {
      const insertedNote = notes[index];
      console.log(`New Note added: ${insertedNote.content}!`);
    });
    changes.modifications.forEach((index) => {
      const modifiedNote = notes[index];
      console.log(`Note modified: ${modifiedNote.content}!`);
    });
  }

  function onChatChange(chats, changes) {
    changes.deletions.forEach((index) => {
      console.log(`Chat #${index} has been deleted.`);
    });
    changes.insertions.forEach((index) => {
      const insertedChat = chats[index];
      console.log(`New Chat added: ${insertedChat.message}!`);
    });
    changes.modifications.forEach((index) => {
      const modifiedChat = chats[index];
      console.log(`Chat modified: ${modifiedChat.message}!`);
    });
  }

  function onContactChange(contacts, changes) {
    changes.deletions.forEach((index) => {
      console.log(`Contact #${index} has been deleted.`);
    });
    changes.insertions.forEach((index) => {
      const insertedContact = contacts[index];
      console.log(`New Contact added: ${insertedContact.name}!`);
    });
    changes.modifications.forEach((index) => {
      const modifiedContact = contacts[index];
      console.log(`Contact modified: ${modifiedContact.name}!`);
    });
  }

  function onAddressChange(addresses, changes) {
    changes.deletions.forEach((index) => {
      console.log(`Address #${index} has been deleted.`);
    });
    changes.insertions.forEach((index) => {
      const insertedAddress = addresses[index];
      console.log(`New Address added: ${insertedAddress.street}!`);
    });
    changes.modifications.forEach((index) => {
      const modifiedAddress = addresses[index];
      console.log(`Address modified: ${modifiedAddress.street}!`);
    });
  }

  function onOrganisationChange(organisations, changes) {
    changes.deletions.forEach((index) => {
      console.log(`Organisation #${index} has been deleted.`);
    });
    changes.insertions.forEach((index) => {
      const insertedOrganisation = organisations[index];
      console.log(`New Organisation added: ${insertedOrganisation.name}!`);
    });
    changes.modifications.forEach((index) => {
      const modifiedOrganisation = organisations[index];
      console.log(`Organisation modified: ${modifiedOrganisation.name}!`);
    });
  }

  function onImageDataChange(imageDataArray, changes) {
    changes.deletions.forEach((index) => {
      console.log(`ImageData #${index} has been deleted.`);
    });
    changes.insertions.forEach((index) => {
      const insertedImageData = imageDataArray[index];
      console.log(`New ImageData added: ${insertedImageData.url}!`);
    });
    changes.modifications.forEach((index) => {
      const modifiedImageData = imageDataArray[index];
      console.log(`ImageData modified: ${modifiedImageData.url}!`);
    });
  }

  function onMentionsChange(mentions, changes) {
    changes.deletions.forEach((index) => {
      console.log(`Mention #${index} has been deleted.`);
    });
    changes.insertions.forEach((index) => {
      const insertedMention = mentions[index];
      console.log(`New Mention added: ${insertedMention.text}!`);
    });
    changes.modifications.forEach((index) => {
      const modifiedMention = mentions[index];
      console.log(`Mention modified: ${modifiedMention.text}!`);
    });
  }

  function onNoteOrganisationChange(noteOrganisations, changes) {
    changes.deletions.forEach((index) => {
      console.log(`NoteOrganisation #${index} has been deleted.`);
    });
    changes.insertions.forEach((index) => {
      const insertedNoteOrganisation = noteOrganisations[index];
      console.log(
        `New NoteOrganisation added: ${insertedNoteOrganisation.name}!`
      );
    });
    changes.modifications.forEach((index) => {
      const modifiedNoteOrganisation = noteOrganisations[index];
      console.log(
        `NoteOrganisation modified: ${modifiedNoteOrganisation.name}!`
      );
    });
  }

  function onContactNoteChange(contactNotes, changes) {
    changes.deletions.forEach((index) => {
      console.log(`ContactNote #${index} has been deleted.`);
    });
    changes.insertions.forEach((index) => {
      const insertedContactNote = contactNotes[index];
      console.log(`New ContactNote added: ${insertedContactNote.content}!`);
    });
    changes.modifications.forEach((index) => {
      const modifiedContactNote = contactNotes[index];
      console.log(`ContactNote modified: ${modifiedContactNote.content}!`);
    });
  }

  function onContactOrganisationChange(contactOrganisations, changes) {
    changes.deletions.forEach((index) => {
      console.log(`ContactOrganisation #${index} has been deleted.`);
    });
    changes.insertions.forEach((index) => {
      const insertedContactOrganisation = contactOrganisations[index];
      console.log(
        `New ContactOrganisation added: ${insertedContactOrganisation.name}!`
      );
    });
    changes.modifications.forEach((index) => {
      const modifiedContactOrganisation = contactOrganisations[index];
      console.log(
        `ContactOrganisation modified: ${modifiedContactOrganisation.name}!`
      );
    });
  }

  useEffect(() => {
    try {
      calendarEvent.addListener(onCalendarEventChange); // Changed to onCalendarEventChange
    } catch (error) {
      console.log("Error:", error);
    }
    try {
      note.addListener(onNoteChange); // Changed to onNoteChange
    } catch (error) {
      console.log("Error:", error);
    }
    try {
      chat.addListener(onChatChange); // Changed to onChatChange
    } catch (error) {
      console.log("Error:", error);
    }
    try {
      contact.addListener(onContactChange); // Changed to onContactChange
    } catch (error) {
      console.log("Error:", error);
    }
    try {
      address.addListener(onAddressChange); // Changed to onAddressChange
    } catch (error) {
      console.log("Error:", error);
    }
    try {
      organisation.addListener(onOrganisationChange); // Changed to onOrganisationChange
    } catch (error) {
      console.log("Error:", error);
    }
    try {
      imageData.addListener(onImageDataChange); // Changed to onImageDataChange
    } catch (error) {
      console.log("Error:", error);
    }
    try {
      mentions.addListener(onMentionsChange); // Changed to onMentionsChange
    } catch (error) {
      console.log("Error:", error);
    }
    try {
      noteOrganisationMap.addListener(onNoteOrganisationChange); // Changed to onNoteOrganisationChange
    } catch (error) {
      console.log("Error:", error);
    }
    try {
      contactNoteMap.addListener(onContactNoteChange); // Changed to onContactNoteChange
    } catch (error) {
      console.log("Error:", error);
    }
    try {
      CcontactOrganisationMap.addListener(onContactOrganisationChange); // Changed to onContactOrganisationChange
    } catch (error) {
      console.log("Error:", error);
    }
  }, []);

  return <></>;
};

export default memo(SyncWrapper);
