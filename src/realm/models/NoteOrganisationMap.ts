import Realm, { BSON, ObjectSchema } from "realm";
import Note from "./Note";
import Organisation from "./Organisation";

export default class NoteOrganisationMap extends Realm.Object {
  _id!: BSON.ObjectId;
  note!: Note;
  organisation!: Organisation;

  static schema: ObjectSchema = {
    name: "NoteOrganisationMap",
    properties: {
      _id: "objectId",
      note: "Note",
      organisation: "Organisation",
    },
    primaryKey: "_id",
  };
}