import { useRealm } from "@realm/react";
import React, { memo, useEffect, useRef } from "react";
import Contact from "../realm/models/Contact";
import { BSON } from "realm";
import { AppState } from "react-native";
import * as Contacts from "expo-contacts";
import { OrgContactLink } from "../realm/queries/organisationOperations";

const InitialWrapper = ({ children }) => {
  const realm = useRealm();

  let iRef = useRef(0);
  let lengthRef = useRef(0);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState == "active") {
        syncContacts();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

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

  const syncContacts = async () => {
    const { data } = await Contacts.getContactsAsync({});
    iRef.current = 0;
    lengthRef.current = data?.length || 0;

    const loopFunc = async () => {
      const contact = data[iRef.current];
      const existingContact = realm
        .objects("Contact")
        .filtered("id == $0", contact.id)[0];
      if (existingContact) {
        realm.write(async () => {
          existingContact.name = `${contact.firstName || ""} ${
            contact.middleName || ""
          } ${contact.lastName || ""}`;
          existingContact.emails = contact.emails?.map((o) => o?.email) || [];
          existingContact.phoneNumbers =
            contact.phoneNumbers?.map((o) => o?.digits) || [];
          existingContact.note = contact.note || "";
          existingContact.image = contact?.image || "";
          existingContact.imageAvailable = contact?.imageAvailable || false;
        });
        if (contact.company) {
          await OrgContactLink(
            realm,
            "",
            existingContact?._id,
            contact.company
          );
        }
      }
      setTimeout(() => {
        iRef.current = iRef.current + 1;
        if (iRef.current < data?.length) {
          loopFunc();
        }
      }, 2000);
    };

    if (lengthRef.current) {
      loopFunc();
    }
  };

  return <>{children}</>;
};

export default memo(InitialWrapper);
