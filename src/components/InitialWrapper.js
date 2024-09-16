import * as Contacts from "expo-contacts";

import React, { memo, useEffect, useRef } from "react";

import { AppState } from "react-native";
import { BSON } from "realm";
import Contact from "../realm/models/Contact";
import ExportImportModal from "../screens/profile/ExportImportModal";
import { OrgContactLink } from "../realm/queries/organisationOperations";
import { useRealm } from "@realm/react";

const InitialWrapper = ({ children }) => {
  const realm = useRealm();

  let iRef = useRef(0);
  let lengthRef = useRef(0);
  const _syncData = useRef();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState == "active") {
        syncContacts();
        _syncData?.current?.syncData();
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
          department: "",
          jobTitle: "",
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
          existingContact.name = `${contact?.firstName || ""} ${
            contact.middleName || ""
          } ${contact.lastName || ""}`;
          existingContact.emails = contact?.emails?.map((o) => o?.email) || [];
          existingContact.phoneNumbers =
            contact.phoneNumbers?.map((o) => o?.digits) || [];
          existingContact.note = contact?.note || "";
          existingContact.image = contact?.image?.uri || "";
          existingContact.imageAvailable = contact?.imageAvailable || false;
          existingContact.jobTitle = contact?.jobTitle || "";
          existingContact.department = contact?.department || "";
        });
        if (contact?.company) {
          await OrgContactLink(
            realm,
            "",
            String(existingContact?._id),
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

  return (
    <>
      {children}
      <ExportImportModal ref={_syncData} />
    </>
  );
};

export default memo(InitialWrapper);
