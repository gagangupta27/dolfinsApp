import Realm, { BSON } from "realm";

import CalendarEventNoteMap from "../models/CalendarEventNoteMap";
import Contact from "../models/Contact";
import ContactNoteMap from "../models/ContactNoteMap";
import Mentions from "../models/Mentions";
import Note from "../models/Note";
import Organisation from "../models/Organisation";
import { useQuery } from "@realm/react";

function useCalendarNotes(realm: Realm, calendarEventId: BSON.ObjectId) {
  const noteMaps = useQuery(CalendarEventNoteMap).filtered(
    "calendarEventId == $0",
    calendarEventId
  );
  const notes = noteMaps.map((noteMap) => {
    const note = realm.objectForPrimaryKey(Note, noteMap.noteId);
    return {
      ...note,
      calendarEventId: noteMap.calendarEventId,
    };
  });

  return notes;
}

function useContactNotes(realm: Realm, contactId: BSON.ObjectId) {
  const noteMaps = useQuery(ContactNoteMap).filtered(
    "contactId == $0",
    contactId
  );
  const notes = noteMaps.map((noteMap) => {
    const note = realm.objectForPrimaryKey(Note, noteMap.noteId);
    return {
      ...note,
      contactId: noteMap.contactId,
    };
  });

  return notes;
}

function useAllContactNotes(realm: Realm) {
  const noteMaps = useQuery(ContactNoteMap);
  const notes = noteMaps.map((noteMap) => {
    const note = realm.objectForPrimaryKey(Note, noteMap.noteId);
    return {
      ...note,
      contactId: noteMap.contactId,
    };
  });

  return notes;
}

function useAllCalendarNotes(realm: Realm) {
  const noteMaps = useQuery(CalendarEventNoteMap);
  const notes = noteMaps.map((noteMap) => {
    const note = realm.objectForPrimaryKey(Note, noteMap.noteId);
    return {
      ...note,
      calendarEventId: noteMap.calendarEventId,
    };
  });

  return notes;
}

function addNoteToCalendar(
  realm: Realm,
  calendarEventId: BSON.ObjectId,
  noteDetails: {
    content: string;
    mentions: Mentions[];
    type: string;
    imageUri: string | null;
    imageText: string | null;
    audioUri: string | null;
    audioText: string | null;
    volumeLevels: number[];
    documentUri: string | null;
    documentName: string | null;
  }
) {
  const noteId = new BSON.ObjectId();

  realm.write(() => {
    const newNote = realm.create("Note", {
      _id: noteId,
      content: noteDetails.content,
      mentions: noteDetails?.mentions
        ? noteDetails.mentions?.map((o) => ({
            _id: new BSON.ObjectId(),
            ...(o?.contact
              ? { contact: realm.objectForPrimaryKey(Contact, o?.contact?._id) }
              : {
                  organisation: realm.objectForPrimaryKey(
                    Organisation,
                    o?.organisation?._id
                  ),
                }),
          }))
        : [],
      type: noteDetails.type,
      imageUri: noteDetails?.imageUri,
      imageText: noteDetails?.imageText,
      audioUri: noteDetails.audioUri,
      audioText: noteDetails?.audioText || "",
      volumeLevels: noteDetails.volumeLevels,
      documentUri: noteDetails.documentUri,
      documentName: noteDetails.documentName,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
    });

    const calendarNoteMap = realm.create("CalendarEventNoteMap", {
      _id: new BSON.ObjectId(),
      calendarEventId: calendarEventId,
      noteId: newNote._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
  return noteId;
}

async function createNoteAndAddToContact(
  realm: Realm,
  contactId: BSON.ObjectId,
  noteDetails: {
    content: string;
    mentions: Mentions[];
    type: string;
    imageUri: string | null;
    imageText: string | null;
    audioUri: string | null;
    audioText: string | null;
    volumeLevels: number[];
    documentUri: string | null;
    documentName: string | null;
  }
) {
  const noteId = new BSON.ObjectId();
  realm.write(() => {
    const newNote = realm.create("Note", {
      _id: noteId,
      content: noteDetails.content,
      mentions: noteDetails?.mentions
        ? noteDetails.mentions?.map((o) => ({
            _id: new BSON.ObjectId(),
            ...(o?.contact
              ? { contact: realm.objectForPrimaryKey(Contact, o?.contact?._id) }
              : {
                  organisation: realm.objectForPrimaryKey(
                    Organisation,
                    o?.organisation?._id
                  ),
                }),
          }))
        : [],
      type: noteDetails.type,
      imageUri: noteDetails.imageUri,
      imageText: noteDetails.imageText,
      audioUri: noteDetails.audioUri,
      audioText: noteDetails?.audioText || "",
      volumeLevels: noteDetails.volumeLevels,
      documentUri: noteDetails.documentUri,
      documentName: noteDetails.documentName,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
    });

    const contactNoteMap = realm.create("ContactNoteMap", {
      _id: new BSON.ObjectId(),
      contactId: contactId,
      noteId: newNote._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
  return noteId;
}

async function importNotes(
  realm: Realm,
  notes: {
    _id: BSON.ObjectID;
    content: string;
    mentions: {
      _id: BSON.ObjectId;
      contactId: BSON.ObjectId;
      organisationId: BSON.ObjectId;
    }[];
    type: string;
    imageUri: string | null;
    imageText: string | null;
    audioUri: string | null;
    audioText: string | null;
    volumeLevels: number[];
    documentUri: string | null;
    documentName: string | null;
    createdAt: Date;
    updatedAt: Date;
    isPinned: boolean;
  }[]
) {
  realm.write(() => {
    for (const note of notes) {
      try {
        realm.create("Note", {
          _id: new BSON.ObjectID(note?._id),
          content: note?.content || "",
          mentions: note?.mentions
            ? note.mentions?.map((o) => ({
                _id: new BSON.ObjectId(o?._id),
                ...(o?.contactId
                  ? {
                      contact: realm.objectForPrimaryKey(
                        Contact,
                        new BSON.ObjectID(o?.contactId)
                      ),
                    }
                  : {
                      organisation: realm.objectForPrimaryKey(
                        Organisation,
                        new BSON.ObjectID(o?.organisationId)
                      ),
                    }),
              }))
            : [],
          type: note.type,
          imageUri: note.imageUri,
          imageText: note.imageText,
          audioUri: note.audioUri,
          audioText: note?.audioText || "",
          volumeLevels: note.volumeLevels,
          documentUri: note.documentUri,
          documentName: note.documentName,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
          isPinned: note.isPinned,
        });
      } catch (err) {
        console.log("err", err);
      }
    }
  });

  return;
}

async function createNoteAndAddToOrganisation(
  realm: Realm,
  organisationId: BSON.ObjectId,
  noteDetails: {
    content: string;
    mentions: Mentions[];
    type: string;
    imageUri: string | null;
    imageText: string | null;
    audioUri: string | null;
    audioText: string | null;
    volumeLevels: number[];
    documentUri: string | null;
    documentName: string | null;
  }
) {
  const noteId = new BSON.ObjectId();
  realm.write(() => {
    const newNote = realm.create("Note", {
      _id: noteId,
      content: noteDetails.content,
      mentions: noteDetails?.mentions
        ? noteDetails.mentions?.map((o) => ({
            _id: new BSON.ObjectId(),
            ...(o?.contact
              ? { contact: realm.objectForPrimaryKey(Contact, o?.contact?._id) }
              : {
                  organisation: realm.objectForPrimaryKey(
                    Organisation,
                    o?.organisation?._id
                  ),
                }),
          }))
        : [],
      type: noteDetails.type,
      imageUri: noteDetails.imageUri,
      imageText: noteDetails.imageText,
      audioUri: noteDetails.audioUri,
      audioText: noteDetails?.audioText || "",
      volumeLevels: noteDetails.volumeLevels,
      documentUri: noteDetails.documentUri,
      documentName: noteDetails.documentName,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
    });

    const NoteOrganisationMap = realm.create("NoteOrganisationMap", {
      _id: new BSON.ObjectId(),
      organisationId: organisationId,
      noteId: newNote._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
  return noteId;
}

function addNoteToContact(
  realm: Realm,
  contactId: BSON.ObjectId,
  noteId: BSON.ObjectId
) {
  realm.write(() => {
    // Check if the contactId, noteId pair already exists
    const existingMap = realm
      .objects("ContactNoteMap")
      .filtered("contactId == $0 AND noteId == $1", contactId, noteId);

    // If the pair does not exist, create a new entry
    if (existingMap.isEmpty()) {
      realm.create("ContactNoteMap", {
        _id: new BSON.ObjectId(),
        contactId: contactId,
        noteId: noteId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  });
}

function removeNoteFromContact(
  realm: Realm,
  contactId: BSON.ObjectId,
  noteId: BSON.ObjectId
) {
  realm.write(() => {
    // Find the specific ContactNoteMap entry with the given contactId and noteId
    const entryToRemove = realm
      .objects("ContactNoteMap")
      .filtered("contactId == $0 AND noteId == $1", contactId, noteId);

    // If the entry exists, delete it
    if (!entryToRemove.isEmpty()) {
      realm.delete(entryToRemove);
    }
  });
}

async function updateNote(
  realm: Realm,
  noteId: BSON.ObjectId,
  noteDetails: {
    content: string;
    mentions: Mentions[];
    type: string;
    imageUri: string | null;
    imageText: string | null;
    audioUri: string | null;
    audioText: string | null;
    volumeLevels: number[];
    documentUri: string | null;
    documentName: string | null;
    isPinned: boolean;
  }
) {
  await realm.write(async () => {
    const note = realm.objectForPrimaryKey("Note", noteId);
    if (note) {
      note.content = noteDetails.content;
      // Clear existing mentions and add updated ones
      note.mentions = noteDetails?.mentions
        ? noteDetails.mentions?.map((o) => ({
            _id: new BSON.ObjectId(),
            ...(o?.contact
              ? { contact: realm.objectForPrimaryKey(Contact, o?.contact?._id) }
              : {
                  organisation: realm.objectForPrimaryKey(
                    Organisation,
                    o?.organisation?._id
                  ),
                }),
          }))
        : [];
      note.type = noteDetails.type;
      note.imageUri = noteDetails.imageUri;
      note.imageText = noteDetails.imageText;
      note.audioUri = noteDetails.audioUri;
      note.audioText = noteDetails?.audioText || "";
      note.volumeLevels = noteDetails.volumeLevels;
      note.documentUri = noteDetails.documentUri;
      note.documentName = noteDetails.documentName;
      note.updatedAt = new Date();
      note.isPinned = noteDetails.isPinned || false;
    }
  });
}

async function deleteNote(realm: Realm, noteId: BSON.ObjectId) {
  await realm.write(async () => {
    const organisationNoteMap = realm
      .objects("NoteOrganisationMap")
      .filtered("noteId == $0", noteId);
    realm.delete(organisationNoteMap); // Delete the mapping first

    const calendarEventNoteMap = realm
      .objects("CalendarEventNoteMap")
      .filtered("noteId == $0", noteId);
    realm.delete(calendarEventNoteMap); // Delete the mapping first

    const contactNoteMap = realm
      .objects("ContactNoteMap")
      .filtered("noteId == $0", noteId);
    realm.delete(contactNoteMap); // Delete the mapping first

    const note = realm.objectForPrimaryKey("Note", noteId);
    if (note) {
      realm.delete(note); // Then delete the note
    }
  });
}

async function getQuickNotesRaw(realm: Realm) {
  let quickNotesJSON = [];
  try {
    realm.write(() => {
      const quickNotesIds = realm
        .objects(ContactNoteMap)
        .filtered(
          "contactId == $0",
          new BSON.ObjectId("000000000000000000000000")
        )
        .map((o) => o?.noteId);
      const allQuichNotes = realm
        .objects(Note)
        .filtered(`_id IN $0`, quickNotesIds);
      if (allQuichNotes && allQuichNotes?.length > 0) {
        quickNotesJSON = [...allQuichNotes];
      } else {
        quickNotesJSON = [];
      }
    });
  } catch (err) {
    console.log("err getQuickNotesRaw", err);
    quickNotesJSON = [];
  }

  return quickNotesJSON;
}

async function getNotesRaw(realm: Realm) {
  let notesJSON = [];
  try {
    realm.write(() => {
      const allNotes = realm.objects(Note);
      if (allNotes && allNotes?.length > 0) {
        notesJSON = [
          ...allNotes.map((o) => ({
            ...o,
            mentions: o?.mentions?.map((m) => ({
              _id: m?._id,
              contactId: m?.contact?._id,
              organisationId: m?.organisation?._id,
            })),
          })),
        ];
      } else {
        notesJSON = [];
      }
    });
  } catch (err) {
    console.log("err getNotesRaw", err);
    notesJSON = [];
  }

  return notesJSON;
}

export {
  addNoteToCalendar,
  addNoteToContact,
  createNoteAndAddToContact,
  deleteNote,
  removeNoteFromContact,
  updateNote,
  useAllCalendarNotes,
  useAllContactNotes,
  useCalendarNotes,
  useContactNotes,
  createNoteAndAddToOrganisation,
  getQuickNotesRaw,
  getNotesRaw,
  importNotes,
};
