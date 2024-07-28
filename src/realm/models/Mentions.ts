import Realm, { BSON, ObjectSchema } from "realm";
import Contact from "./Contact";
import Organisation from "./Organisation";

export default class Mentions extends Realm.Object {
  _id!: BSON.ObjectId;
  contact: Contact;
  organisation: Organisation;

  static schema: ObjectSchema = {
    name: "Mentions",
    properties: {
      _id: "objectId",
      contact: "Contact",
      organisation: "Organisation",
    },
    primaryKey: "_id",
  };
}
