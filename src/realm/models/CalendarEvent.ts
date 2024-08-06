import Realm, { BSON, ObjectSchema } from "realm";

import Mentions from "./Mentions";

export default class CalendarEvent extends Realm.Object {
  _id!: BSON.ObjectId;
  calendarId!: number;
  calendarProviderEventId!: string;
  title!: string;
  eventStartTime!: Date;
  eventEndTime!: Date;
  description!: string;
  attendees: Mentions[];
  organizer: Mentions;
  createdAt!: Date;
  updatedAt!: Date;
  location: string;
  meetLinkUrl: string;

  static schema: ObjectSchema = {
    name: "CalendarEvent",
    properties: {
      _id: "objectId",
      calendarId: "int",
      calendarProviderEventId: "string",
      title: "string",
      eventStartTime: "date",
      eventEndTime: "date",
      description: "string",
      attendees: "Mentions[]",
      organizer: "Mentions",
      createdAt: "date",
      updatedAt: "date",
      location: "string",
      meetLinkUrl: "string",
    },
    primaryKey: "_id",
  };
}
