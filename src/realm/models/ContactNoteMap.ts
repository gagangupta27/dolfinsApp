import Realm, { BSON, ObjectSchema } from "realm";

export default class ContactNoteMap extends Realm.Object {
  _id!: BSON.ObjectId;
  contactId!: BSON.ObjectId;
  noteId!: BSON.ObjectId;
  createdAt!: Date;
  updatedAt!: Date;

  static schema: ObjectSchema = {
    name: "ContactNoteMap",
    properties: {
      _id: "objectId",
      contactId: "objectId",
      noteId: "objectId",
      createdAt: "date",
      updatedAt: "date",
    },
    primaryKey: "_id",
  };
}
