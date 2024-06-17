import * as Contacts from "expo-contacts";

import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  VirtualizedList,
} from "react-native";
import {
  BUTTON_NAME,
  CARD_NAME,
  EVENTS,
  GLOBAL_KEYS,
  MODAL_NAME,
  useTrackWithPageInfo,
} from "../../utils/analytics";
import React, { useEffect, useState } from "react";
import Svg, { Path } from "react-native-svg";

import { Entypo } from "@expo/vector-icons";
import ExactTextBox from "../notecontainer/ExactTextBox";
import NewContactModal from "./NewContactModal";
import { updateContactById } from "../../realm/queries/contactOperations";
import { useRealm } from "@realm/react";

const Checked = () => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
    >
      <Path
        d="M13 24C19.0751 24 24 19.0751 24 13C24 6.92487 19.0751 2 13 2C6.92487 2 2 6.92487 2 13C2 19.0751 6.92487 24 13 24Z"
        fill="#A5A6F6"
        stroke="#A5A6F6"
        stroke-width="3.19171"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path d="M7.5 13.55L10.8 16.85L18.5 9.15002" fill="#A5A6F6" />
      <Path
        d="M7.5 13.55L10.8 16.85L18.5 9.15002"
        stroke="white"
        stroke-width="3.19171"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

const ContactSelectionModal = ({
  ogSelected,
  visible,
  onClose,
  addContactsAndClose,
}) => {
  const track = useTrackWithPageInfo();
  const realm = useRealm();

  const [selectedContacts, setSelectedContacts] = useState([]); // Your contacts data
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [createContactModalVisible, setCreateContactModalVisible] =
    useState(false);
  const [contacts, setContacts] = useState([]); // Your contacts data
  const [loadingContacts, setLoadingContacts] = useState(false);

  useEffect(() => {
    (async () => {
      if (contacts.length != 0) {
        setLoadingContacts(false);
        return;
      }
      setLoadingContacts(true);
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({});
        const sortedData = data
          .sort((a, b) => {
            let nameA = a.name?.toUpperCase(); // to ensure case-insensitivity
            let nameB = b.name?.toUpperCase(); // to ensure case-insensitivity
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0; // names must be equal
          })
          .filter((a) => a.name && a.name.length > 0);

        setContacts(sortedData);
        setFilteredContacts(sortedData);
        track(EVENTS.LANDED_ON_MODAL.NAME, {
          [GLOBAL_KEYS.MODAL_NAME]: MODAL_NAME.ADD_CONTACT,
          [EVENTS.LANDED_ON_MODAL.KEYS.MODAL_CONTENT_COUNT]: sortedData.length,
        });
        refreshContactsList(sortedData);
      }
      setLoadingContacts(false);
    })();
  }, []);

  const refreshContactsList = (contactDataFromApp) => {
    ogSelected.forEach((contact) => {
      const contactFromApp = contactDataFromApp.find((c) => c.id == contact.id);
      if (contactFromApp) {
        updateContactById(realm, contactFromApp.id, contactFromApp);
      }
    });
  };

  useEffect(() => {
    if (searchText) {
      const textData = searchText?.toUpperCase();
      const newData = contacts.filter((item) => {
        const itemData = item.name ? item.name?.toUpperCase() : "";
        const matchIndex = itemData.indexOf(textData);
        return matchIndex > -1;
      });

      if (newData.length != 0) {
        setFilteredContacts(newData);
      } else {
        setFilteredContacts(contacts);
      }
    } else {
      setFilteredContacts(contacts);
    }
  }, [contacts, searchText]);

  const renderItem = ({ item }, onChange) => {
    const isChecked = selectedContacts.some(
      (contact) => contact.id === item.id
    );

    const isOgSelected = ogSelected.some((contact) => contact.id === item.id);

    const MyCheckbox = ({ checked, onChange }) => {
      const onPressChecked = () => {
        track(EVENTS.CARD_TAPPED.NAME, {
          [GLOBAL_KEYS.MODAL_NAME]: MODAL_NAME.ADD_CONTACT,
          [EVENTS.CARD_TAPPED.KEYS.CARD_NAME]: CARD_NAME.SELECT_CONTACT,
          [EVENTS.CARD_TAPPED.KEYS.CARD_IDENTIFIER]: item.name,
          [GLOBAL_KEYS.SELECTED]: !checked,
        });
        const newCheck = !checked;
        onChange(newCheck);
      };
      return (
        <Pressable
          style={[styles.checkboxBase, checked && styles.checkboxChecked]}
          onPress={() => {
            onPressChecked();
          }}
        >
          {checked && <Checked />}
        </Pressable>
      );
    };

    const number = item?.phoneNumbers?.find(() => true)?.number;
    return (
      <View
        style={{
          margin: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ margin: 5 }}>
          <Text style={{ fontFamily: "Inter-Bold" }}>{item.name}</Text>
          {number && <Text>{number}</Text>}
        </View>
        <View>
          <MyCheckbox
            checked={isChecked || isOgSelected}
            onChange={(newCheck) => onChange(newCheck, item)}
          />
        </View>
      </View>
    );
  };

  const renderSeparator = () => <View style={styles.separator} />;

  const onChange = (checked, item) => {
    if (checked) {
      if (!selectedContacts.some((p) => item.id == p.id)) {
        setSelectedContacts([...selectedContacts, item]);
      }
    } else {
      setSelectedContacts(selectedContacts.filter((p) => item.id != p.id));
    }
  };

  const renderSelectedContact = ({ item }) => (
    <View
      key={"selected_" + item.id}
      style={{
        borderRadius: 5,
        backgroundColor: "rgba(165, 166, 246, 0.30)",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 5,
        marginHorizontal: 5,
        marginVertical: 5,
      }}
    >
      <Text
        style={{
          paddingHorizontal: 2,
          fontFamily: "Inter-Regular",
        }}
      >
        {item.name}
      </Text>
      <TouchableOpacity
        key={"cross_" + item.id}
        onPress={() => {
          setSelectedContacts(selectedContacts.filter((p) => p.id != item.id));
        }}
      >
        <Entypo name="cross" size={16} color="black" />
      </TouchableOpacity>
    </View>
  );

  const onSubmitModal = (item) => {
    setContacts([item, ...contacts]);
    setSelectedContacts([...selectedContacts, item]);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <NewContactModal
        visible={createContactModalVisible}
        onClose={() => setCreateContactModalVisible(false)}
        onSubmit={onSubmitModal}
      />
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              track(EVENTS.BUTTON_TAPPED.NAME, {
                [GLOBAL_KEYS.MODAL_NAME]: MODAL_NAME.ADD_CONTACT,
                [EVENTS.BUTTON_TAPPED.KEYS.BUTTON_NAME]: BUTTON_NAME.CLOSE,
              });
              onClose();
            }}
          >
            <Entypo
              style={{}}
              name="circle-with-cross"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontFamily: "WorkSans-Bold" }}>
            Add new note to
          </Text>
          <TouchableOpacity
            onPress={() => {
              track(EVENTS.BUTTON_TAPPED.NAME, {
                [GLOBAL_KEYS.MODAL_NAME]: MODAL_NAME.ADD_CONTACT,
                [EVENTS.BUTTON_TAPPED.KEYS.BUTTON_NAME]: BUTTON_NAME.DONE,
              });
              addContactsAndClose(selectedContacts);
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "WorkSans-Bold",
                color: "#7879F1",
              }}
            >
              Done
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 50 }}>
          <ExactTextBox
            content={searchText}
            setContent={setSearchText}
            setIsFocused={() => {}}
            placeholder="Search for a name"
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            padding: 10,
            backgroundColor: "rgba(165, 166, 246, 0.31)",
            marginVertical: 15,
            alignItems: "center",
          }}
        >
          <View
            style={{
              paddingHorizontal: 10,
              height: 34,
              width: 34,
              backgroundColor: "rgba(165, 166, 246, 0.48)",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 40,
            }}
          >
            <Text style={{ fontSize: 20 }}>+</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              track(EVENTS.LANDED_ON_MODAL.NAME, {
                [GLOBAL_KEYS.MODAL_NAME]: MODAL_NAME.CREATE_NEW_CONTACT_MODAL,
              });

              setCreateContactModalVisible(true);
            }}
          >
            <View style={{ paddingHorizontal: 10 }}>
              <Text style={{ fontSize: 16, fontFamily: "WorkSans-Bold" }}>
                Create new contact or section
              </Text>
              <Text style={{ fontSize: 16, fontFamily: "WorkSans-Regular" }}>
                Add notes to any entity
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {selectedContacts &&
          selectedContacts.filter(
            (item) => !ogSelected.some((it) => it.id == item.id)
          ).length > 0 && (
            <View
              style={{
                backgroundColor: "rgba(165, 166, 246, 0.15)",
                padding: 10,
                flexDirection: "row",
                flexWrap: "wrap",
                marginVertical: 10,
              }}
            >
              {selectedContacts
                .filter((item) => !ogSelected.some((it) => it.id == item.id))
                .map((item) => renderSelectedContact({ item }))}
            </View>
          )}
        <View style={{ backgroundColor: "rgba(165, 166, 246, 0.31)" }}>
          <VirtualizedList
            initialNumToRender={15}
            data={filteredContacts}
            renderItem={({ item }) => renderItem({ item }, onChange)}
            keyExtractor={(item) => "cute_" + item.id.toString()}
            getItemCount={(x) => filteredContacts.length}
            getItem={(x, i) => filteredContacts[i]}
            ItemSeparatorComponent={renderSeparator}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
          />
        </View>
        <ActivityIndicator
          animating={loadingContacts}
          size="large"
          color="#0000ff"
        />
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
  contactItem: {
    padding: 10,
    fontSize: 18,
    fontFamily: "WorkSans-Regular", // You will need to include the font in your project
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#CED0CE",
  },
  searchBar: {
    width: "100%",
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#CED0CE",
    borderRadius: 0, // No rounded corners
  },
  highlightedText: {
    // fontWeight: 200,
    fontFamily: "WorkSans-Regular", // You will need to include the font in your project
    color: "blue",
  },
  checkboxBase: {
    width: 22,
    height: 22,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#A5A6F6",
    backgroundColor: "transparent",
  },
  checkboxChecked: {},
});

export default ContactSelectionModal;
