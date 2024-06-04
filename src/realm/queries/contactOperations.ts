import Realm, { BSON } from "realm";

import Contact from "../models/Contact";

function addContact(
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
  realm.write(() => {
    realm.create("Contact", {
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
  });
}

function updateContact(
  realm: Realm,
  contactId: BSON.ObjectId,
  updates: Partial<{
    name: string;
    emails: string[];
    phoneNumbers: string[];
  }>
) {
  realm.write(() => {
    let contact = realm.objectForPrimaryKey("Contact", contactId);
    if (contact) {
      contact.name = updates.name;
      contact.emails = updates.emails;
      contact.phoneNumbers = updates.phoneNumbers;
      contact.updatedAt = new Date();
    }
  });
}

// update contact through name
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

export {
  addContact,
  updateContact,
  updateContactById,
  updateLinkedinProfile,
  updateLinkedinSummary,
  updateLinkedinUrl,
  useContact,
  useContacts,
};
