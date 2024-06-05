import Realm, { BSON, ObjectSchema } from "realm";

export default class Note extends Realm.Object {
  _id!: BSON.ObjectId;
  content!: string;
  mentions!: string;
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
      mentions: "string",
      type: "string",
      imageUri: "string?",
      audioUri: "string?",
      volumeLevels: "double[]",
      isPinned: "bool",
      documentUri: "string?",
      documentName: "string?",
      createdAt: "date",
      updatedAt: "date",
    },
    primaryKey: "_id",
  };
}
