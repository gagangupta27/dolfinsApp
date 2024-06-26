import Realm, { BSON } from "realm";

async function addOrganisation(
  realm: Realm,
  organisationData: {
    name: string;
    linkedinUrl: string;
    linkedinProfile: string;
    summary: string;
    createdAt: Date;
    updatedAt: Date;
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
      // Delete all related ContactOrganisationMap entries
      const contactOrgMaps = realm
        .objects("ContactOrganisationMap")
        .filtered("organisation._id == $0", organisationId2);
      realm.delete(contactOrgMaps);

      // Delete all related NoteOrganisationMap entries
      const noteOrgMaps = realm
        .objects("NoteOrganisationMap")
        .filtered("organisation._id == $0", organisationId2);
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
        summary: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
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
        "contact._id == $0 AND organisation._id == $1",
        contactId2,
        organisationId2
      );

    if (existingLink.length === 0 && contactId2 && organisationId2) {
      const tempContact = realm.objectForPrimaryKey("Contact", contactId2);
      const tempOrg = realm.objectForPrimaryKey(
        "Organisation",
        organisationId2
      );

      // Create a new mapping if it does not exist
      realm.create("ContactOrganisationMap", {
        _id: new BSON.ObjectId(),
        contact: tempContact,
        organisation: tempOrg,
      });
    }
  });
}

export { deleteOrganisation, addOrganisation, OrgContactLink };
