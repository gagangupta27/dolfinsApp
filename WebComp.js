import { Provider, useSelector } from "react-redux";
import { View, useWindowDimensions } from "react-native";

import AskScreen from "./src/screens/ask/AskScreen.web";
import Header from "./src/components/common/Header";
import LoginScreen from "./src/screens/login/LoginScreen.web";
import { NavigationContainer } from "@react-navigation/native";
import Organisations from "./src/screens/organisation/Organisations.web";
import PrepHome from "./web/PrepHome";
import QuickNotes from "./src/screens/quickNotes/QuickNotes.web";
import WebAddNote from "./web/WebAddNote";
import { createStackNavigator } from "@react-navigation/stack";
import { store } from "./src/redux/store";

const WebComp = () => {
  const authData = useSelector((state) => state.app.authData);

  const Stack = createStackNavigator();

  const { height, width } = useWindowDimensions();

  const isDolfins = false;
  const isPrepptd = true;

  if (authData) {
    return (
      <View
        style={{
          display: "flex",
          width: width,
          height: height,
        }}
      >
        <NavigationContainer>
          {isDolfins && (
            <>
              <Header hideBack title="Dolfins.ai" />
              <WebAddNote />
            </>
          )}
          {isPrepptd && (
            <View
              style={{
                width: width,
                height: height,
              }}
            >
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="AskScreen" component={AskScreen} />
                <Stack.Screen name="Organisations" component={Organisations} />
                <Stack.Screen name="QuickNotes" component={QuickNotes} />
              </Stack.Navigator>
            </View>
          )}
        </NavigationContainer>
      </View>
    );
  } else {
    return (
      <NavigationContainer>
        <LoginScreen />
      </NavigationContainer>
    );
  }
};

export default WebComp;
