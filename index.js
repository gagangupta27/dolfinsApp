import IOSComp from "./IOSComp";
import { registerRootComponent } from "expo";

const Main = () => {
  return <IOSComp />;
};
registerRootComponent(Main);
