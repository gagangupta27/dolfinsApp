import Realm, { BSON, ObjectSchema } from "realm";

export default class Address extends Realm.Object {
  city: string;
  country: string;
  id: string;
  isoCountryCode: string;
  label: string;
  postalCode: string;
  region: string;
  street: string;

  static schema: Realm.ObjectSchema = {
    name: "Address",
    properties: {
      city: "string",
      country: "string",
      id: "string",
      isoCountryCode: "string",
      label: "string",
      postalCode: "string",
      region: "string",
      street: "string",
    },
  };
}
