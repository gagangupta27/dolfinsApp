import * as Contacts from "expo-contacts";

import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BUTTON_NAME,
  EVENTS,
  GLOBAL_KEYS,
  MODAL_NAME,
  useTrackWithPageInfo,
} from "../../utils/analytics";
import {
  OrgContactLink,
  updateContactOrg,
} from "../../realm/queries/organisationOperations";
import { useEffect, useRef, useState } from "react";
import { useObject, useQuery, useRealm } from "@realm/react";

import Contact from "../../realm/models/Contact";
import ContactOrganisationMap from "../../realm/models/ContactOrganisationMap";
import Dropdown from "../common/DropDown";
import ExactTextBox from "../notecontainer/ExactTextBox";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MultiInput from "../common/MultiInput";
import Organisation from "../../realm/models/Organisation";
import Toast from "react-native-toast-message";

async function requestContactPermission() {
  const { status } = await Contacts.requestPermissionsAsync();
  return status;
}

const NewContactModal = ({
  visible,
  onClose,
  onSubmit,
  existingId = null,
  title = "Create New",
}) => {
  const track = useTrackWithPageInfo();
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([""]);
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [organisation, setOrganisation] = useState([]);

  const realm = useRealm();
  const existingContact = existingId ? useObject(Contact, existingId) : null;
  const orgs = useQuery(Organisation);

  const contactOrgIds = existingContact
    ? useQuery(ContactOrganisationMap)
        .filtered(`contactId == $0`, existingContact._id)
        .map((o) => o?.organisationId)
    : [];

  const contactOrgs = existingContact
    ? useQuery(Organisation).filtered(`_id IN $0`, contactOrgIds)
    : [];

  const _dropDownRef = useRef();

  useEffect(() => {
    if (existingContact) {
      setName(existingContact?.name || "");
      setPhoneNumbers(existingContact?.phoneNumbers || [""]);
      setEmail(existingContact?.emails?.[0] || "");
      setLinkedin(existingContact?.linkedinProfileUrl || "");
      setShortDescription(existingContact?.note || "");
    }
  }, [existingContact]);

  useEffect(() => {
    if (contactOrgs && contactOrgs?.length > 0 && contactOrgs?.[0]) {
      setOrganisation(contactOrgs);
    }
  }, [contactOrgs?.length]);

  const onCreate = async () => {
    let contact = {};
    if (name != "") {
      const nameParts = name.split(" ");
      contact = {
        ...contact,
        [Contacts.Fields.FirstName]: nameParts[0],
        [Contacts.Fields.MiddleName]: nameParts[1] || "", // Correctly join the rest of the parts to form the last name
        [Contacts.Fields.LastName]: nameParts.slice(2).join(" ") || "", // Correctly join the rest of the parts to form the last name
      };
    }
    if (shortDescription != "") {
      contact = { ...contact, [Contacts.Fields.Note]: shortDescription };
    }
    if (Array.isArray(phoneNumbers)) {
      contact = {
        ...contact,
        [Contacts.Fields.PhoneNumbers]: phoneNumbers.map((ph) => ({
          label: "mobile",
          number: ph,
        })),
      };
    }
    if (email != "") {
      contact = {
        ...contact,
        [Contacts.Fields.Emails]: [
          {
            email: email,
          },
        ],
      };
    }
    if (linkedin != "") {
      contact = {
        ...contact,
        [Contacts.Fields.UrlAddresses]: [
          {
            label: "linkedin",
            url: linkedin,
          },
        ],
      };
    }
    if (Array.isArray(organisation) && organisation.length > 0) {
      contact = {
        ...contact,
        [Contacts.Fields.Company]: organisation[0]?.name || "",
      };
    }
    if (Object.keys(contact).length == 0) {
      Alert.alert("Error", "Please Enter Details!");
      return;
    }

    if (existingId) {
      realm.write(async () => {
        existingContact.name = name;
        existingContact.linkedinProfileUrl = linkedin;
        existingContact.emails = new Set([email, ...existingContact.emails]);
        existingContact.phoneNumbers = [...phoneNumbers];
      });
      if (organisation?.length > 0) {
        await updateContactOrg(realm, existingContact?._id, organisation);
      }

      try {
        const status = await requestContactPermission();
        if (status == "granted") {
          await Contacts.updateContactAsync({
            ...contact,
            id: existingContact?.id,
          });
        } else {
          Toast.show("Error");
        }
      } catch (e) {
        console.log(e);
      } finally {
        onClose();
      }
      onSubmit();
      return;
    }

    try {
      const status = await requestContactPermission();
      if (status == "granted") {
        const contactId = await Contacts.addContactAsync(contact);
        if (contactId) {
          const newContact = await Contacts.getContactByIdAsync(contactId);
          onSubmit(newContact);
        } else {
          console.log("Failed to add contact.");
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        scrollEnabled={true}
        style={{ flex: 1, backgroundColor: "white" }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 200,
          }}
          style={styles.container}
        >
          <TouchableOpacity>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  track(EVENTS.BUTTON_TAPPED.NAME, {
                    [GLOBAL_KEYS.MODAL_NAME]:
                      MODAL_NAME.CREATE_NEW_CONTACT_MODAL,
                    [EVENTS.BUTTON_TAPPED.KEYS.BUTTON_NAME]: BUTTON_NAME.CLOSE,
                  });
                  onClose();
                }}
              >
                <Ionicons
                  style={{
                    backgroundColor: "#F5F1F8",
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                  }}
                  name="chevron-back"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
              <Text style={styles.createtext}>{title}</Text>
              <TouchableOpacity
                onPress={() => {
                  track(EVENTS.BUTTON_TAPPED.NAME, {
                    [GLOBAL_KEYS.MODAL_NAME]:
                      MODAL_NAME.CREATE_NEW_CONTACT_MODAL,
                    [EVENTS.BUTTON_TAPPED.KEYS.BUTTON_NAME]: BUTTON_NAME.DONE,
                  });
                  onCreate();
                }}
              >
                <Text style={styles.done}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.form}>
              <View style={{ height: 50, marginVertical: 10 }}>
                <ExactTextBox
                  content={name}
                  setContent={setName}
                  placeholder="Name*"
                />
              </View>
              <View style={{ minHeight: 50, marginVertical: 10, zIndex: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 10,
                    paddingBottom: 10,
                  }}
                >
                  {organisation &&
                    organisation?.length > 0 &&
                    organisation?.[0] &&
                    organisation?.map((o) => (
                      <View
                        key={o._id}
                        style={{
                          padding: 10,
                          backgroundColor: "white",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          borderRadius: 7,
                          borderWidth: 0.7,
                        }}
                      >
                        <Text>{o?.name}</Text>
                        <TouchableOpacity
                          onPress={() => {
                            setOrganisation((prev) =>
                              prev.filter(
                                (org) => String(org._id) !== String(o._id)
                              )
                            );
                          }}
                          style={{
                            paddingLeft: 10,
                          }}
                        >
                          <Text>X</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                </View>

                <Dropdown
                  options={orgs}
                  onOptionSelected={(option) => {
                    if (
                      Array.isArray(organisation) &&
                      !organisation?.find(
                        (o) => String(o._id) == String(option._id)
                      )
                    ) {
                      setOrganisation([...organisation, option]);
                    }
                    _dropDownRef?.current?.onRefresh();
                  }}
                  ref={_dropDownRef}
                  placeholder="Organization"
                />
              </View>
              <View style={{ height: 50, marginVertical: 10 }}>
                <ExactTextBox
                  content={shortDescription}
                  setContent={setShortDescription}
                  placeholder="Short Description"
                />
              </View>
              <View style={{ marginVertical: 10 }}>
                <MultiInput
                  placeholder="Phone number"
                  addText="Add Phone number"
                  inputs={phoneNumbers}
                  setInputs={setPhoneNumbers}
                />
              </View>
              <View style={{ height: 50, marginVertical: 10 }}>
                <ExactTextBox
                  content={email}
                  setContent={setEmail}
                  placeholder="Email"
                />
              </View>
              {/* <View style={{ height: 50, marginVertical: 10 }}>
                <ExactTextBox
                  content={linkedin}
                  setContent={setLinkedin}
                  placeholder="Linkedin Profile Url"
                />
              </View> */}
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginTop: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  createtext: {
    fontSize: 20,
    fontFamily: "WorkSans-Bold",
    color: "#000000",
  },
  done: {
    fontSize: 20,
    fontFamily: "WorkSans-Bold",
    color: "#000",
  },
  form: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
export default NewContactModal;
