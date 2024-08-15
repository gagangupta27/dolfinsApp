import App from "./App";
import { Platform } from "react-native";
import RealmWrapper from "./src/components/RealmWrapper";
import codePush from "react-native-code-push";
import { registerRootComponent } from "expo";

// let codePushOptions =
//   Platform.OS == "ios"
//     ? { checkFrequency: codePush.CheckFrequency.MANUAL }
//     : {};

// if (__DEV__ && Platform.OS != "web") {
//   import("./ReactotronConfig").then(() => {});
// }

const Main = () => {
  return <></>;
};

// registerRootComponent(codePush(codePushOptions)(Main));
registerRootComponent(Main);
