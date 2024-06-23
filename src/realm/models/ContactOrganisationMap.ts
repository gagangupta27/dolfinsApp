import Realm, { BSON, ObjectSchema } from "realm";
import Organisation from "./Organisation";
import Contact from "./Contact";

export default class ContactOrganisationMap extends Realm.Object {
  _id!: BSON.ObjectId;
  contact!: Contact;
  organisation!: Organisation;

  static schema: ObjectSchema = {
    name: "ContactOrganisationMap",
    properties: {
      _id: "objectId",
      contact: "Contact",
      organisation: "Organisation",
    },
    primaryKey: "_id",
  };
}