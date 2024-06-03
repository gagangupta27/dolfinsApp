import Realm, { BSON, ObjectSchema } from "realm";

export default class Chat extends Realm.Object {
  _id!: BSON.ObjectId;
  title: string;
  messages!: string; // Assuming JSON string for chat data
  createdAt!: Date;
  updatedAt!: Date;

  static schema: ObjectSchema = {
    name: "Chat",
    properties: {
      _id: "objectId",
      title: "string",
      messages: "string",
      createdAt: "date",
      updatedAt: "date",
    },
    primaryKey: "_id",
  };
}
