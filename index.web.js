import { Provider } from "react-redux";
import WebComp from "./WebComp";
import { registerRootComponent } from "expo";
import { store } from "./src/redux/store";

const Main = () => {
  return (
    <Provider store={store}>
      <WebComp />
    </Provider>
  );
};
registerRootComponent(Main);
