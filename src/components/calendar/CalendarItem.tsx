import { Text, TouchableOpacity, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import React from "react";
import Styles from "./CalendarTabStyle";

const CalendarItem = ({ item, onPress }) => {
  const formatDate = (date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const eventDate = new Date(date);
    const eventDay = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate()
    );

    if (eventDay.getTime() === today.getTime()) {
      return "Today";
    } else if (eventDay.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else {
      return eventDate.toLocaleDateString();
    }
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const startTime = new Date(item.eventStartTime);
  const endTime = new Date(item.eventEndTime);
  const isSameDay = startTime.toDateString() === endTime.toDateString();
  let dateTimeString;

  if (isSameDay) {
    dateTimeString = `${formatDate(item.eventStartTime)}, ${formatTime(
      item.eventStartTime
    )} - ${formatTime(item.eventEndTime)}`;
  } else {
    dateTimeString = `${formatDate(item.eventStartTime)} ${formatTime(
      item.eventStartTime
    )} - ${formatDate(item.eventEndTime)} ${formatTime(item.eventEndTime)}`;
  }

  return (
    <View>
      <TouchableOpacity onPress={onPress} style={Styles.item}>
        <AntDesign
          style={Styles.calendarIcon}
          name="calendar"
          size={24}
          color="black"
        />
        <View>
          <Text style={Styles.title}>{item.title}</Text>
          <Text style={Styles.time}>{dateTimeString}</Text>
          {item?.organizer && (
            <Text style={Styles.time}>
              Organizer: {item?.organizer?.contact?.name?.slice(0, 40) || ""}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CalendarItem;
