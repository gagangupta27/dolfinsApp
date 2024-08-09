import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CalendarProvider,
  CalendarUtils,
  ExpandableCalendar,
  TimelineList,
} from "react-native-calendars";
import React, { useEffect, useState } from "react";
import { useQuery, useRealm } from "@realm/react";

import CalendarEvent from "../../realm/models/CalendarEvent";
import filter from "lodash/filter";
import find from "lodash/find";
import groupBy from "lodash/groupBy";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

const EVENT_COLOR = "#e6add8";
const today = new Date();
export const getDate = (offset = 0) =>
  CalendarUtils.getCalendarDateString(
    new Date().setDate(today.getDate() + offset)
  );

const INITIAL_TIME = { hour: 9, minutes: 0 };

const CalendarTab = () => {
  const AllEvents = useQuery(CalendarEvent).sorted("eventStartTime");
  const [currentDate, setCurrentDate] = useState(getDate());
  const [eventsByDate, setEventsByDate] = useState([]);

  const navigation = useNavigation();

  const realm = useRealm();

  useEffect(() => {
    if (AllEvents) {
      setEventsByDate(
        groupBy(
          AllEvents.map((o) => ({
            start: moment(o.eventStartTime).format("YYYY-MM-DD hh:mm:ss"),
            end: moment(o.eventEndTime).format("YYYY-MM-DD hh:mm:ss"),
            title: o?.title,
            summary: o?.description,
            color: EVENT_COLOR,
            eventId: o?._id,
          })),
          (e) => CalendarUtils.getCalendarDateString(e.start)
        )
      );
    }
  }, [JSON.stringify(AllEvents)]);

  const renderEvent = (data) => {
    console.log("data", data);
    return (
      <View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          {data?.title}
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "400",
          }}
        >
          {data?.title}
        </Text>
        <Text>{`${moment(data?.start).format("llll")} - ${moment(
          data?.end
        ).format("llll")}`}</Text>
      </View>
    );
  };

  return (
    <CalendarProvider
      date={currentDate}
      onDateChanged={(date, source) => {
        setCurrentDate(date);
      }}
      onMonthChange={() => {}}
      // showTodayButton
      disabledOpacity={0.6}
      // numberOfDays={3}
    >
      <ExpandableCalendar
        firstDay={1}
        leftArrowImageSource={require("../../assets/previous.png")}
        rightArrowImageSource={require("../../assets/next.png")}
        markedDates={[]}
      />
      <TimelineList
        events={eventsByDate}
        timelineProps={{
          renderEvent: renderEvent,
          format24h: false,
          onEventPress: (data) => {
            navigation.navigate("CalendarEventScreen", {
              eventId: data?.eventId,
            });
          },
          onBackgroundLongPress: () => {},
          onBackgroundLongPressOut: () => {},
          // scrollToFirst: true,
          // start: 0,
          // end: 24,
          // unavailableHours: [
          //   { start: 0, end: 6 },
          //   { start: 22, end: 24 },
          // ],
          overlapEventsSpacing: 8,
          rightEdgeSpacing: 24,
        }}
        showNowIndicator
        scrollToNow
        scrollToFirst
        initialTime={INITIAL_TIME}
      />
    </CalendarProvider>
  );
};

export default CalendarTab;

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  customDay: {
    margin: 10,
    fontSize: 24,
    color: "green",
  },
  dayItem: {
    marginLeft: 34,
  },
});
