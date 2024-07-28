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

function deleteOrganisation(
  realm: Realm,
  organisationId: string // Note the change to string type
) {
  const organisationId2 = new BSON.ObjectId(organisationId); // Convert string to ObjectId

  realm.write(() => {
    const organisation = realm.objectForPrimaryKey(
      "Organisation",
      organisationId2
    );
    if (organisation) {
      const contactOrgMaps = realm
        .objects("ContactOrganisationMap")
        .filtered("organisationId == $0", organisationId2);
      realm.delete(contactOrgMaps);

      const noteOrgMaps = realm
        .objects("NoteOrganisationMap")
        .filtered("organisationId == $0", organisationId2);
      realm.delete(noteOrgMaps);

      // Finally, delete the organisation
      realm.delete(organisation);
    }
  });
}

async function OrgContactLink(
  realm: Realm,
  organisationId: string,
  contactId: string,
  companyName: string
) {
  let organisationId2;
  if (organisationId) {
    organisationId2 = new BSON.ObjectId(organisationId);
  } else {
    let organisation = realm
      .objects("Organisation")
      .filtered("name == $0", companyName)[0];
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
      .filtered(
        "contactId == $0 AND organisationId == $1",
        contactId2,
        organisationId2
      );

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

async function updateContactOrg(
  realm: Realm,
  contactId: string,
  organisations: Organisation[]
) {
  realm.write(() => {
    const contactOrgMap = realm
      .objects("ContactOrganisationMap")
      .filtered("contactId == $0", contactId);
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
  realm.write(() => {
    const orgs = realm.objects("Organisation");
    orgJSON = [...orgs];
  });

  return orgJSON;
}

async function getRawNoteOrganisationMap(realm: Realm) {
  let orgJSON = [];
  realm.write(() => {
    const orgs = realm.objects("NoteOrganisationMap");
    orgJSON = [...orgs];
  });

  return orgJSON;
}

async function getRawContactOrganisationMap(realm: Realm) {
  let orgJSON = [];
  realm.write(() => {
    const orgs = realm.objects("ContactOrganisationMap");
    orgJSON = [...orgs];
  });

  return orgJSON;
}

export {
  deleteOrganisation,
  addOrganisation,
  OrgContactLink,
  updateContactOrg,
  getRawOrg,
  getRawNoteOrganisationMap,
  getRawContactOrganisationMap,
};
