import "react-native-get-random-values";

import * as Sentry from "@sentry/react-native";

import { AUTH0CLIENTID, AUTH0DOMAIN } from "./config";

import { Auth0Provider } from "react-native-auth0";
import CodePushUpdater from "./src/components/common/CodePushUpdater";
import ErrorBoundary from "./src/components/ErrorBoundary";
import InitialWrapper from "./src/components/InitialWrapper";
import Navigation from "./src/navigation/Navigation";
import { Provider } from "react-redux";
import React from "react";
import { SafeAreaView } from "react-native";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { store } from "./src/redux/store";

if (!__DEV__) {
  Sentry.init({
    dsn: "https://51d64533c48bc61279988123bfa89475@o4507658136715264.ingest.us.sentry.io/4507658138353664",
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
    _experiments: {
      // profilesSampleRate is relative to tracesSampleRate.
      // Here, we'll capture profiles for 100% of transactions.
      profilesSampleRate: 1.0,
    },
  });
}

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Auth0Provider domain={AUTH0DOMAIN} clientId={AUTH0CLIENTID}>
        <Provider store={store}>
          <ErrorBoundary>
            <InitialWrapper>
              <Navigation />
              <Toast />
            </InitialWrapper>
          </ErrorBoundary>
          <CodePushUpdater />
        </Provider>
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
