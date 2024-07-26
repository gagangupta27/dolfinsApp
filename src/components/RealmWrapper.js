import Address from "../realm/models/ContactAddress";
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
      const oldObjects = oldRealm.objects("Organisation");
      const newObjects = newRealm.objects("Organisation");

      for (let i = 0; i < oldObjects.length; i++) {
        newObjects[i].createdAt = new Date();
        newObjects[i].updatedAt = new Date();
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
    <RealmProvider schema={schema} schemaVersion={15} onMigration={migration}>
      {children}
    </RealmProvider>
  );
};

export default RealmWrapper;
