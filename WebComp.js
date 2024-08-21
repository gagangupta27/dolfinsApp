import { Provider, useSelector } from "react-redux";

import Header from "./src/components/common/Header";
import LoginScreen from "./src/screens/login/LoginScreen.web";
import { NavigationContainer } from "@react-navigation/native";
import { store } from "./src/redux/store";

const WebComp = () => {
  const authData = useSelector((state) => state.app.authData);

  console.log("authData", authData);

  if (authData) {
    return (
      <NavigationContainer>
        <Header hideBack title="Dolfins.ai" />
      </NavigationContainer>
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
