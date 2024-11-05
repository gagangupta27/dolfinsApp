import Realm, { BSON } from "realm";

import Contact from "../models/Contact";
import { createNoteAndAddToContact } from "./noteOperations";

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
        jobTitle: string;
        department: string;
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
        const contacts = realm.objects("Contact").filtered("id == $0", contactData.id);
        if (contacts && contacts?.length > 0) {
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
                emails: contactData.emails ? contactData.emails.map((email) => email.email) : [],
                phoneNumbers: contactData.phoneNumbers ? contactData.phoneNumbers.map((number) => number.number) : [],
                imageAvailable: contactData?.imageAvailable || false,
                image: contactData?.image || "",
                note: "",
                addresses: contactData?.addresses || [],
                isFavourite: false,
                isPinned: false,
                jobTitle: contactData?.jobTitle || "",
                department: contactData?.department || "",
                linkedinProfileUrl: "",
                linkedinProfileData: "",
                linkedinSummary: "",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
    });

    if (contactData?.note && contactData?.note?.length > 0) {
        await createNoteAndAddToContact(realm, createdContact?._id, {
            content: contactData?.note,
            mentions: [],
            type: "text",
            imageData: [],
            audioUri: "",
            audioText: "",
            volumeLevels: [],
            documentUri: "",
            documentName: "",
        });
    }

    return createdContact;
}

async function importContacts(
    realm: Realm,
    contacts: {
        _id: BSON.ObjectId;
        id: string;
        name: string;
        emails: { email: string }[];
        phoneNumbers: { number: string }[];
        imageAvailable: boolean;
        image: string;
        note: string;
        linkedinProfileUrl: string;
        linkedinProfileData: string;
        linkedinSummary: string;
        jobTitle: string;
        department: string;
        createdAt: Date;
        updatedAt: Date;
        isFavourite: boolean;
        isPinned: boolean;
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
    }[]
) {
    realm.write(() => {
        for (const contact of contacts) {
            try {
                const existingContact = realm.objects("Contact").filtered("_id == $0", new BSON.ObjectId(contact._id));
                if (existingContact.length === 0) {
                    realm.create("Contact", {
                        _id: new BSON.ObjectId(contact?._id),
                        id: contact?.id,
                        name: contact.name,
                        emails: contact.emails || [],
                        phoneNumbers: contact.phoneNumbers || [],
                        imageAvailable: contact?.imageAvailable || false,
                        image: contact?.image || "",
                        note: "",
                        addresses: contact?.addresses || [],
                        isFavourite: contact?.isFavourite || false,
                        isPinned: contact?.isPinned || false,
                        jobTitle: contact?.jobTitle || "",
                        department: contact?.department || "",
                        linkedinProfileUrl: contact?.linkedinProfileUrl || "",
                        linkedinProfileData: contact?.linkedinProfileData || "",
                        linkedinSummary: contact?.linkedinSummary || "",
                        createdAt: contact?.createdAt,
                        updatedAt: contact?.updatedAt,
                    });
                }
            } catch (err) {
                console.log("err", err);
            }
        }
    });

    return;
}

async function importMentions(
    realm: Realm,
    mentions: {
        _id: string;
        contactId?: string | null;
        organisationId?: string | null;
    }[]
) {
    realm.write(() => {
        for (const mention of mentions) {
            try {
                realm.create("Mentions", {
                    _id: new BSON.ObjectId(mention?._id),
                    contact: mention?.contactId
                        ? realm.objectForPrimaryKey("Contact", new BSON.ObjectId(mention?.contactId))
                        : null,
                    organisation: mention?.organisationId
                        ? realm.objectForPrimaryKey("Organisation", new BSON.ObjectId(mention?.organisationId))
                        : null,
                });
            } catch (err) {
                console.log("err", err);
            }
        }
    });

    return;
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
            (contact.emails = contactData.emails ? contactData.emails.map((email) => email.email) : []),
                (contact.phoneNumbers = contactData.phoneNumbers
                    ? contactData.phoneNumbers.map((number) => number.number)
                    : []),
                (contact.updatedAt = new Date());
        }
    });
}

function updateLinkedinUrl(realm: Realm, contactId: BSON.ObjectId, linkedinProfileUrl: string) {
    realm.write(() => {
        let contact = realm.objectForPrimaryKey("Contact", contactId);
        if (contact) {
            contact.linkedinProfileUrl = linkedinProfileUrl;
            contact.updatedAt = new Date();
        }
    });
}

function updateLinkedinProfile(realm: Realm, contactId: BSON.ObjectId, linkedinProfileData: any) {
    realm.write(() => {
        let contact = realm.objectForPrimaryKey("Contact", contactId);
        if (contact) {
            contact.linkedinProfileData = JSON.stringify(linkedinProfileData);
            contact.updatedAt = new Date();
        }
    });
}

function updateLinkedinSummary(realm: Realm, contactId: string, linkedinSummary: string) {
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
    try {
        realm.write(() => {
            const contacts = realm.objects("Contact").filtered("_id != $0", "000000000000000000000000");
            if (contacts && contacts?.length > 0) {
                contactJSON = [...contacts];
            } else {
                contactJSON = [];
            }
        });
    } catch (err) {
        console.log("err getContactRaw", err);
        contactJSON = [];
    }
    return contactJSON;
}

async function getContactNoteMap(realm: Realm) {
    let contactJSON = [];
    try {
        realm.write(() => {
            const contacts = realm.objects("ContactNoteMap");
            if (contacts && contacts?.length > 0) {
                contactJSON = [...contacts];
            } else {
                contactJSON = [];
            }
        });
    } catch (err) {
        console.log("err getContactNoteMap", err);
        contactJSON = [];
    }
    return contactJSON;
}

async function importContactNoteMap(
    realm: Realm,
    maps: {
        _id: BSON.ObjectId;
        contactId: BSON.ObjectId;
        noteId: BSON.ObjectId;
        createdAt: Date;
        updatedAt: Date;
    }[]
) {
    realm.write(() => {
        for (const CNMap of maps) {
            try {
                const existingMap = realm.objects("ContactNoteMap").filtered("_id == $0", new BSON.ObjectId(CNMap._id));
                if (existingMap.length === 0) {
                    realm.create("ContactNoteMap", {
                        _id: new BSON.ObjectId(CNMap?._id),
                        contactId: new BSON.ObjectId(CNMap.contactId),
                        noteId: new BSON.ObjectId(CNMap.noteId),
                        createdAt: CNMap.createdAt,
                        updatedAt: CNMap.updatedAt,
                    });
                }
            } catch (err) {
                console.log("err", err);
            }
        }
    });

    return;
}

async function getRawMentions(realm: Realm) {
    let mentionsJSON = [];
    try {
        realm.write(() => {
            const mentions = realm.objects("Mentions");
            if (mentions && mentions?.length > 0) {
                mentionsJSON = mentions.map((o) => ({
                    _id: o?._id,
                    contactId: o?.contact?._id,
                    organisationId: o?.organisation?._id,
                }));
            } else {
                mentionsJSON = [];
            }
        });
    } catch (err) {
        console.log("err getRawMentions", err);
        mentionsJSON = [];
    }
    return mentionsJSON;
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
    getRawMentions,
    importContacts,
    importMentions,
    importContactNoteMap,
};
