import Realm, { BSON, ObjectSchema } from "realm";
import Mentions from "./Mentions";

export default class Note extends Realm.Object {
  _id!: BSON.ObjectId;
  content!: string;
  mentions: Mentions[];
  type!: string;
  imageUri!: string | null;
  audioUri!: string | null;
  volumeLevels!: number[];
  isPinned: boolean;
  documentUri!: string | null;
  documentName!: string | null;
  createdAt!: Date;
  updatedAt!: Date;

  static schema: ObjectSchema = {
    name: "Note",
    properties: {
      _id: "objectId",
      content: "string",
      mentions: "Mentions[]",
      type: "string",
      imageUri: "string?",
      audioUri: "string?",
      volumeLevels: "double[]",
      isPinned: "bool",
      documentUri: "string?",
      documentName: "string?",
      createdAt: "date",
      updatedAt: "date",
      notes: {
        type: "linkingObjects",
        objectType: "NoteOrganisationMap",
        property: "note",
      },
    },
    primaryKey: "_id",
  };
}
