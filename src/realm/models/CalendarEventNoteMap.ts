import Realm, { BSON, ObjectSchema } from "realm";

export default class CalendarEventNoteMap extends Realm.Object {
  _id!: BSON.ObjectId;
  calendarEventId!: BSON.ObjectId;
  noteId!: BSON.ObjectId;
  createdAt!: Date;
  updatedAt!: Date;

  static schema: ObjectSchema = {
    name: "CalendarEventNoteMap",
    properties: {
      _id: "objectId",
      calendarEventId: "objectId",
      noteId: "objectId",
      createdAt: "date",
      updatedAt: "date",
    },
    primaryKey: "_id",
  };
}
