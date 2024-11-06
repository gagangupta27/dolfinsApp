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
                                organisation: realm.objectForPrimaryKey(Organisation, o?.organisation?._id),
                            }),
                  }))
                : [],
            organizer: eventData?.organizer
                ? {
                      _id: new BSON.ObjectId(),
                      ...(eventData.organizer?.contact
                          ? {
                                contact: realm.objectForPrimaryKey(Contact, eventData.organizer?.contact?._id),
                            }
                          : {
                                organisation: realm.objectForPrimaryKey(
                                    Organisation,
                                    eventData.organizer?.organisation?._id
                                ),
                            }),
                  }
                : null,
            createdAt: new Date(),
            updatedAt: new Date(),
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
    const futureEvents = useQuery(CalendarEvent).filtered("eventStartTime > $0", now);
    return futureEvents;
};

const usePastCalendarEvents = () => {
    const now = new Date();
    const futureEvents = useQuery(CalendarEvent).filtered("eventEndTime < $0", now);
    return futureEvents;
};

const useCalendarEvent = (event_id) => {
    const event = useQuery(CalendarEvent).filtered("_id == $0", event_id);
    return event;
};

async function getRawEvents(realm: Realm) {
    let eventJSON = [];
    try {
        realm.write(() => {
            const events = realm
                .objects(CalendarEvent)
                .filtered("_id != $0", new BSON.ObjectId("000000000000000000000000"));
            if (events && events?.length > 0) {
                eventJSON = [
                    ...events.map((o) => ({
                        ...o,
                        attendees: o?.attendees?.map((m) => ({
                            _id: m?._id,
                            contactId: m?.contact?._id,
                            organisationId: m?.organisation?._id,
                        })),
                        organizer: {
                            _id: o?.organizer?._id,
                            contactId: o?.organizer?.contact?._id,
                            organisationId: o?.organizer?.organisation?._id,
                        },
                    })),
                ];
            } else {
                eventJSON = [];
            }
        });
    } catch (err) {
        console.log("err getRawEvents", err);
        eventJSON = [];
    }
    return eventJSON;
}

async function getEventNoteMap(realm: Realm) {
    let eventJSON = [];
    try {
        realm.write(() => {
            const maps = realm.objects("CalendarEventNoteMap");
            if (maps && maps?.length > 0) {
                eventJSON = [...maps];
            } else {
                eventJSON = [];
            }
        });
    } catch (err) {
        console.log("err getEventNoteMap", err);
        eventJSON = [];
    }
    return eventJSON;
}

async function importEvents(
    realm: Realm,
    events: {
        _id: BSON.ObjectId;
        calendarId: number;
        calendarProviderEventId: string;
        title: string;
        eventStartTime: Date;
        eventEndTime: Date;
        description: string;
        attendees: {
            _id: BSON.ObjectId;
            contactId: BSON.ObjectId;
            organisationId: BSON.ObjectId;
        }[];
        organizer: {
            _id: BSON.ObjectId;
            contactId: BSON.ObjectId;
            organisationId: BSON.ObjectId;
        };
        createdAt: Date;
        updatedAt: Date;
        location: string;
        meetLinkUrl: string;
    }[]
) {
    realm.write(() => {
        for (const event of events) {
            try {
                // Check if the event already exists
                const existingEvent = realm.objectForPrimaryKey("CalendarEvent", new BSON.ObjectId(event._id));
                if (!existingEvent) {
                    realm.create("CalendarEvent", {
                        _id: new BSON.ObjectId(event?._id),
                        attendees: event?.attendees
                            ? event.attendees?.map((o) => ({
                                  _id: new BSON.ObjectId(o?._id),
                                  ...(o?.contactId
                                      ? {
                                            contact: realm.objectForPrimaryKey(
                                                Contact,
                                                new BSON.ObjectId(o?.contactId)
                                            ),
                                        }
                                      : {
                                            organisation: realm.objectForPrimaryKey(
                                                Organisation,
                                                new BSON.ObjectId(o?.organisationId)
                                            ),
                                        }),
                              }))
                            : [],
                        organizer: event?.organizer
                            ? {
                                  _id: new BSON.ObjectId(event?.organizer?._id),
                                  ...(event?.organizer?.contactId
                                      ? {
                                            contact: realm.objectForPrimaryKey(
                                                Contact,
                                                new BSON.ObjectId(event?.organizer?.contactId)
                                            ),
                                        }
                                      : {
                                            organisation: realm.objectForPrimaryKey(
                                                Organisation,
                                                new BSON.ObjectId(event?.organizer?.organisationId)
                                            ),
                                        }),
                              }
                            : {},
                        createdAt: event.createdAt,
                        updatedAt: event.updatedAt,
                        calendarId: event.calendarId,
                        calendarProviderEventId: event.calendarProviderEventId,
                        title: event.title,
                        eventStartTime: event.eventStartTime,
                        eventEndTime: event.eventEndTime,
                        description: event.description,
                        location: event.location,
                        meetLinkUrl: event.meetLinkUrl,
                    });
                } else {
                    console.log(`Event with ID ${event._id} already exists.`);
                }
            } catch (err) {
                console.log("err", err);
            }
        }
    });

    return;
}

async function importCalendarEventNoteMap(
    realm: Realm,
    maps: {
        _id: BSON.ObjectId;
        calendarEventId: BSON.ObjectId;
        noteId: BSON.ObjectId;
        createdAt: Date;
        updatedAt: Date;
    }[]
) {
    realm.write(() => {
        for (const ENMap of maps) {
            try {
                // Check if the entry already exists
                const existingMap = realm.objectForPrimaryKey("CalendarEventNoteMap", new BSON.ObjectId(ENMap._id));
                if (!existingMap) {
                    realm.create("CalendarEventNoteMap", {
                        _id: new BSON.ObjectId(ENMap?._id),
                        calendarEventId: new BSON.ObjectId(ENMap.calendarEventId),
                        noteId: new BSON.ObjectId(ENMap.noteId),
                        createdAt: ENMap.createdAt,
                        updatedAt: ENMap.updatedAt,
                    });
                } else {
                    console.log(`CalendarEventNoteMap with ID ${ENMap._id} already exists.`);
                }
            } catch (err) {
                console.log("err", err);
            }
        }
    });
    return;
}

export {
    addCalendarEvent,
    updateCalendarEvent,
    useAllCalendarEvents,
    useCalendarEvent,
    useFutureCalendarEvents,
    usePastCalendarEvents,
    useRecentCalendarEvents,
    getRawEvents,
    getEventNoteMap,
    importEvents,
    importCalendarEventNoteMap,
};
