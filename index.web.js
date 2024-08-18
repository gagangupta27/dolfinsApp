import WebComp from "./WebComp";
import { registerRootComponent } from "expo";

const Main = () => {
  return <WebComp />;
};
registerRootComponent(Main);
