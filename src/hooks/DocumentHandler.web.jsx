import * as DocumentPicker from "expo-document-picker";

import { useState } from "react";

const useDocumentHandler = (existingDocument) => {
  const [document, setDocument] = useState(existingDocument);

  const onDocumentPress = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({});
      if (!result.cancelled) {
        setDocument(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { document, onDocumentPress, setDocument };
};

export default useDocumentHandler;
