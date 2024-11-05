import RealmWrapper from "./src/components/RealmWrapper";
import codePush from "react-native-code-push";

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

const IOSComp = () => {
    return <RealmWrapper></RealmWrapper>;
};

export default codePush(codePushOptions)(IOSComp);
