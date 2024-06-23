import Realm, { BSON, ObjectSchema } from "realm";

import Contact from "./Contact";

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

  static schema: ObjectSchema = {
    name: "Organisation",
    properties: {
      _id: "objectId",
      name: "string",
      links: "string[]",
      linkedinUrl: "string",
      linkedinProfile: "string",
      summary: "string",
      createdAt: "date",
      updatedAt: "date",
      isPinned: "bool",
      contacts: {
        type: "linkingObjects",
        objectType: "ContactOrganisationMap",
        property: "organisation",
      },
      notes: {
        type: "linkingObjects",
        objectType: "NoteOrganisationMap",
        property: "organisation",
      },
    },
    primaryKey: "_id",
  };
}
