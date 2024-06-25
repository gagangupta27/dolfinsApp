import React from "react";
import { BSON } from "realm";
import { View, Text } from "react-native";
import Styles from "./CalendarEventScreenStyle";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { KeyboardAvoidingView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { useRef, useState, useEffect } from "react";
import NotesList from "../../components/notecontainer/NotesList";
import {
  useCalendarNotes,
  addNoteToCalendar,
  updateNote,
  deleteNote,
} from "../../realm/queries/noteOperations";
import { useCalendarEvent } from "../../realm/queries/calendarEventOperations";
import { useQuery, useRealm } from "@realm/react";
import RenderHtml from "react-native-render-html"; // Import RenderHtml
import { Dimensions } from "react-native";
import { ScrollView } from "react-native";
import Contact from "../../realm/models/Contact";
import NewNoteContainerV2 from "../../components/notecontainer/NewNoteContainerV2";

const contact = { id: -5, name: "Calendar" };

const NavigationBar = ({ event }) => {
  const navigation = useNavigation();
  return (
    <View style={Styles.navBar}>
      <TouchableOpacity
        style={Styles.iconButton}
        onPress={() => {
          if (navigation.canGoBack()) navigation.goBack();
        }}
      >
        <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
      </TouchableOpacity>
      <Text style={Styles.navTitle}>{event.title}</Text>
    </View>
  );
};

const CalendarEventScreen = ({ route }) => {
  const params = route.params;
  const realm = useRealm(); // Get the realm instance
  const [forceUpdate, setForceUpdate] = useState(0);

  const event_id = new BSON.ObjectId(params.event_id);
  const noteRef = useRef(null);
  const notesListRef = useRef(null);

  const [editMode, setEditMode] = useState({ editMode: false, id: null });

  const event = useCalendarEvent(event_id)[0];
  const notes = useCalendarNotes(realm, event_id);
  const allContacts = useQuery(Contact);

  const filteredNotes = notes.filter((n) => n._id.equals(editMode.id));
  const firstNote = filteredNotes.length > 0 ? filteredNotes[0] : null;

  const addNoteV2 = async (
    content,
    mentions,
    imageUri,
    audioUri,
    volumeLevels,
    document
  ) => {
    // if (!mentions.some((mention) => mention.contactId === contact.id)) {
    //     mentions.push({contactId:contact.id, name: contact.name});
    // }
    const newNote = {
      content: content,
      mentions: mentions, // Assuming mentions is an array of ids
      type: imageUri
        ? "image"
        : audioUri
        ? "audio"
        : document
        ? "document"
        : "text",
      imageUri: imageUri || null,
      audioUri: audioUri || null,
      volumeLevels: volumeLevels || [],
      documentUri: document ? document.documentUri : null,
      documentName: document ? document.documentName : null,
    };

    addNoteToCalendar(realm, event_id, newNote);
    setForceUpdate(new Date().getTime());
  };

  const updateNoteV2 = async (
    noteId,
    content,
    mentions,
    imageUri,
    audioUri,
    volumeLevels,
    document
  ) => {
    // if (!mentions.some((mention) => mention.contactId === contact.id)) {
    //     mentions.push({contactId:contact.id, name: contact.name});
    // }
    const updatedNote = {
      content: content,
      mentions: mentions, // Assuming mentions is an array of ids
      type: imageUri
        ? "image"
        : audioUri
        ? "audio"
        : document
        ? "document"
        : "text",
      imageUri: imageUri || null,
      audioUri: audioUri || null,
      volumeLevels: volumeLevels || [],
      documentUri: document ? document.documentUri : null,
      documentName: document ? document.documentName : null,
    };
    updateNote(realm, noteId, updatedNote);
    setEditMode({ editMode: false, id: null });
    setForceUpdate(new Date().getTime());
  };

  const deleteNoteV2 = async (noteId) => {
    deleteNote(realm, noteId);
    setForceUpdate(new Date().getTime());
  };

  const [isDescriptionVisible, setDescriptionVisible] = useState(false); // State for description visibility

  // Toggle visibility for description
  const toggleDescriptionVisibility = () => {
    setDescriptionVisible(!isDescriptionVisible);
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={64}
      behavior={"padding"}
      style={{ flex: 1 }}
    >
      <View style={Styles.container}>
        <NavigationBar event={event} />
        <View style={{ flex: 1 }}>
          <View style={Styles.box}>
            <View style={Styles.title}>
              <AntDesign
                style={Styles.calendarIcon}
                name="calendar"
                size={24}
                color="black"
              />
            </View>
            <View>
              <Text style={Styles.title}>{event.title}</Text>
              <Text style={Styles.time}>
                {event?.eventStartTime.toDateString()} -{" "}
                {event?.eventEndTime.toDateString()}
              </Text>
              {event?.attendees && event.attendees.length > 0 && (
                <View style={{ paddingTop: 10 }}>
                  <Text
                    style={{ textDecorationLine: "underline", fontSize: 16 }}
                  >
                    Attendees
                  </Text>
                  <View style={{ maxHeight: 200, paddingVertical: 5 }}>
                    <ScrollView>
                      {event.attendees.map((attendee, index) => (
                        <Text key={index}>{attendee}</Text>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              )}
              {event?.organizer && (
                <View style={{ paddingTop: 10 }}>
                  <Text
                    style={{ textDecorationLine: "underline", fontSize: 16 }}
                  >
                    Organizer
                  </Text>
                  <Text style={{ paddingVertical: 5 }}>{event.organizer}</Text>
                </View>
              )}
              {event?.description && (
                <View>
                  <ScrollView style={{ maxHeight: 200 }}>
                    {isDescriptionVisible && (
                      <RenderHtml
                        contentWidth={Dimensions.get("window").width} // Adjusted to use Dimensions API
                        source={{ html: event.description }}
                      />
                    )}
                  </ScrollView>
                  <TouchableOpacity onPress={toggleDescriptionVisibility}>
                    {isDescriptionVisible && (
                      <Text
                        style={{
                          paddingTop: 4,
                          textDecorationLine: "underline",
                        }}
                      >
                        Hide Description
                      </Text>
                    )}
                    {!isDescriptionVisible && (
                      <Text
                        style={{
                          paddingTop: 4,
                          textDecorationLine: "underline",
                        }}
                      >
                        Show Description
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <NotesList
              ref={notesListRef}
              notes={notes}
              setEditMode={setEditMode}
              contact={contact}
              onDelete={deleteNoteV2}
            />
          </View>
        </View>
        <NewNoteContainerV2
          ref={noteRef}
          mentions={allContacts}
          addNote={addNoteV2}
          contact={contact}
          note={editMode.id && firstNote}
          updateNote={updateNoteV2}
          type={"contact"}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CalendarEventScreen;
