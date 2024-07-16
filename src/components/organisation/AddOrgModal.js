import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  OrgContactLink,
  addOrganisation,
} from "../../realm/queries/organisationOperations";
import { useEffect, useRef, useState } from "react";
import { useObject, useQuery, useRealm } from "@realm/react";

import Api from "../../utils/Api";
import Contact from "../../realm/models/Contact";
import Dropdown from "../common/DropDown";
import ExactTextBox from "../notecontainer/ExactTextBox";
import { Ionicons } from "@expo/vector-icons";
import MultiInput from "../common/MultiInput";
import Organisation from "../../realm/models/Organisation";

const AddOrgModal = ({
  visible = false,
  onClose = () => {},
  onSubmit = () => {},
  existingId = null,
  title = "Create New",
}) => {
  const [name, setName] = useState("");
  const [linkedin, setLinkedin] = useState(
    "https://www.linkedin.com/company/google/"
  );
  const [contacts, setContacts] = useState([]);
  const [links, setLinks] = useState([]);

  const realm = useRealm();
  const existingOrg = existingId ? useObject(Organisation, existingId) : null;
  const allContacts = useQuery(Contact);

  const _dropDownRef = useRef();

  useEffect(() => {
    if (existingOrg) {
      setName(existingOrg?.name);
      setLinkedin(
        existingOrg?.linkedinUrl || "https://www.linkedin.com/company/google/"
      );
      setContacts(
        existingOrg?.contacts
          ? existingOrg?.contacts?.map((o) => o?.contact)
          : []
      );
      setLinks(existingOrg?.links || []);
    }
  }, [existingOrg]);

  const onCreate = async () => {
    if (existingId) {
      realm.write(() => {
        existingOrg.name = name;
        existingOrg.linkedinUrl = linkedin;
        existingOrg.links = new Set([...links]);
      });
      contacts?.forEach((contact) => {
        OrgContactLink(realm, String(existingOrg?._id), String(contact?._id));
      });
    } else {
      if (name?.trim()?.length == 0) {
        Alert.alert("Error", "Please Enter Organisation Name!");
        return;
      }
      const summary = await fetchOrgSummary();
      const createdOrg = await addOrganisation(realm, {
        name: name,
        linkedinUrl: linkedin,
        linkedinProfile: "",
        summary: summary,
        createdAt: new Date(),
        updatedAt: new Date(),
        links: new Set([...links]),
      });

      contacts?.forEach((contact) => {
        OrgContactLink(realm, String(createdOrg?._id), String(contact?._id));
      });
    }
    setName("");
    /*     setLinkedin("");
     */
    onClose();
  };

  const fetchOrgSummary = async () => {
    if (linkedin) {
      const data = await fetchLinkedinData();
      return data?.summary || "";
    } else {
      return "";
    }
  };

  const fetchLinkedinData = async (linkedinId = "google") => {
    return new Promise((resolve, reject) => {
      Api.post("/api/1.0/user/linkedin-details", {
        profile_id: linkedinId,
        profile_type: "personal",
        contact_info: false,
        recommendations: false,
        related_profiles: false,
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
          resolve(null);
        });
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
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
          <View style={{ height: 50, marginVertical: 10 }}>
            <ExactTextBox
              content={linkedin}
              setContent={setLinkedin}
              placeholder="Linkedin Profile Url"
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
              {Array.isArray(contacts) &&
                contacts?.map((o) => (
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
                    <Text>{o.name}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setContacts((prev) =>
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
              options={allContacts}
              onOptionSelected={(option) => {
                if (
                  Array.isArray(contacts) &&
                  !contacts?.find((o) => String(o._id) == String(option._id))
                ) {
                  setContacts([...contacts, option]);
                }
                _dropDownRef?.current?.onRefresh();
              }}
              ref={_dropDownRef}
              placeholder="Contacts"
            />
          </View>
          <MultiInput
            inputs={links}
            setInputs={setLinks}
            addText="Add Additional Link"
            placeholder="Additional Links"
          />
        </View>
      </ScrollView>
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
    borderColor: "#A5A6F6",
    borderWidth: 1,
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
export default AddOrgModal;
