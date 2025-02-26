import Realm, { BSON, ObjectSchema } from "realm";

import Address from "./ContactAddress";

export default class Contact extends Realm.Object {
  _id!: BSON.ObjectId; // Assuming ID is a string as per your SQLite schema
  id!: string; // This is device ID
  name!: string;
  emails!: string[];
  phoneNumbers!: string[];
  imageAvailable: boolean;
  image: string;
  note: string;
  addresses: Realm.List<Address>;
  isFavourite: boolean;
  isPinned: boolean;
  linkedinProfileUrl!: string;
  linkedinProfileData!: string;
  linkedinSummary!: string;
  createdAt!: Date;
  updatedAt!: Date;
  department: string;
  jobTitle: string;

  static schema: ObjectSchema = {
    name: "Contact",
    properties: {
      _id: "objectId",
      id: "string",
      name: "string",
      emails: "string[]",
      phoneNumbers: "string[]",
      imageAvailable: "bool",
      image: "string",
      note: "string",
      addresses: "Address[]",
      isFavourite: "bool",
      isPinned: "bool",
      linkedinProfileUrl: "string",
      linkedinProfileData: "string",
      linkedinSummary: "string",
      department: "string",
      jobTitle: "string",
      createdAt: "date",
      updatedAt: "date",
    },
    primaryKey: "_id",
  };
}
