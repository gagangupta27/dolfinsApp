import { AppDispatch, RootState } from "../../redux/store";
import { Button, FlatList, Text, View } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
// import TabView
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import {
  addCalendarEvent,
  useAllCalendarEvents,
} from "../../realm/queries/calendarEventOperations";
import { fetchCalendarEvents, fetchCalendars } from "../../redux/reducer/app";
import { useDispatch, useSelector } from "react-redux";

import Api from "../../utils/Api";
import CalendarItem from "./CalendarItem";
import { Dimensions } from "react-native";
import InAppBrowser from "react-native-inappbrowser-reborn";
import { Linking } from "react-native";
import Styles from "./CalendarTabStyle";
import { useRealm } from "@realm/react";

const url = Api.defaults.baseURL;

const LoginScreen = ({ calendar_type }: { calendar_type: string }) => {
  const authData = useSelector((state: RootState) => state.app.authData);

  const dispatch: AppDispatch = useDispatch();

  const handleLogin = async () => {
    const redirectUrl = "dolfins://home"; // Your app's URL scheme to handle the redirect
    const authUrl = `${url}/api/1.0/user/auth/${calendar_type}/?redirect_uri=${encodeURIComponent(
      redirectUrl
    )}&token=Bearer ${authData.idToken}`;
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.openAuth(authUrl, redirectUrl, {
          // Customization options
        });
        if (result.type === "success") {
          dispatch(fetchCalendars());
        }
      } else {
        Linking.openURL(authUrl);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button title={`Connect ${calendar_type} calendar`} onPress={handleLogin} />
  );
};

type RootStackParamList = {
  CalendarEventScreen: { event_id: string };
};

const initialLayout = { width: Dimensions.get("window").width };

const CalendarTab = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const realm = useRealm();
  const events = useAllCalendarEvents();

  const now = new Date();
  const pastEvents = events
    .filter((event) => new Date(event.eventEndTime) < now)
    .sort((a, b) => new Date(b.eventStartTime) - new Date(a.eventStartTime)); // Sort past events in descending order
  const futureEvents = events
    .filter((event) => new Date(event.eventStartTime) >= now)
    .sort((a, b) => new Date(a.eventStartTime) - new Date(b.eventStartTime)); // Sort future events in ascending order

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "future", title: "Upcoming Events" },
    { key: "past", title: "Past Events" },
  ]);

  const renderScene = SceneMap({
    future: () => (
      <FlatList
        data={futureEvents}
        renderItem={({ item }) =>
          CalendarItem({
            item,
            onPress: () =>
              navigation.navigate("CalendarEventScreen", {
                event_id: item._id.toHexString(),
              }),
          })
        }
        keyExtractor={(item) => item._id.toHexString()}
      />
    ),
    past: () => (
      <FlatList
        data={pastEvents}
        renderItem={({ item }) =>
          CalendarItem({
            item,
            onPress: () =>
              navigation.navigate("CalendarEventScreen", {
                event_id: item._id.toHexString(),
              }),
          })
        }
        keyExtractor={(item) => item._id.toHexString()}
      />
    ),
  });

  const dispatch: AppDispatch = useDispatch();

  const calendarEvents = useSelector(
    (state: RootState) => state.app.calendarEvents
  );
  const calendars = useSelector((state: RootState) => state.app.calendars);
  const lastSynced = useSelector(
    (state: RootState) => state.app.calendarLastSynced
  );
  const status = useSelector((state: RootState) => state.app.status);
  const error = useSelector((state: RootState) => state.app.error);

  const shouldFetchCalendarEvents = (lastSynced: number | null): boolean => {
    // return true;
    if (!lastSynced) return true;
    const now = Date.now();
    const twoMinutesAgo = now - 2 * 60 * 1000;
    return lastSynced < twoMinutesAgo;
  };

  useEffect(() => {
    dispatch(fetchCalendars());
  }, []);

  useEffect(() => {
    if (
      calendars &&
      (calendars.microsoft || calendars.google) &&
      shouldFetchCalendarEvents(lastSynced)
    ) {
      dispatch(fetchCalendarEvents());
    }
  }, [calendars]);

  useEffect(() => {
    if (calendarEvents && calendarEvents.length > 0) {
      calendarEvents.forEach((calendarEvent) => {
        addCalendarEvent(realm, {
          id: calendarEvent.id,
          calendarId: calendarEvent.calendar_id,
          calendarProviderEventId: calendarEvent.calendar_provider_event_id,
          title: calendarEvent.title,
          eventStartTime: calendarEvent.event_start_time,
          eventEndTime: calendarEvent.event_end_time,
          description: calendarEvent.description,
          attendees: calendarEvent.attendees,
          organizer: calendarEvent.organizer,
        });
      });
    }
  }, [calendarEvents]);

  const syncCalendar = async () => {
    dispatch(fetchCalendarEvents());
  };
  return (
    <View style={Styles.container}>
      {events.length > 0 && (
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              style={{ backgroundColor: "transparent" }} // Set the background color to transparent
              indicatorStyle={{ backgroundColor: "blue", height: 2 }} // Customize the underline color and height
              labelStyle={{ color: "black", fontWeight: "bold" }} // Set the text color to black and make it bold
            />
          )}
          tabBarPosition="bottom"
        />
      )}
      {/* {<Text>Hello {calendars} asds</Text>} */}
      {/* {calendars && calendars["google"] && calendars["microsoft"] && <Text>Calendars connected</Text>} */}
      {calendars && !calendars["google"] && (
        <LoginScreen calendar_type="google" />
      )}
      {calendars && !calendars["microsoft"] && (
        <LoginScreen calendar_type="microsoft" />
      )}
      {status == "failed" && error && <Text>{error}</Text>}
    </View>
  );
};

export default CalendarTab;
