import Realm, { BSON, ObjectSchema } from "realm";

import ImageData from "./ImageData";
import Mentions from "./Mentions";

export default class Note extends Realm.Object {
  _id!: BSON.ObjectId;
  content!: string;
  mentions: Mentions[];
  type!: string;
  imageData: ImageData[];
  audioUri!: string | null;
  audioText: string | null;
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
      imageData: "ImageData[]",
      audioUri: "string?",
      audioText: "string?",
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
