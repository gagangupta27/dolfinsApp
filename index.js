import { Platform, View } from "react-native";

import App from "./App";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Realm from "realm";
import RealmWrapper from "./src/components/RealmWrapper";
import codePush from "react-native-code-push";
import { registerRootComponent } from "expo";

let codePushOptions = Platform.OS == "ios" ? { checkFrequency: codePush.CheckFrequency.MANUAL } : {};

if (__DEV__ && Platform.OS != "web") {
    import("./ReactotronConfig").then(() => {});
}

Realm.flags.THROW_ON_GLOBAL_REALM = true;

const Main = () => {
    return (
        <View
            style={{
                backgroundColor: "black",
                flex: 1,
            }}
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <RealmWrapper>
                    <App />
                </RealmWrapper>
            </GestureHandlerRootView>
        </View>
    );
};
registerRootComponent(codePush(codePushOptions)(Main));
