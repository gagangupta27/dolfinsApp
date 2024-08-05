import Realm, { BSON } from "realm";

import CalendarEvent from "../models/CalendarEvent";
import Contact from "../models/Contact";
import Mentions from "../models/Mentions";
import Organisation from "../models/Organisation";
import { useQuery } from "@realm/react";

async function addCalendarEvent(
  realm: Realm,
  eventData: {
    calendarId: number;
    calendarProviderEventId: string;
    title: string;
    eventStartTime: Date;
    eventEndTime: Date;
    description: string;
    attendees: Mentions[];
    organizer: Mentions;
    location: string;
    meetLinkUrl: string;
    eventDate: Date;
  }
) {
  let createdEvent;
  realm.write(() => {
    createdEvent = realm.create("CalendarEvent", {
      _id: new BSON.ObjectId(),
      calendarId: eventData.calendarId,
      calendarProviderEventId: eventData.calendarProviderEventId,
      title: eventData.title,
      eventStartTime: eventData.eventStartTime,
      eventEndTime: eventData.eventEndTime,
      description: eventData.description,
      attendees: eventData?.attendees
        ? eventData.attendees?.map((o) => ({
            _id: new BSON.ObjectId(),
            ...(o?.contact
              ? { contact: realm.objectForPrimaryKey(Contact, o?.contact?._id) }
              : {
                  organisation: realm.objectForPrimaryKey(
                    Organisation,
                    o?.organisation?._id
                  ),
                }),
          }))
        : [],
      organizer: eventData?.organizer
        ? {
            _id: new BSON.ObjectId(),
            ...(eventData.organizer?.contact
              ? {
                  contact: realm.objectForPrimaryKey(
                    Contact,
                    eventData.organizer?.contact?._id
                  ),
                }
              : {
                  organisation: realm.objectForPrimaryKey(
                    Organisation,
                    eventData.organizer?.organisation?._id
                  ),
                }),
          }
        : [],
      createdAt: new Date(),
      updatedAt: new Date(),
      eventDate: eventData?.eventDate,
      location: eventData?.location,
      meetLinkUrl: eventData?.meetLinkUrl || "",
    });
  });
  return createdEvent;
}

function updateCalendarEvent(
  realm: Realm,
  eventId: BSON.ObjectId,
  updates: Partial<{
    calendarId: number;
    calendarProviderEventId: string;
    title: string;
    eventStartTime: Date;
    eventEndTime: Date;
    description: string;
    attendees: Mentions[];
    organizer: Mentions;
    createdAt: Date;
    updatedAt: Date;
    location: string;
    meetLinkUrl: string;
    eventDate: Date;
  }>
) {
  realm.write(() => {
    let event = realm.objectForPrimaryKey("CalendarEvent", eventId);
    if (event) {
      // gagan work here
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
  useAllCalendarEvents,
  useCalendarEvent,
  useFutureCalendarEvents,
  usePastCalendarEvents,
  useRecentCalendarEvents,
};
