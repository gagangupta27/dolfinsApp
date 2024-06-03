import { useQuery } from "@realm/react";
import Realm, { BSON } from "realm";
import CalendarEvent from "../models/CalendarEvent";

function addCalendarEvent(
  realm: Realm,
  eventData: {
    id: number;
    calendarId: number;
    calendarProviderEventId: string;
    title: string;
    eventStartTime: Date;
    eventEndTime: Date;
    description: string;
    attendees: string[];
    organizer: string;
  }
) {
  realm.write(() => {
    const existingEvents = realm
      .objects("CalendarEvent")
      .filtered("id == $0", eventData.id);
    if (existingEvents.length == 0) {
      realm.create("CalendarEvent", {
        _id: new BSON.ObjectId(),
        id: eventData.id,
        calendarId: eventData.calendarId,
        calendarProviderEventId: eventData.calendarProviderEventId,
        title: eventData.title,
        eventStartTime: eventData.eventStartTime,
        eventEndTime: eventData.eventEndTime,
        description: eventData.description,
        attendees: eventData.attendees,
        organizer: eventData.organizer,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      if (existingEvents[0].title != eventData.title)
        existingEvents[0].title = eventData.title;
      if (existingEvents[0].eventStartTime != eventData.eventStartTime)
        existingEvents[0].eventStartTime = eventData.eventStartTime;
      if (existingEvents[0].eventEndTime != eventData.eventEndTime)
        existingEvents[0].eventEndTime = eventData.eventEndTime;
      if (existingEvents[0].description != eventData.description)
        existingEvents[0].description = eventData.description;
      if (existingEvents[0].attendees != eventData.attendees)
        existingEvents[0].attendees = eventData.attendees;
      if (existingEvents[0].organizer != eventData.organizer)
        existingEvents[0].organizer = eventData.organizer;
      existingEvents[0].updatedAt = new Date();
    }
  });
}

function updateCalendarEvent(
  realm: Realm,
  eventId: BSON.ObjectId,
  updates: Partial<{
    calendarId: string;
    calendarProviderEventId: string;
    title: string;
    eventStartTime: Date;
    eventEndTime: Date;
    description: string;
    attendees: string[];
    organizer: string;
    createdAt: Date;
    updatedAt: Date;
  }>
) {
  realm.write(() => {
    let event = realm.objectForPrimaryKey("CalendarEvent", eventId);
    if (event) {
      // event.
      // To be updated
      event.updatedAt = new Date();
    }
  });
}

const useAllCalendarEvents = () => {
  const events = useQuery(CalendarEvent);
  return events;
};

const useRecentCalendarEvents = () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

  const events = useQuery(CalendarEvent).filtered(
    "eventStartTime >= $0 AND eventStartTime <= $1",
    oneWeekAgo,
    oneWeekFromNow
  );
  return events;
};

const useFutureCalendarEvents = () => {
  const now = new Date();
  const futureEvents = useQuery(CalendarEvent).filtered(
    "eventStartTime > $0",
    now
  );
  return futureEvents;
};

const usePastCalendarEvents = () => {
  const now = new Date();
  const futureEvents = useQuery(CalendarEvent).filtered(
    "eventEndTime < $0",
    now
  );
  return futureEvents;
};

const useCalendarEvent = (event_id) => {
  const event = useQuery(CalendarEvent).filtered("_id == $0", event_id);
  return event;
};

export {
  addCalendarEvent,
  updateCalendarEvent,
  useAllCalendarEvents, useCalendarEvent, useFutureCalendarEvents,
  usePastCalendarEvents, useRecentCalendarEvents
};

