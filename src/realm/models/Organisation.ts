import Realm, { BSON, ObjectSchema } from "realm";

export default class Organisation extends Realm.Object {
  _id!: BSON.ObjectId;
  name: string;
  links!: string[];
  linkedinUrl!: string;
  linkedinProfile!: string;
  summary!: string;
  createdAt!: Date;
  updatedAt!: Date;
  isPinned!: boolean;
  linkedinProfileData!: string;

  static schema: ObjectSchema = {
    name: "Organisation",
    properties: {
      _id: "objectId",
      name: "string",
      links: "string[]",
      linkedinUrl: "string",
      linkedinProfile: "string",
      linkedinProfileData: "string",
      summary: "string",
      createdAt: "date",
      updatedAt: "date",
      isPinned: "bool",
    },
    primaryKey: "_id",
  };
}
