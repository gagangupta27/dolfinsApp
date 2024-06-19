import { ActivityIndicator, Modal, View } from "react-native";
import { memo, useEffect, useState } from "react";

import VText from "./Text";
import codePush from "react-native-code-push";

const CodePushUpdater = ({ header = "Downloading" }) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [syncMessage, setSyncMessage] = useState();
  const [progress, setProgress] = useState();

  const syncStatusChangedCallback = (syncStatus) => {
    switch (syncStatus) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        setSyncMessage("Checking for update...");
        break;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        setSyncMessage("Downloading update...");
        break;
      case codePush.SyncStatus.AWAITING_USER_ACTION:
        setSyncMessage("User waiting...");
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        setSyncMessage("Loading update...");
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        setSyncMessage("The app is up to date...");
        break;
      case codePush.SyncStatus.UPDATE_IGNORED:
        setSyncMessage("Update canceled by user...");
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        setSyncMessage("Update installed, Application restarting...");
        break;
      case codePush.SyncStatus.UNKNOWN_ERROR:
        setSyncMessage("An error occurred during the update...");
        break;
      default:
        setSyncMessage(undefined);
        break;
    }
  };

  const downloadProgressCallback = ({ receivedBytes, totalBytes }) => {
    const currentProgress = Math.round((receivedBytes / totalBytes) * 100);
    setProgress(`${currentProgress} %`);
  };

  useEffect(() => {
    codePush.notifyAppReady();
    codePush.checkForUpdate().then((update) => {
      if (update) {
        setIsUpdate(true);
        codePush.sync(
          { installMode: codePush.InstallMode.IMMEDIATE },
          syncStatusChangedCallback,
          downloadProgressCallback
        );
      } else {
        setIsUpdate(false);
      }
    });
  }, []);

  return (
    <Modal visible={isUpdate} transparent={false} animationType="fade">
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>{header}</Text>
        <Text>{syncMessage}</Text>
        <ActivityIndicator color={"gray"} size="large" />
        <Text>{progress}</Text>
      </View>
    </Modal>
  );
};

export default memo(CodePushUpdater);
