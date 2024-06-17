import { MIXPANEL_CLIENT_ID } from "../../config";
import { Mixpanel } from "mixpanel-react-native";
import { useRoute } from "@react-navigation/native";

export const GLOBAL_KEYS = {
  PAGE_NAME: "Page name",
  PAGE_IDENTIFIER: "Page identifier",
  MODAL_NAME: "Modal name",
  MODAL_IDENTIFIER: "Modal identifier",
  SELECTED: "Selected",
};

export const EVENTS = {
  LANDED_ON_PAGE: {
    NAME: "Landed on page",
    KEYS: {
      PAGE_CONTENT_COUNT: "Page content count",
    },
  },
  LANDED_ON_MODAL: {
    NAME: "Landed on modal",
    KEYS: {
      MODAL_CONTENT_COUNT: "Modal content count",
    },
  },
  BUTTON_TAPPED: {
    NAME: "Button tapped",
    KEYS: {
      BUTTON_NAME: "Button name",
      BUTTON_IDENTIFIER: "Button identifier",
    },
  },
  CARD_TAPPED: {
    NAME: "Card tapped",
    KEYS: {
      CARD_NAME: "Card name",
      CARD_IDENTIFIER: "Card identifier",
    },
  },
  INPUT_START: {
    NAME: "Input start",
    KEYS: {
      INPUT_NAME: "Input name",
      INPUT_IDENTIFIER: "Input identifier",
    },
  },
  INPUT_DONE: {
    NAME: "Input done",
    KEYS: {
      INPUT_NAME: "Input name",
      INPUT_IDENTIFIER: "Input identifier",
    },
  },
  LOADING_START: {
    NAME: "Loading start",
    KEYS: {
      TEXT_NAME: "Text name",
      TEXT_IDENTIFIER: "Text identifier",
    },
  },
  LOADING_DONE: {
    NAME: "Loading done",
    KEYS: {
      TEXT_NAME: "Text name",
      TEXT_IDENTIFIER: "Text identifier",
      TIME_TO_LOAD: "Time to load",
    },
  },
  START_LOGIN: {
    NAME: "Start login",
    KEYS: {
      LOGIN_TYPE: "Login type",
    },
  },
  LOGIN_SUBMIT: {
    NAME: "Login submit",
    KEYS: {
      LOGIN_TYPE: "Login type",
    },
  },
  LOGIN_FAILED: {
    NAME: "Login failed",
    KEYS: {
      LOGIN_TYPE: "Login type",
      REASON: "Reason",
    },
  },
  LOGIN_SUCCESS: {
    NAME: "Login success",
    KEYS: {
      LOGIN_TYPE: "Login type",
    },
  },
};

export const PAGE_NAME = {
  HOMEPAGE: "Homepage",
  LOGIN: "Login",
  ASK: "Ask",
  CONTACT: "Contact",
  WEBVIEW: "Webview",
  IMAGE_PREVIEW: "Image Preview",
  PDF_PREVIEW: "PDF Preview",
  ONBOARDING: "Onboarding",
  DOLFINS: "Dolfins",
};

export const MODAL_NAME = {
  ADD_CONTACT: "Add contact modal",
  ADD_CONTACT_MODAL: "Add contact modal",
  CREATE_NEW_CONTACT_MODAL: "Create new contact modal",
  CONNECT_DATA: "Connect data",
};

export const MODAL_IDENTIFIER_NAME = {
  LINKEDIN: "Linkedin",
};

export const BUTTON_NAME = {
  PROFILE: "Profile",
  ADD_NEW_CONTACT: "Add new contact",
  CONNECT_INTEL: "Connect Intel",
  RECORD_AUDIO: "Record Audio",
  ADD_IMAGE: "Add Image",
  ADD_FILE: "Add file",
  ADD_TEXT: "Add text",
  NEXT: "Next",
  BACK: "Back",
  CHANGE_NOTE: "Change note",
  EDIT_NOTE: "Edit note",
  DELETE_NOTE: "Delete note",
  CLOSE: "Close",
  DONE: "Done",
  ADD_LINKEDIN_URL: "Add Linkedin URL",
  ASK: "Ask",
  NEW_ASK: "New Ask",
  PREVIOUS_ASK: "Previous Ask",
  ASK_QUERY: "Ask query",
  RESPONSE_TO_QUERY: "Response to query",
  LIKE: "Like",
  DISLIKE: "Dislike",
  RELOAD: "Reload",
};

export const CARD_NAME = {
  NOTE_PAGE: "Note Page",
  QUESTION_SUGGESTION: "Question suggestion",
  PREVIOUS_ASK: "Previous Ask",
  SELECT_CONTACT: "Select contact",
  CREATE_NEW_CONTACT: "Create new contact",
};

export const INPUT_NAME = {
  RECORD_AUDIO: "Record Audio",
  ADD_IMAGE: "Add Image",
  ADD_FILE: "Add file",
  ADD_TEXT: "Add text",
  ASK_QUERY: "Ask query",
  RESPONSE_TO_QUERY: "Response to query",
};

export const LOADING_TEXT_NAME = {
  RESPONSE_TO_QUERY: "Response to query",
};

const trackAutomaticEvents = false;
const mixpanel = new Mixpanel(MIXPANEL_CLIENT_ID, trackAutomaticEvents);
mixpanel.init();

export const useTrackWithPageInfo = () => {
  const route = useRoute();

  const trackWithPageInfo = (eventName, properties = {}) => {
    const pageInfo = {
      [GLOBAL_KEYS.PAGE_NAME]: route?.name,
      [GLOBAL_KEYS.PAGE_IDENTIFIER]: route?.params?.contact?.name
        ? route?.params?.contact?.name
        : null,
    };

    mixpanel.track(eventName, { ...pageInfo, ...properties });
  };

  return trackWithPageInfo;
};

export const identify = (email, user) => {
  mixpanel.identify(email);
  Object.entries(user).forEach(([key, value]) => {
    mixpanel.getPeople().set(key, value);
  });
};
