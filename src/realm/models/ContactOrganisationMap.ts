import Realm, { BSON, ObjectSchema } from "realm";

export default class ContactOrganisationMap extends Realm.Object {
  _id!: BSON.ObjectId;
  contactId!: BSON.ObjectId;
  organisationId!: BSON.ObjectId;

  static schema: ObjectSchema = {
    name: "ContactOrganisationMap",
    properties: {
      _id: "objectId",
      contactId: "objectId",
      organisationId: "objectId",
    },
    primaryKey: "_id",
  };
}
