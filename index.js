import App from "./App";
import codePush from "react-native-code-push";
import { registerRootComponent } from "expo";
import RealmWrapper from "./src/components/RealmWrapper";

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

const Main = () => {
  return (
    <RealmWrapper>
      <App />
    </RealmWrapper>
  );
};

registerRootComponent(codePush(codePushOptions)(Main));
