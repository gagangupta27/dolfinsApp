import Realm, { BSON } from "realm";

import Contact from "../models/Contact";

async function addContact(
  realm: Realm,
  contactData: {
    id: string;
    name: string;
    emails: { email: string }[];
    phoneNumbers: { number: string }[];
    imageAvailable: boolean;
    image: string;
    note: string;
    addresses: {
      city: string;
      country: string;
      id: string;
      isoCountryCode: string;
      label: string;
      postalCode: string;
      region: string;
      street: string;
    }[];
  }
) {
  let createdContact;
  realm.write(() => {
    const contacts = realm
      .objects("Contact")
      .filtered("id == $0", contactData.id);
    if (contacts.length > 0) {
      let contact = contacts[0];
      contact.name = contactData.name;
      contact.emails = contactData.emails;
      contact.phoneNumbers = contactData.phoneNumbers;
      contact.updatedA = new Date();
    } else {
      createdContact = realm.create("Contact", {
        _id: new BSON.ObjectId(),
        id: contactData.id,
        name: contactData.name,
        emails: contactData.emails
          ? contactData.emails.map((email) => email.email)
          : [],
        phoneNumbers: contactData.phoneNumbers
          ? contactData.phoneNumbers.map((number) => number.number)
          : [],
        imageAvailable: contactData?.imageAvailable || false,
        image: contactData?.image || "",
        note: contactData?.note || "",
        addresses: contactData?.addresses || [],
        isFavourite: false,
        isPinned: false,
        linkedinProfileUrl: "",
        linkedinProfileData: "",
        linkedinSummary: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  });

  return createdContact;
}

function deleteContact(
  realm: Realm,
  contactId: string // Note the change to string type
) {
  const contactId2 = new BSON.ObjectId(contactId); // Convert string to ObjectId

  realm.write(() => {
    // Find the chat object by its id
    const contact = realm.objectForPrimaryKey("Contact", contactId2);

    // If the chat object is found, delete it
    if (contact) {
      realm.delete(contact);
    }
  });
}

function updateContactById(
  realm: Realm,
  id: string,
  contactData: {
    name: string;
    emails: { email: string }[];
    phoneNumbers: { number: string }[];
  }
) {
  realm.write(() => {
    let contacts = realm.objects("Contact").filtered("id == $0", id);
    if (contacts.length > 0) {
      let contact = contacts[0]; // Access the first contact in the collection
      contact.name = contactData.name;
      (contact.emails = contactData.emails
        ? contactData.emails.map((email) => email.email)
        : []),
        (contact.phoneNumbers = contactData.phoneNumbers
          ? contactData.phoneNumbers.map((number) => number.number)
          : []),
        (contact.updatedAt = new Date());
    }
  });
}

function updateLinkedinUrl(
  realm: Realm,
  contactId: BSON.ObjectId,
  linkedinProfileUrl: string
) {
  realm.write(() => {
    let contact = realm.objectForPrimaryKey("Contact", contactId);
    if (contact) {
      contact.linkedinProfileUrl = linkedinProfileUrl;
      contact.updatedAt = new Date();
    }
  });
}

function updateLinkedinProfile(
  realm: Realm,
  contactId: BSON.ObjectId,
  linkedinProfileData: any
) {
  realm.write(() => {
    let contact = realm.objectForPrimaryKey("Contact", contactId);
    if (contact) {
      contact.linkedinProfileData = JSON.stringify(linkedinProfileData);
      contact.updatedAt = new Date();
    }
  });
}

function updateLinkedinSummary(
  realm: Realm,
  contactId: string,
  linkedinSummary: string
) {
  realm.write(() => {
    let contact = realm.objectForPrimaryKey("Contact", contactId);
    if (contact) {
      contact.linkedinSummary = linkedinSummary;
      contact.updatedAt = new Date();
    }
  });
}

function useContacts(realm) {
  const contacts = realm.objects(Contact).sorted("name");
  return contacts;
}

function useContact(realm, contactId: string) {
  let contact = realm.objectForPrimaryKey("Contact", contactId);
  return contact;
}

async function getContactRaw(realm: Realm) {
  let contactJSON = [];
  realm.write(() => {
    const contacts = realm
      .objects("Contact")
      .filtered("id != $0", "000000000000000000000000");
    contactJSON = [...contacts];
  });

  return contactJSON;
}

async function getContactNoteMap(realm: Realm) {
  let contactJSON = [];
  realm.write(() => {
    const contacts = realm.objects("ContactNoteMap");
    contactJSON = [...contacts];
  });

  return contactJSON;
}

export {
  addContact,
  updateContactById,
  updateLinkedinProfile,
  updateLinkedinSummary,
  updateLinkedinUrl,
  useContact,
  useContacts,
  deleteContact,
  getContactRaw,
  getContactNoteMap,
};
