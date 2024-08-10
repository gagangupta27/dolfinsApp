export default class ImageData extends Realm.Object {
  uri: string;
  localPath: string;
  iCloudPath: string;
  imageText: string;

  static schema: Realm.ObjectSchema = {
    name: "ImageData",
    properties: {
      _id: "objectId",
      uri: "string",
      localPath: "string",
      iCloudPath: "string",
      imageText: "string",
    },
    primaryKey: "_id",
  };
}
