import Svg, { Path } from "react-native-svg";
import { Text, View } from "react-native";
import {
  addNoteToCalendar,
  deleteNote,
  updateNote,
} from "../../realm/queries/noteOperations";
import { useObject, useQuery, useRealm } from "@realm/react";
import { useRef, useState } from "react";

import AddEventModal from "./AddEventModal";
import { AntDesign } from "@expo/vector-icons";
import { BSON } from "realm";
import CalendarEvent from "../../realm/models/CalendarEvent";
import CalendarEventNoteMap from "../../realm/models/CalendarEventNoteMap";
import Header from "../../components/common/Header";
import { KeyboardAvoidingView } from "react-native";
import NewNoteContainerV2 from "../../components/notecontainer/NewNoteContainerV2";
import Note from "../../realm/models/Note";
import NotesList from "../../components/notecontainer/NotesList";
import React from "react";
import { ScrollView } from "react-native";
import Styles from "./CalendarEventScreenStyle";
import { TouchableOpacity } from "react-native";

const CalendarEventScreen = ({ route }) => {
  const [editMode, setEditMode] = useState({ editMode: false, id: null });
  const [addEventModalVisible, setAddEventModalVisible] = useState(false);

  const event = useObject(
    CalendarEvent,
    new BSON.ObjectID(route?.params?.eventId)
  );
  const noteIds = useQuery(CalendarEventNoteMap)
    .filtered("calendarEventId == $0", event?._id)
    .map((o) => o?.noteId);

  const storedNotes = useQuery(Note)
    .filtered("_id IN $0", noteIds)
    .sorted([["isPinned", true]]);

  const realm = useRealm();

  const noteRef = useRef(null);
  const notesListRef = useRef(null);

  const addNoteV2 = async (
    content,
    mentions,
    imageData,
    audioUri,
    audioText,
    volumeLevels,
    document
  ) => {
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

    addNoteToCalendar(
      realm,
      new BSON.ObjectId(route?.params?.eventId),
      newNote
    );
  };

  const updateNoteV2 = async (
    noteId,
    content,
    mentions,
    imageData,
    audioUri,
    audioText,
    volumeLevels,
    document
  ) => {
    const updatedNote = {
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
      audioText: audioText || null,
      volumeLevels: volumeLevels || [],
      documentUri: document ? document.documentUri : null,
      documentName: document ? document.documentName : null,
    };
    updateNote(realm, noteId, updatedNote);
    setEditMode({ editMode: false, id: null });
  };

  const deleteNoteV2 = async (noteId) => {
    deleteNote(realm, noteId);
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={64}
      behavior={"padding"}
      style={{ flex: 1 }}
    >
      <View style={Styles.container}>
        <Header
          title={event?.title}
          rightIcons={() => (
            <TouchableOpacity
              style={[{ marginLeft: 8 }]}
              onPress={() => setAddEventModalVisible(true)}
            >
              <Svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M2.87601 18.1156C2.92195 17.7021 2.94493 17.4954 3.00748 17.3022C3.06298 17.1307 3.1414 16.9676 3.24061 16.8171C3.35242 16.6475 3.49952 16.5005 3.7937 16.2063L17 3C18.1046 1.89543 19.8954 1.89543 21 3C22.1046 4.10457 22.1046 5.89543 21 7L7.7937 20.2063C7.49951 20.5005 7.35242 20.6475 7.18286 20.7594C7.03242 20.8586 6.86926 20.937 6.69782 20.9925C6.50457 21.055 6.29783 21.078 5.88434 21.124L2.49997 21.5L2.87601 18.1156Z"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          )}
        />
        <View style={{ flex: 1 }}>
          <NotesList
            ref={notesListRef}
            ListHeaderComponent={() => (
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
                  <Text style={Styles.title}>{event?.title}</Text>
                  {event?.description && (
                    <View>
                      <Text style={{ paddingVertical: 5 }}>
                        {event?.description}
                      </Text>
                    </View>
                  )}
                  <Text style={Styles.time}>
                    {event?.eventStartTime.toDateString()} -{" "}
                    {event?.eventEndTime.toDateString()}
                  </Text>
                  {event?.attendees && event?.attendees.length > 0 && (
                    <View style={{ paddingTop: 10 }}>
                      <Text
                        style={{
                          textDecorationLine: "underline",
                          fontSize: 16,
                        }}
                      >
                        Attendees
                      </Text>
                      <View style={{ maxHeight: 200, paddingVertical: 5 }}>
                        <ScrollView>
                          {event?.attendees?.map((attendee, index) => (
                            <Text key={index}>{attendee?.contact?.name}</Text>
                          ))}
                        </ScrollView>
                      </View>
                    </View>
                  )}
                  {event?.organizer && (
                    <View style={{ paddingTop: 10 }}>
                      <Text
                        style={{
                          textDecorationLine: "underline",
                          fontSize: 16,
                        }}
                      >
                        Organizer
                      </Text>
                      <Text style={{ paddingVertical: 5 }}>
                        {event?.organizer?.contact?.name || ""}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
            notes={
              storedNotes && storedNotes?.length > 0 && storedNotes?.[0]
                ? [...storedNotes]
                : []
            }
            setEditMode={setEditMode}
            contact={{}}
            onDelete={deleteNoteV2}
          />
        </View>
        <NewNoteContainerV2
          ref={noteRef}
          addNote={addNoteV2}
          note={editMode.editMode && editMode?.note}
          updateNote={updateNoteV2}
          type={"event"}
        />
        <AddEventModal
          visible={addEventModalVisible}
          onClose={() => setAddEventModalVisible(false)}
          onSubmit={() => {}}
          existingId={event?._id}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CalendarEventScreen;
