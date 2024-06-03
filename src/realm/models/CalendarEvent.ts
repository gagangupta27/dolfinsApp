import Realm, { BSON, ObjectSchema } from "realm";

export default class CalendarEvent extends Realm.Object {
  _id!: BSON.ObjectId;
  id: number;
  calendarId!: number;
  calendarProviderEventId!: string;
  title!: string;
  eventStartTime!: Date;
  eventEndTime!: Date;
  description!: string;
  attendees!: string[]; // JSON Array as string
  organizer: string;
  createdAt!: Date;
  updatedAt!: Date;

  static schema: ObjectSchema = {
    name: "CalendarEvent",
    properties: {
      _id: "objectId",
      id: "int",
      calendarId: "int",
      calendarProviderEventId: "string",
      title: "string",
      eventStartTime: "date",
      eventEndTime: "date",
      description: "string",
      attendees: "string[]", // Stored as JSON string
      organizer: "string",
      createdAt: "date",
      updatedAt: "date",
    },
    primaryKey: "_id",
  };
}
