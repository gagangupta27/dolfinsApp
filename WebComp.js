import Header from "./src/components/common/Header";
import { NavigationContainer } from "@react-navigation/native";

const WebComp = () => {
  return (
    <NavigationContainer>
      <Header hideBack title="Dolfins.ai" />
    </NavigationContainer>
  );
};

export default WebComp;
