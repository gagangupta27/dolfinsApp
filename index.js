import App from "./App";
import codePush from "react-native-code-push";
import { registerRootComponent } from "expo";

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

const Main = () => {
  return (
    <>
      <App />
    </>
  );
};

registerRootComponent(codePush(codePushOptions)(Main));
