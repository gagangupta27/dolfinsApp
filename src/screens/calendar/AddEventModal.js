import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useObject, useQuery, useRealm } from "@realm/react";

import Accordion from "../../components/common/Accordian";
import { Calendar } from "react-native-calendars";
import CalendarEvent from "../../realm/models/CalendarEvent";
import Contact from "../../realm/models/Contact";
import DatePicker from "react-native-date-picker";
import Dropdown from "../../components/common/DropDown";
import ExactTextBox from "../../components/notecontainer/ExactTextBox";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { addCalendarEvent } from "../../realm/queries/calendarEventOperations";
import { addOrganisation } from "../../realm/queries/organisationOperations";
import moment from "moment";

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};

const AddEventModal = ({
  visible = false,
  onClose = () => {},
  onSubmit = () => {},
  existingId = null,
  Modaltitle = "Create New Event",
}) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [organizer, setOrganizer] = useState();
  const [location, setLocation] = useState();
  const [meetLinkUrl, setMeetLinkUrl] = useState("");
  const [openStartTime, setOpenStartModal] = useState(false);
  const [date, setDate] = useState();
  const [openEndTime, setOpenEndModal] = useState(false);

  const realm = useRealm();
  const existingEvent = existingId
    ? useObject(CalendarEvent, existingId)
    : null;

  const allContacts = useQuery(Contact);

  const _dropDownRef = useRef();

  useEffect(() => {
    if (existingEvent) {
      setTitle(existingEvent?.title);
      setDesc(existingEvent?.desc || "");
    }
  }, [existingEvent]);

  //   useEffect(() => {
  //     if (existingContacts && existingContacts?.length > 0) {
  //       setContacts([...existingContacts]);
  //     }
  //   }, [JSON.stringify(existingContacts)]);

  const onCreate = async () => {
    if (existingId) {
      realm.write(() => {
        existingEvent.title = title;
        existingEvent.desc = desc;
      });
    } else {
      if (title?.trim()?.length == 0) {
        Alert.alert("Error", "Please Enter Event Title!");
        return;
      }
      if (desc?.trim()?.length == 0) {
        Alert.alert("Error", "Please Enter Event Description!");
        return;
      }
      if (attendees?.length == 0) {
        Alert.alert("Error", "Please Enter Event Attendees!");
        return;
      }
      if (!organizer) {
        Alert.alert("Error", "Please Enter Event Organizer!");
        return;
      }
      if (!startTime) {
        Alert.alert("Error", "Please Enter Event Start Time!");
        return;
      }
      if (!endTime) {
        Alert.alert("Error", "Please Enter Event End time!");
        return;
      }
      if (!date) {
        Alert.alert("Error", "Please Enter Event Date!");
        return;
      }
      const createdEvent = await addCalendarEvent(realm, {
        calendarId: 0,
        calendarProviderEventId: "",
        title: title,
        eventStartTime: startTime,
        eventEndTime: endTime,
        description: desc,
        attendees: attendees?.map((o) => ({ contact: o })),
        organizer: { contact: organizer },
        location: "",
        meetLinkUrl: meetLinkUrl,
        eventDate: new Date(date),
      });

      if (createdEvent) {
        Alert.alert("Success", "Event Created");
      }
    }
    onClose();
    setTitle("");
    setDesc("");
    setAttendees([]);
    setOrganizer();
    setMeetLinkUrl("");
    setDate();
    setStartTime();
    setEndTime();
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
        contentContainerStyle={{
          paddingBottom: 200,
        }}
        style={styles.container}
      >
        <TouchableOpacity activeOpacity={1}>
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
            <Text style={styles.createtext}>{Modaltitle}</Text>
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
                content={title}
                setContent={setTitle}
                placeholder="Title*"
              />
            </View>
            <View style={{ height: 50, marginVertical: 10 }}>
              <ExactTextBox
                content={desc}
                setContent={setDesc}
                placeholder="Description*"
              />
            </View>
            <View style={{ height: 50, marginVertical: 10 }}>
              <ExactTextBox
                content={meetLinkUrl}
                setContent={setMeetLinkUrl}
                placeholder="Meet Link*"
              />
            </View>
            <Accordion viewKey="qwerty" isExpanded={true} enterFrom="top">
              <View
                style={{
                  width: "100%",
                }}
              >
                <Calendar
                  onDayPress={(day) => {
                    setDate(day?.timestamp);
                  }}
                  current={moment().format("YYYY-MM-DD")}
                  style={{
                    backgroundColor: "#F7F7F7",
                    borderRadius: 8,
                    marginTop: 20,
                  }}
                  minDate={moment().format("YYYY-MM-DD")}
                  maxDate={moment().add(5, "months").format("YYYY-MM-DD")}
                  markingType={"custom"}
                  markedDates={{
                    [moment().format("YYYY-MM-DD")]: {
                      customStyles: {
                        container: {
                          borderWidth: 1,
                          borderRadius: 100,
                          borderColor: "#00000029",
                        },
                      },
                    },
                    [moment(date).format("YYYY-MM-DD")]: {
                      customStyles: {
                        container: {
                          backgroundColor: "#212427",
                          borderRadius: 100,
                          elevation: 2,
                        },
                        text: {
                          color: "#FFFFFF",
                        },
                      },
                    },
                  }}
                  theme={{
                    backgroundColor: "#F7F7F7",
                    calendarBackground: "#F7F7F7",
                    textSectionTitleColor: "#212427",
                    selectedDayBackgroundColor: "#212427",
                    selectedDayTextColor: "#FFFFFF",
                    todayTextColor: "#212427",
                    dayTextColor: "#212427",
                  }}
                />
              </View>
            </Accordion>
            <View style={{ minHeight: 50, marginVertical: 10, zIndex: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 10,
                  paddingBottom: 10,
                }}
              >
                {Array.isArray(attendees) &&
                  attendees?.map((o) => (
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
                          setAttendees((prev) =>
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
                    Array.isArray(attendees) &&
                    !attendees?.find((o) => String(o._id) == String(option._id))
                  ) {
                    setAttendees([...attendees, option]);
                  }
                  _dropDownRef?.current?.onRefresh();
                }}
                ref={_dropDownRef}
                placeholder="Search Attendees"
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
                {organizer && (
                  <View
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
                    <Text>{organizer?.name}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setOrganizer();
                      }}
                      style={{
                        paddingLeft: 10,
                      }}
                    >
                      <Text>X</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <Dropdown
                options={allContacts}
                onOptionSelected={(option) => {
                  setOrganizer(option);
                  _dropDownRef?.current?.onRefresh();
                }}
                ref={_dropDownRef}
                placeholder="Organizer"
              />
            </View>
            <DatePicker
              modal={true}
              open={openStartTime}
              date={startTime ? startTime : new Date()}
              onDateChange={() => {}}
              onConfirm={(data) => {
                setStartTime(data);
                setEndTime();
                setOpenStartModal(false);
                setOpenEndModal(true);
              }}
              title="Set Start Time"
              onCancel={() => {
                setOpenStartModal(false);
              }}
              mode="time"
            />
            <DatePicker
              modal={true}
              open={openEndTime}
              date={endTime ? endTime : new Date()}
              minimumDate={startTime ? startTime : new Date().addHours(1)}
              title="Set End Time"
              onDateChange={() => {}}
              onConfirm={(data) => {
                setEndTime(data);
                setOpenEndModal(false);
              }}
              onCancel={() => {
                setOpenEndModal(false);
              }}
              mode="time"
            />
            <View style={{}}>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  padding: 16,
                  minHeight: 56,
                  fontSize: 15,
                  borderRadius: 8,
                  marginTop: 20,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                activeOpacity={0.8}
                onPress={() => {
                  setOpenStartModal(true);
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setOpenStartModal(true);
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      lineHeight: 24,
                    }}
                  >
                    {startTime
                      ? moment(startTime).format("hh:mm a")
                      : "Set Start "}
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 15,
                    lineHeight: 24,
                  }}
                >
                  {startTime || endTime ? " - " : "and "}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setOpenEndModal(true);
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      lineHeight: 24,
                    }}
                  >
                    {endTime ? moment(endTime).format("hh:mm a") : "End Time"}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
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
export default AddEventModal;
