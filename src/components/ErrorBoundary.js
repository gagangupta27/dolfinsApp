import * as Sentry from "@sentry/react-native";

import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Buttons from "./Buttons/Buttons";
import CodePush from "react-native-code-push";

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error, info) => {
      // You can log the error to an error reporting service here
      console.error("Error Boundary Caught an Error:", error, info);
      Sentry.captureException({ error, info }, "Dispatch err");
      setHasError(true);
    };

    // Set up error handling
    const errorListener = ErrorUtils.setGlobalHandler(errorHandler);

    return () => {
      // Clean up error handler
      ErrorUtils.setGlobalHandler(null);
      // Remove error listener
      errorListener?.remove();
    };
  }, []);

  if (hasError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Something went wrong!</Text>
        <Text>We will be sure to fix it soon!</Text>
        <Buttons
          text="Relaunch App"
          containerStyle={{ width: "80%", marginTop: 50 }}
          onPress={() => {
            CodePush.restartApp();
            AsyncStorage.clear();
          }}
        />
      </View>
    );
  }

  return children;
};

export default ErrorBoundary;
