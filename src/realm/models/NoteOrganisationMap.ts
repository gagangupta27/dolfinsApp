import Realm, { BSON, ObjectSchema } from "realm";

export default class NoteOrganisationMap extends Realm.Object {
  _id!: BSON.ObjectId;
  noteId!: BSON.ObjectId;
  organisationId!: BSON.ObjectId;

  static schema: ObjectSchema = {
    name: "NoteOrganisationMap",
    properties: {
      _id: "objectId",
      noteId: "objectId",
      organisationId: "objectId",
    },
    primaryKey: "_id",
  };
}
