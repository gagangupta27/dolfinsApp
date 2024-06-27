import React from "react";
import { RealmProvider } from "@realm/react";
import CalendarEvent from "../realm/models/CalendarEvent";
import Note from "../realm/models/Note";
import CalendarEventNoteMap from "../realm/models/CalendarEventNoteMap";
import ContactNoteMap from "../realm/models/ContactNoteMap";
import Contact from "../realm/models/Contact";
import Chat from "../realm/models/Chat";
import Address from "../realm/models/ContactAddress";
import Organisation from "../realm/models/Organisation";
import NoteOrganisationMap from "../realm/models/NoteOrganisationMap";
import ContactOrganisationMap from "../realm/models/ContactOrganisationMap";
import Mentions from "../realm/models/Mentions";

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
    <RealmProvider schema={schema} schemaVersion={9} onMigration={migration}>
      {children}
    </RealmProvider>
  );
};

export default RealmWrapper;
