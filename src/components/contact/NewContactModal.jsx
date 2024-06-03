import { Ionicons } from "@expo/vector-icons";
import * as Contacts from "expo-contacts";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  BUTTON_NAME,
  EVENTS,
  GLOBAL_KEYS,
  MODAL_NAME,
  useTrackWithPageInfo,
} from "../../utils/analytics";
import ExactTextBox from "../notecontainer/ExactTextBox";
async function requestContactPermission() {
  const { status } = await Contacts.requestPermissionsAsync();
  return status;
}

const NewContactModal = ({ visible, onClose, onSubmit }) => {
  const track = useTrackWithPageInfo();
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const onCreate = async () => {
    let contact = {};
    if (name != "") {
      contact = { ...contact, [Contacts.Fields.FirstName]: name };
    }
    if (shortDescription != "") {
      contact = { ...contact, [Contacts.Fields.Note]: shortDescription };
    }
    if (phoneNumber != "") {
      contact = {
        ...contact,
        [Contacts.Fields.PhoneNumbers]: [
          {
            label: "mobile",
            number: phoneNumber,
          },
        ],
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

    if (contact == {}) {
      onClose();
      return;
    }

    try {
      const status = await requestContactPermission();
      if (status == "granted") {
        const contactId = await Contacts.addContactAsync(contact);
        if (contactId) {
          const newContact = await Contacts.getContactByIdAsync(contactId);
          onSubmit(newContact);
          console.log("Contact was added!");
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
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              track(EVENTS.BUTTON_TAPPED.NAME, {
                [GLOBAL_KEYS.MODAL_NAME]: MODAL_NAME.CREATE_NEW_CONTACT_MODAL,
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
          <Text style={styles.createtext}>Create New</Text>
          <TouchableOpacity
            onPress={() => {
              track(EVENTS.BUTTON_TAPPED.NAME, {
                [GLOBAL_KEYS.MODAL_NAME]: MODAL_NAME.CREATE_NEW_CONTACT_MODAL,
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
          <View style={{ height: 50, marginVertical: 10 }}>
            <ExactTextBox
              content={shortDescription}
              setContent={setShortDescription}
              placeholder="Short Description"
            />
          </View>
          <View style={{ height: 50, marginVertical: 10 }}>
            <ExactTextBox
              content={phoneNumber}
              setContent={setPhoneNumber}
              placeholder="Phone number"
            />
          </View>
          <View style={{ height: 50, marginVertical: 10 }}>
            <ExactTextBox
              content={email}
              setContent={setEmail}
              placeholder="Email"
            />
          </View>
          <View style={{ height: 50, marginVertical: 10 }}>
            <ExactTextBox
              content={linkedin}
              setContent={setLinkedin}
              placeholder="Linkedin Profile Url"
            />
          </View>
        </View>
      </View>
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
    color: "#7879F1",
  },
  form: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
export default NewContactModal;
