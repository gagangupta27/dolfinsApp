import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

import { BUTTON_NAME, EVENTS, useTrackWithPageInfo } from "../utils/analytics";

import { useState } from "react";

const useDocumentHandler = (existingDocument) => {
  const track = useTrackWithPageInfo();
  const [document, setDocument] = useState(existingDocument);

  const onDocumentPress = async () => {
    track(EVENTS.BUTTON_TAPPED.NAME, {
      [EVENTS.BUTTON_TAPPED.KEYS.BUTTON_NAME]: BUTTON_NAME.ADD_FILE,
    });

    try {
      let result = await DocumentPicker.getDocumentAsync({});
      if (!result.cancelled) {
        const savedFile = await copyFileToLocalDirectory(
          result.assets[0].uri,
          result.assets[0].name
        );
        setDocument(savedFile);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const copyFileToLocalDirectory = async (uri, filename) => {
    const localUri =
      FileSystem.documentDirectory + encodeURIComponent(filename);
    try {
      await FileSystem.copyAsync({
        from: uri,
        to: localUri,
      });
      return {
        documentUri: localUri,
        documentName: filename,
      };
    } catch (error) {
      console.error("Error copying file", error);
    }
  };

  return { document, onDocumentPress, setDocument };
};

export default useDocumentHandler;
