import { Provider, useSelector } from "react-redux";
import { View, useWindowDimensions } from "react-native";

import AskScreen from "./src/screens/ask/AskScreen.web";
import Header from "./src/components/common/Header";
import LoginScreen from "./src/screens/login/LoginScreen.web";
import { NavigationContainer } from "@react-navigation/native";
import PrepHome from "./web/PrepHome";
import WebAddNote from "./web/WebAddNote";
import { store } from "./src/redux/store";

const WebComp = () => {
  const authData = useSelector((state) => state.app.authData);

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
              {/* <Header
                titleStyle={{
                  color: "white",
                }}
                container={{
                  backgroundColor: "#1f2221",
                }}
                subConatinerStyle={{
                  backgroundColor: "#1f2221",
                }}
                hideBack
                title="Preppd.ai"
              /> */}
              <AskScreen />
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
