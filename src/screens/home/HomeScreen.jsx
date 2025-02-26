import { AntDesign, Entypo } from "@expo/vector-icons";
import {
  BUTTON_NAME,
  EVENTS,
  useTrackWithPageInfo,
} from "../../utils/analytics";
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { NativeModules, TouchableWithoutFeedback, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  addContact,
  deleteContact,
} from "../../realm/queries/contactOperations";
import {
  createNoteAndAddToContact,
  useAllCalendarNotes,
  useAllContactNotes,
} from "../../realm/queries/noteOperations";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useQuery, useRealm } from "@realm/react";

import AddEventModal from "../calendar/AddEventModal";
import AddOrgModal from "../../components/organisation/AddOrgModal";
import { BSON } from "realm";
import CalendarItem from "../../components/calendar/CalendarItem";
import CalendarTab from "../../components/calendar/CalendarTab";
import Contact from "../../realm/models/Contact";
import ContactItem from "../../components/contact/ContactItem";
import ContactList from "../../components/contact/ContactList";
import ContactSelectionModal from "../../components/contact/ContactSelectionModal";
import Header from "../../components/common/Header";
import Modal from "react-native-modal";
import NewNoteContainerV2 from "../../components/notecontainer/NewNoteContainerV2";
import NoteDone from "../../components/home/NoteDone";
import { OrgContactLink } from "../../realm/queries/organisationOperations";
import OrganisationTab from "./OrganisationTab";
import QuickNotes from "../../components/home/QuickNotes";
import SearchResultItem from "../../components/search/SearchResultItem";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { getWorkHistoryList } from "../../utils/linkedin";
import { useAllCalendarEvents } from "../../realm/queries/calendarEventOperations";
import useQuickNote from "../../hooks/useQuickNote";

const Tab = createMaterialTopTabNavigator();

const SearchBar = ({ search, text, setText }) => {
  useEffect(() => {
    search(text);
  }, [text]);

  return (
    <View style={styles.searchbar}>
      <AntDesign
        style={{ marginRight: 10 }}
        name="search1"
        size={20}
        color="#A5A6F6"
      />
      <TextInput
        style={{ flex: 1 }}
        placeholder="Search"
        value={text}
        onChangeText={setText}
      />
      {text.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            setText("");
            search("");
          }}
        >
          <Text style={{ color: "black", paddingLeft: 10 }}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const CommonComponent = () => {
  const track = useTrackWithPageInfo();
  const realm = useRealm();

  const [activeTab, setActiveTab] = useState("contacts");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [text, setText] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [searchListData, setSearchListData] = useState([]);

  const noteRef = useRef(null);
  const navigation = useNavigation();
  const quickNoteRef = useQuickNote();

  const [currentNoteAdded, setCurrentNoteAdded] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addOrgModalVisible, setAddOrgModalVisible] = useState(false);
  const [addEventModalVisible, setAddEventModalVisible] = useState(false);

  const { ShareModule } = NativeModules;

  async function getSharedData() {
    try {
      const { sharedURL, sharedText } = await ShareModule.getSharedData();
      console.log("Shared URL:", sharedURL);
      console.log("Shared Text:", sharedText);
      // Handle shared data
    } catch (error) {
      console.log("Error fetching shared data:", error);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getSharedData();
    }, [])
  );

  const contacts = useQuery(
    Contact,
    (tasks) => {
      return tasks.sorted([
        ["isPinned", true],
        ["isFavourite", true],
        ["name", false],
      ]);
    },
    []
  ).filtered("_id != $0", quickNoteRef._id);
  // const contacts = useContacts(realm);
  const allNotes = useAllContactNotes(realm);
  const contactMap = contacts.reduce((acc, contact) => {
    acc[contact._id] = contact;
    return acc;
  }, {});
  contactMap[quickNoteRef._id] = quickNoteRef;

  const calendarEvents = useAllCalendarEvents(realm);
  const allCalendarEventNotes = useAllCalendarNotes(realm);
  const calendarEventMap = calendarEvents.reduce((acc, calendarEvent) => {
    acc[calendarEvent._id] = calendarEvent;
    return acc;
  }, {});

  const [contactSettingModalContact, setContactSettingModalContact] =
    useState(null);
  const isContactSettingModalVisible = contactSettingModalContact != null;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardOpen(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardOpen(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const delContact = async () => {
    deleteContact(realm, contactSettingModalContact?._id);
  };

  const handleLongPress = (item) => {
    setContactSettingModalContact(item);
  };

  const handleCloseModal = () => {
    setContactSettingModalContact(null);
  };

  const handleSelectContact = async (selectedContacts) => {
    const newContacts = selectedContacts.filter(
      (item) => !contacts.some((c) => c.id == item.id)
    );
    if (newContacts.length != 0) {
      for (let contact of newContacts) {
        let createdContact = await addContact(realm, {
          ...contact,
          image: contact?.image?.uri,
        });
        if (contact?.company) {
          OrgContactLink(realm, "", createdContact?._id, contact?.company);
        }
      }
    }
    setModalVisible(false);
  };

  const addNoteV2 = async (
    content,
    mentions,
    imageData,
    audioUri,
    audioText = "",
    volumeLevels,
    document
  ) => {
    if (
      !mentions.some(
        (mention) =>
          String(mention?.contact?._id || mention?.organisation?._id) ===
          String(quickNoteRef._id)
      )
    ) {
      mentions.push({
        _id: new BSON.ObjectId(),
        contact: quickNoteRef,
      });
    }
    const newNote = {
      content: content,
      mentions: mentions || [],
      type:
        imageData?.length > 0
          ? "image"
          : audioUri
          ? "audio"
          : document
          ? "document"
          : "text",
      imageData: imageData || [],
      audioUri: audioUri || null,
      audioText: audioText || "",
      volumeLevels: volumeLevels || [],
      documentUri: document ? document.documentUri : null,
      documentName: document ? document.documentName : null,
    };

    createNoteAndAddToContact(realm, quickNoteRef._id, newNote);
    setCurrentNoteAdded(newNote);
    setTimeout(() => {
      setCurrentNoteAdded(null);
    }, 2000);
  };

  const onNewContactClick = () => {
    if (activeTab == "organisation") {
      setAddOrgModalVisible(true);
      return;
    }
    if (activeTab == "calendar") {
      setAddEventModalVisible(true);
      return;
    }
    setModalVisible(true);
    track(EVENTS.BUTTON_TAPPED.NAME, {
      [EVENTS.BUTTON_TAPPED.KEYS.BUTTON_NAME]: BUTTON_NAME.ADD_NEW_CONTACT,
    });
  };

  const search = (text) => {
    if (text) {
      const searchContactResults = contacts.filter((contact) => {
        if (contact.name) {
          return contact.name.toLowerCase().includes(text.toLowerCase());
        }
        return false;
      });

      let workHistoryNotes = contacts
        .map((contact) => {
          if (contact.linkedinProfileData) {
            const workHistory = getWorkHistoryList(
              JSON.parse(contact.linkedinProfileData)
            );
            if (
              workHistory &&
              workHistory.toLowerCase().includes(text.toLowerCase())
            ) {
              return {
                _id: new BSON.ObjectId(),
                contactId: contact._id,
                content: "*Work history* \n\n \n\n" + workHistory,
                mentions: [],
                type: "text",
              };
            }
          }
          return null;
        })
        .filter((note) => note !== null);

      let summaryNotes = contacts
        .map((contact) => {
          if (contact.linkedinSummary) {
            if (
              contact.linkedinSummary.toLowerCase().includes(text.toLowerCase())
            ) {
              return {
                _id: new BSON.ObjectId(),
                contactId: contact._id,
                content: "*Quick Summary* \n\n \n\n" + contact.linkedinSummary,
                mentions: [],
                type: "text",
              };
            }
          }
          return null;
        })
        .filter((note) => note !== null);

      let writtenNotesResults = allNotes.filter((note) => {
        if (note.content) {
          return note.content.toLowerCase().includes(text.toLowerCase());
        }
        return false;
      });

      let noteResults = [
        ...workHistoryNotes,
        ...summaryNotes,
        ...writtenNotesResults,
      ].map((note) => {
        return { contact: contactMap[note.contactId], note: note };
      });

      // Sort by updatedAt and take top 10
      noteResults.sort((a, b) => {
        if (b.note.updatedAt && a.note.updatedAt) {
          return new Date(b.note.updatedAt) - new Date(a.note.updatedAt);
        } else if (b.note.updatedAt) {
          return -1;
        } else if (a.note.updatedAt) {
          return 1;
        } else {
          return 0;
        }
      });

      noteResults = noteResults.slice(0, 10);

      const searchCalendarResults = calendarEvents.filter((calendarEvent) => {
        let exists = false;
        if (calendarEvent?.title) {
          exists =
            exists ||
            calendarEvent?.title.toLowerCase().includes(text.toLowerCase());
        }
        if (calendarEvent?.description) {
          exists =
            exists ||
            calendarEvent?.description
              ?.toLowerCase()
              ?.includes(text?.toLowerCase());
        }
        if (calendarEvent?.attendees?.length > 0) {
          exists =
            exists ||
            calendarEvent?.attendees?.filter((attendee) =>
              attendee?.contact?.name?.toLowerCase().includes(text?.toLowerCase)
            ).length > 0;
        }
        if (calendarEvent?.organizer) {
          exists =
            exists ||
            calendarEvent?.organizer?.contact?.name
              ?.toLowerCase()
              .includes(text.toLowerCase());
        }
        return exists;
      });

      let calendarNotesResults = allCalendarEventNotes
        ?.filter((note) => {
          if (note?.content) {
            return note?.content?.toLowerCase()?.includes(text?.toLowerCase());
          }
          return false;
        })
        .map((note) => {
          return {
            calendarEvent: calendarEventMap[note.calendarEventId],
            note: note,
          };
        });

      calendarNotesResults.sort((a, b) => {
        if (b.note.updatedAt && a.note.updatedAt) {
          return new Date(b.note.updatedAt) - new Date(a.note.updatedAt);
        } else if (b.note.updatedAt) {
          return -1;
        } else if (a.note.updatedAt) {
          return 1;
        } else {
          return 0;
        }
      });

      calendarNotesResults = calendarNotesResults.slice(0, 10);

      const listData = [];
      if (searchContactResults.length > 0) {
        listData.push({ type: "header", title: "Contact Results" });
        listData.push(
          ...searchContactResults.map((item) => ({ ...item, type: "contact" }))
        );
      }
      if (noteResults.length > 0) {
        listData.push({ type: "header", title: "Notes Results" });
        listData.push(
          ...noteResults.map((item) => ({ ...item, type: "note" }))
        );
      }

      if (searchCalendarResults.length > 0) {
        listData.push({ type: "header", title: "Calendar Event Results" });
        listData.push(
          ...searchCalendarResults.map((item) => ({
            ...item,
            type: "calendar_event",
          }))
        );
      }
      if (calendarNotesResults.length > 0) {
        listData.push({ type: "header", title: "Calendar Notes Results" });
        listData.push(
          ...calendarNotesResults.map((item) => ({
            ...item,
            type: "calendar_note",
          }))
        );
      }

      setSearchListData(listData);
      setIsSearch(true);
    } else {
      setIsSearch(false);
    }
    // Now Search
  };

  const onFavPress = (item) => {
    realm.write(() => {
      // If an object exists, setting the third parameter (`updateMode`) to
      // "modified" only updates properties that have changed, resulting in
      // faster operations.
      realm.create(
        "Contact",
        { ...item, isFavourite: !item?.isFavourite },
        "modified"
      );
    });
  };

  const onPinPress = (item) => {
    realm.write(() => {
      // If an object exists, setting the third parameter (`updateMode`) to
      // "modified" only updates properties that have changed, resulting in
      // faster operations.
      realm.create(
        "Contact",
        { ...item, isPinned: !item?.isPinned },
        "modified"
      );
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <TouchableWithoutFeedback
        onPress={() => {
          if (noteRef.current) {
            noteRef.current.unfocus();
          }
        }}
      >
        <View style={{ flex: 1 }}>
          <Header
            hideBack
            /*             isSearch={isSearch}
             */ title="dolfins"
            rightIcons={() => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={onNewContactClick}
                >
                  <AntDesign name="pluscircle" size={20} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconButton, { paddingLeft: 8 }]}
                  onPress={() => navigation.navigate("Menu")}
                >
                  <Entypo name="menu" size={24} color="black" />
                </TouchableOpacity>
              </View>
            )}
            bottomComp={() => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  paddingVertical: 15,
                  backgroundColor: "#fff",
                }}
              >
                <TouchableOpacity onPress={() => setActiveTab("contacts")}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "black",
                      fontFamily:
                        activeTab === "contacts"
                          ? "WorkSans-Bold"
                          : "WorkSans-Regular",
                      textDecorationLine:
                        activeTab === "contacts" ? "underline" : "none",
                    }}
                  >
                    Contacts
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab("calendar")}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "black",
                      fontFamily:
                        activeTab === "calendar"
                          ? "WorkSans-Bold"
                          : "WorkSans-Regular",
                      textDecorationLine:
                        activeTab === "calendar" ? "underline" : "none",
                    }}
                  >
                    Calendar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab("organisation")}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "black",
                      fontFamily:
                        activeTab === "organisation"
                          ? "WorkSans-Bold"
                          : "WorkSans-Regular",
                      textDecorationLine:
                        activeTab === "organisation" ? "underline" : "none",
                    }}
                  >
                    Organization
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <ContactSelectionModal
            visible={modalVisible}
            ogSelected={contacts}
            onClose={() => setModalVisible(false)}
            addContactsAndClose={handleSelectContact}
          />
          {activeTab === "contacts" && (
            <View style={{ flex: 1 }}>
              <SearchBar search={search} text={text} setText={setText} />
              {isSearch && (
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: 15,
                    marginVertical: 5,
                  }}
                >
                  <FlatList
                    data={searchListData}
                    renderItem={({ item }) => {
                      if (item.type === "header") {
                        return (
                          <Text
                            style={{
                              marginHorizontal: 10,
                              marginVertical: 8,
                              fontFamily: "Inter-Bold",
                              fontSize: 18,
                            }}
                          >
                            {item.title}
                          </Text>
                        );
                      } else if (item.type === "contact") {
                        return (
                          <ContactItem
                            item={item}
                            onLongPress={handleLongPress}
                          />
                        );
                      } else if (item.type === "note") {
                        return (
                          <ScrollView
                            style={{
                              maxHeight: 200,
                              margin: 5,
                              padding: 10,
                              backgroundColor: "#fff",
                              borderRadius: 5,
                            }}
                          >
                            <SearchResultItem
                              searchterm={text}
                              name={item.contact.name}
                              note={item.note}
                              onPress={() => {
                                navigation.navigate("ContactScreen", {
                                  contactId: quickNoteRef._id.toHexString(),
                                });
                              }}
                            />
                          </ScrollView>
                        );
                      } else if (item.type === "calendar_note") {
                        return (
                          <ScrollView
                            style={{
                              maxHeight: 200,
                              margin: 5,
                              padding: 10,
                              backgroundColor: "#fff",
                              borderRadius: 5,
                            }}
                          >
                            <SearchResultItem
                              searchterm={text}
                              name={item?.calendarEvent?.title}
                              note={item.note}
                              onPress={() => {
                                navigation.navigate("CalendarEventScreen", {
                                  eventId: String(item?.note?.calendarEventId),
                                });
                              }}
                            />
                          </ScrollView>
                        );
                      } else if (item.type === "calendar_event") {
                        return (
                          <CalendarItem
                            item={item}
                            onPress={() => {
                              console.log("item", item);
                              navigation.navigate("CalendarEventScreen", {
                                eventId: item?._id?.toHexString(),
                              });
                            }}
                          ></CalendarItem>
                        );
                      }
                    }}
                    keyExtractor={(item, index) =>
                      item.type === "contact"
                        ? item.id
                        : item.type === "note"
                        ? item.note._id
                        : index.toString()
                    }
                  />
                </View>
              )}
              {!isSearch && (
                <View style={{ flex: 1 }}>
                  <QuickNotes />
                  <ContactList
                    contacts={contacts}
                    onLongPress={handleLongPress}
                    onFavPress={onFavPress}
                    onPinPress={onPinPress}
                  />
                </View>
              )}
              <Modal
                isVisible={isContactSettingModalVisible}
                onBackdropPress={handleCloseModal}
                backdropColor="rgba(0, 0, 0, 0.8)" // semi-transparent black
              >
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 5,
                    borderRadius: 5,
                    ...styles.shadow,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      delContact();
                      handleCloseModal();
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 5,
                      }}
                    >
                      <AntDesign name="delete" size={24} color="black" />
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: 16,
                          fontFamily: "WorkSans-Medium",
                          letterSpacing: -0.32,
                        }}
                      >
                        Delete
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          )}
          {/* When calendar tab is selected */}
          {activeTab === "calendar" && (
            <View style={{ flex: 1 }}>
              <CalendarTab />
            </View>
          )}
          {activeTab === "organisation" && (
            <View style={{ flex: 1 }}>
              <OrganisationTab />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
      {!isSearch && (
        <View style={{ position: "relative" }}>
          {!keyboardOpen && (
            <TouchableOpacity
              onPress={() => {
                track(EVENTS.BUTTON_TAPPED.NAME, {
                  [EVENTS.BUTTON_TAPPED.KEYS.BUTTON_NAME]: BUTTON_NAME.ASK,
                });
                navigation.navigate("AskScreen");
              }}
              style={{
                position: "absolute",
                top: -80, // Adjust this as needed
                right: 0, // Adjust this as needed
                alignItems: "flex-end",
              }}
            >
              <Image source={require("../../assets/chat.png")} />
            </TouchableOpacity>
          )}

          {currentNoteAdded && <NoteDone note={currentNoteAdded} />}
          <NewNoteContainerV2
            ref={noteRef}
            addNote={addNoteV2}
            contact={quickNoteRef}
            type={"contact"}
          />
        </View>
      )}
      <AddOrgModal
        visible={addOrgModalVisible}
        onClose={() => setAddOrgModalVisible(false)}
        onSubmit={() => {}}
      />
      <AddEventModal
        visible={addEventModalVisible}
        onClose={() => setAddEventModalVisible(false)}
        onSubmit={() => {}}
      />
    </View>
  );
};

const HomeScreen = ({ route }) => {
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={64}
      behavior="padding"
      style={{ flex: 1 }}
    >
      <CommonComponent />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  searchbar: {
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 15,
    marginTop: 5,
    marginBottom: 5,
    marginHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#00000014",
  },
});

export default HomeScreen;
