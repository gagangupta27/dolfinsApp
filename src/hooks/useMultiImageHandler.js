import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import { BUTTON_NAME, EVENTS } from "../utils/analytics";

import { BSON } from "realm";
import { useState } from "react";
import { useTrackWithPageInfo } from "../utils/analytics";

const useMultiImageHandler = (existingImageUrl = []) => {
  const track = useTrackWithPageInfo();

  const [imageData, setImageData] = useState(existingImageUrl);

  const onImagePress = async () => {
    track(EVENTS.BUTTON_TAPPED.NAME, {
      [EVENTS.BUTTON_TAPPED.KEYS.BUTTON_NAME]: BUTTON_NAME.ADD_IMAGE,
    });

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      allowsMultipleSelection: true,
    });

    if (result && !result?.canceled) {
      if (result?.assets && Array.isArray(result?.assets)) {
        let tempResults = [];
        for (const file of result?.assets) {
          console.log("result?.assets", file);
          let localUri = file?.uri || "";
          let filename = localUri?.split("/")?.pop();
          console.log("filename", filename, localUri);
          let internalUri = FileSystem.documentDirectory + filename;
          await FileSystem.copyAsync({
            from: localUri,
            to: internalUri,
          });
          tempResults.push({
            _id: new BSON.ObjectID(),
            uri: internalUri,
            localPath: "",
            iCloudPath: "",
            imageText: "",
          });
        }
        setImageData(tempResults);
      }
    }
  };

  return { imageData, onImagePress, setImageData };
};

export default useMultiImageHandler;
