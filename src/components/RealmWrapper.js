import Address from "../realm/models/ContactAddress";
import { BSON } from "realm";
import CalendarEvent from "../realm/models/CalendarEvent";
import CalendarEventNoteMap from "../realm/models/CalendarEventNoteMap";
import Chat from "../realm/models/Chat";
import Contact from "../realm/models/Contact";
import ContactNoteMap from "../realm/models/ContactNoteMap";
import ContactOrganisationMap from "../realm/models/ContactOrganisationMap";
import Mentions from "../realm/models/Mentions";
import Note from "../realm/models/Note";
import NoteOrganisationMap from "../realm/models/NoteOrganisationMap";
import Organisation from "../realm/models/Organisation";
import React from "react";
import { RealmProvider } from "@realm/react";

const RealmWrapper = ({ children }) => {
  const migration = (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < newRealm.schemaVersion) {
      const oldContactOrganisationMap = oldRealm.objects(
        "ContactOrganisationMap"
      );
      const newContactOrganisationMap = newRealm.objects(
        "ContactOrganisationMap"
      );

      const oldNoteOrganisationMap = oldRealm.objects("NoteOrganisationMap");
      const newNoteOrganisationMap = newRealm.objects("NoteOrganisationMap");

      for (let i = 0; i < oldContactOrganisationMap.length; i++) {
        if (oldContactOrganisationMap?.[i]?.contact?._id) {
          newContactOrganisationMap[i].contactId = new BSON.ObjectId(
            oldContactOrganisationMap[i]?.contact?._id
          );
        }

        if (oldContactOrganisationMap?.[i]?.organisation?._id) {
          newContactOrganisationMap[i].organisationId = new BSON.ObjectId(
            oldContactOrganisationMap[i]?.organisation?._id
          );
        }
      }

      for (let i = 0; i < oldNoteOrganisationMap.length; i++) {
        if (oldNoteOrganisationMap?.[i]?.note?._id) {
          newNoteOrganisationMap[i].noteId = new BSON.ObjectId(
            oldNoteOrganisationMap[i]?.note?._id
          );
        }

        if (oldNoteOrganisationMap?.[i]?.organisation?._id) {
          newNoteOrganisationMap[i].organisationId = new BSON.ObjectId(
            oldNoteOrganisationMap[i]?.organisation?._id
          );
        }
      }
    }
  };

  const schema = [
    CalendarEvent,
    Note,
    CalendarEventNoteMap,
    ContactNoteMap,
    Contact,
    Chat,
    Address,
    Organisation,
    NoteOrganisationMap,
    ContactOrganisationMap,
    Mentions,
  ];

  return (
    <RealmProvider schema={schema} schemaVersion={19} onMigration={migration}>
      {children}
    </RealmProvider>
  );
};

export default RealmWrapper;
