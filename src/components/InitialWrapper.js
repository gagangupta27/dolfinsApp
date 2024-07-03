import { useRealm } from "@realm/react";
import React, { memo, useEffect } from "react";
import Contact from "../realm/models/Contact";
import { BSON } from "realm";

const InitialWrapper = ({ children }) => {
  const realm = useRealm();

  useEffect(() => {
    const qucikNoteContact = realm.objectForPrimaryKey(
      Contact,
      new BSON.ObjectId("000000000000000000000000")
    );
    if (!qucikNoteContact) {
      realm.write(() => {
        createdContact = realm.create("Contact", {
          _id: new BSON.ObjectId("000000000000000000000000"),
          id: "000000000000000000000000",
          name: "Quick Notes",
          emails: [],
          phoneNumbers: [],
          imageAvailable: false,
          image: "",
          note: "",
          addresses: [],
          isFavourite: false,
          isPinned: false,
          linkedinProfileUrl: "",
          linkedinProfileData: "",
          linkedinSummary: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    }
  }, []);

  return <>{children}</>;
};

export default memo(InitialWrapper);
