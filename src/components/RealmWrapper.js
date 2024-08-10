import Address from "../realm/models/ContactAddress";
import { BSON } from "realm";
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
import React from "react";
import { RealmProvider } from "@realm/react";

const RealmWrapper = ({ children }) => {
  const migration = (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < newRealm.schemaVersion) {
      const oldNote = oldRealm.objects("Note");
      const newNotes = newRealm.objects("Note");

      for (let i = 0; i < oldNote.length; i++) {
        if (oldNote[i]?.imageUri) {
          newNotes[i].imageData = [
            {
              _id: new BSON.ObjectID(),
              uri: oldNote[i]?.imageUri,
              localPath: "",
              iCloudPath: "",
              imageText: oldNote[i]?.imageText || "",
            },
          ];
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
    ImageData,
  ];

  return (
    <RealmProvider schema={schema} schemaVersion={25} onMigration={migration}>
      {children}
    </RealmProvider>
  );
};

export default RealmWrapper;
