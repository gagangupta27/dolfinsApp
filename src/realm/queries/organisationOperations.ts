import Realm, { BSON } from "realm";

import Organisation from "../models/Organisation";

async function addOrganisation(
    realm: Realm,
    organisationData: {
        name: string;
        linkedinUrl: string;
        linkedinProfile: string;
        linkedinProfileData: string;
        createdAt: Date;
        updatedAt: Date;
        summary: string;
    }
) {
    let createdOrganisation;
    realm.write(() => {
        createdOrganisation = realm.create("Organisation", {
            _id: new BSON.ObjectId(),
            ...organisationData,
            isPinned: false,
        });
    });
    return createdOrganisation; // Return the newly created organisation
}

async function importOrgs(
    realm: Realm,
    organisations: {
        _id: BSON.ObjectId;
        name: string;
        linkedinUrl: string;
        linkedinProfile: string;
        linkedinProfileData: string;
        createdAt: Date;
        updatedAt: Date;
        summary: string;
    }[]
) {
    realm.write(() => {
        for (const org of organisations) {
            try {
                const existingOrg = realm.objects("Organisation").filtered("_id == $0", new BSON.ObjectId(org._id));
                if (existingOrg.length === 0) {
                    realm.create("Organisation", {
                        ...org,
                        _id: new BSON.ObjectId(org?._id),
                    });
                } else {
                    console.log(`Organisation with ID ${org._id} already exists.`);
                }
            } catch (err) {
                console.log("err", err);
            }
        }
    });
    return;
}

function deleteOrganisation(
    realm: Realm,
    organisationId: string // Note the change to string type
) {
    const organisationId2 = new BSON.ObjectId(organisationId); // Convert string to ObjectId

    realm.write(() => {
        const organisation = realm.objectForPrimaryKey("Organisation", organisationId2);
        if (organisation) {
            const contactOrgMaps = realm
                .objects("ContactOrganisationMap")
                .filtered("organisationId == $0", organisationId2);
            realm.delete(contactOrgMaps);

            const noteOrgMaps = realm.objects("NoteOrganisationMap").filtered("organisationId == $0", organisationId2);
            realm.delete(noteOrgMaps);

            // Finally, delete the organisation
            realm.delete(organisation);
        }
    });
}

async function OrgContactLink(realm: Realm, organisationId: string, contactId: string, companyName: string) {
    let organisationId2;
    if (organisationId) {
        organisationId2 = new BSON.ObjectId(organisationId);
    } else {
        let organisation = realm.objects("Organisation").filtered("name == $0", companyName)[0];
        if (!organisation) {
            // Directly use the returned organisation from addOrganisation
            organisation = await addOrganisation(realm, {
                name: companyName,
                linkedinUrl: "",
                linkedinProfile: "",
                linkedinProfileData: "",
                summary: "",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            organisationId2 = organisation?._id;
        } else {
            organisationId2 = organisation?._id;
        }
    }
    const contactId2 = new BSON.ObjectId(contactId);

    realm.write(() => {
        // Check if the mapping already exists
        const existingLink = realm
            .objects("ContactOrganisationMap")
            .filtered("contactId == $0 AND organisationId == $1", contactId2, organisationId2);

        if (existingLink.length === 0 && contactId2 && organisationId2) {
            // Create a new mapping if it does not exist
            realm.create("ContactOrganisationMap", {
                _id: new BSON.ObjectId(),
                contactId: contactId2,
                organisationId: organisationId2,
            });
        }
    });
}

async function updateContactOrg(realm: Realm, contactId: string, organisations: Organisation[]) {
    realm.write(() => {
        const contactOrgMap = realm.objects("ContactOrganisationMap").filtered("contactId == $0", contactId);
        realm.delete(contactOrgMap);
        organisations.map((org) => {
            realm.create("ContactOrganisationMap", {
                _id: new BSON.ObjectId(),
                contactId: new BSON.ObjectId(contactId),
                organisationId: new BSON.ObjectId(org?._id),
            });
        });
    });
}

async function getRawOrg(realm: Realm) {
    let orgJSON = [];
    try {
        realm.write(() => {
            const orgs = realm.objects("Organisation");
            if (orgs && orgs?.length > 0) {
                orgJSON = [...orgs];
            } else {
                orgJSON = [];
            }
        });
    } catch (err) {
        console.log("err getRawOrg", err);
        orgJSON = [];
    }

    return orgJSON;
}

async function getRawNoteOrganisationMap(realm: Realm) {
    let orgJSON = [];
    try {
        realm.write(() => {
            const orgs = realm.objects("NoteOrganisationMap");
            if (orgs && orgs?.length > 0) {
                orgJSON = [...orgs];
            } else {
                orgJSON = [];
            }
        });
    } catch (err) {
        console.log("err getRawNoteOrganisationMap", err);
        orgJSON = [];
    }

    return orgJSON;
}

async function importNoteOrganisationMap(
    realm: Realm,
    maps: {
        _id: BSON.ObjectId;
        noteId: BSON.ObjectId;
        organisationId: BSON.ObjectId;
    }[]
) {
    realm.write(() => {
        for (const NOMap of maps) {
            try {
                const existingMap = realm
                    .objects("NoteOrganisationMap")
                    .filtered("_id == $0", new BSON.ObjectId(NOMap._id));
                console.log("existingMap", existingMap);
                if (existingMap.length === 0) {
                    realm.create("NoteOrganisationMap", {
                        _id: new BSON.ObjectId(NOMap?._id),
                        organisationId: new BSON.ObjectId(NOMap.organisationId),
                        noteId: new BSON.ObjectId(NOMap.noteId),
                    });
                } else {
                    console.log(
                        `NoteOrganisationMap with noteId ${NOMap.noteId} and organisationId ${NOMap.organisationId} already exists.`
                    );
                }
            } catch (err) {
                console.log("err", err);
            }
        }
    });
    return;
}

async function getRawContactOrganisationMap(realm: Realm) {
    let orgJSON = [];
    try {
        realm.write(() => {
            const orgs = realm.objects("ContactOrganisationMap");
            if (orgs && orgs?.length > 0) {
                orgJSON = [...orgs];
            } else {
                orgJSON = [];
            }
        });
    } catch (err) {
        console.log("err getRawContactOrganisationMap", err);
        orgJSON = [];
    }
    return orgJSON;
}

async function importContactOrgMap(
    realm: Realm,
    maps: {
        _id: BSON.ObjectId;
        contactId: BSON.ObjectId;
        organisationId: BSON.ObjectId;
    }[]
) {
    realm.write(() => {
        for (const COMap of maps) {
            try {
                // Check if the mapping already exists
                const existingMap = realm
                    .objects("ContactOrganisationMap")
                    .filtered("_id == $0", new BSON.ObjectId(COMap._id));

                if (existingMap.length === 0) {
                    // Create a new ContactOrganisationMap entry if it does not exist
                    realm.create("ContactOrganisationMap", {
                        _id: new BSON.ObjectId(COMap._id),
                        organisationId: new BSON.ObjectId(COMap.organisationId),
                        contactId: new BSON.ObjectId(COMap.contactId),
                    });
                } else {
                    console.log(
                        `ContactOrganisationMap with contactId ${COMap.contactId} and organisationId ${COMap.organisationId} already exists.`
                    );
                }
            } catch (err) {
                console.log("err", err);
            }
        }
    });

    return;
}

export {
    deleteOrganisation,
    addOrganisation,
    OrgContactLink,
    updateContactOrg,
    getRawOrg,
    getRawNoteOrganisationMap,
    getRawContactOrganisationMap,
    importOrgs,
    importNoteOrganisationMap,
    importContactOrgMap,
};
