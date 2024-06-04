import "react-native-get-random-values";

import {
  AUTH0CLIENTID,
  AUTH0DOMAIN,
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
} from "./config";

import Address from "./src/realm/models/ContactAddress";
import { Auth0Provider } from "react-native-auth0";
import CalendarEvent from "./src/realm/models/CalendarEvent";
import CalendarEventNoteMap from "./src/realm/models/CalendarEventNoteMap";
import Chat from "./src/realm/models/Chat";
import Contact from "./src/realm/models/Contact";
import ContactNoteMap from "./src/realm/models/ContactNoteMap";
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Navigation from "./src/navigation/Navigation";
import Note from "./src/realm/models/Note";
import { Provider } from "react-redux";
import React from "react";
import { RealmProvider } from "@realm/react";
import { SafeAreaView } from "react-native";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { store } from "./src/redux/store";

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Auth0Provider domain={AUTH0DOMAIN} clientId={AUTH0CLIENTID}>
        <RealmProvider
          schema={[
            CalendarEvent,
            Note,
            CalendarEventNoteMap,
            ContactNoteMap,
            Contact,
            Chat,
            Address,
          ]}
        >
          <Provider store={store}>
            <Navigation />
            <Toast />
          </Provider>
        </RealmProvider>
      </Auth0Provider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 24,
  },
  dateTime: {
    fontSize: 14,
    color: "gray",
  },
});

export default App;
