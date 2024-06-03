import Realm, { BSON, ObjectSchema } from "realm";

export default class Contact extends Realm.Object {
  _id!: BSON.ObjectId; // Assuming ID is a string as per your SQLite schema
  id!: string; // This is device ID
  name!: string;
  emails!: string[];
  phoneNumbers!: string[];
  linkedinProfileUrl!: string;
  linkedinProfileData!: string;
  linkedinSummary!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static schema: ObjectSchema = {
    name: "Contact",
    properties: {
      _id: "objectId",
      id: "string",
      name: "string",
      emails: "string[]",
      phoneNumbers: "string[]",
      linkedinProfileUrl: "string",
      linkedinProfileData: "string",
      linkedinSummary: "string",
      createdAt: "date",
      updatedAt: "date",
    },
    primaryKey: "_id",
  };
}
