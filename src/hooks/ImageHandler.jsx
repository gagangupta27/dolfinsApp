import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { BUTTON_NAME, EVENTS } from "../utils/analytics";

import { useTrackWithPageInfo } from "../utils/analytics";

const useImageHandler = (existingImageUrl) => {
  const track = useTrackWithPageInfo();

  const [imageUri, setImageUri] = useState(existingImageUrl);

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
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      const filename = localUri.split("/").pop();

      // Infer the type of the image
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      const internalUri = FileSystem.documentDirectory + filename;
      await FileSystem.copyAsync({
        from: localUri,
        to: internalUri,
      });
      setImageUri(internalUri);
    }
  };

  return { imageUri, onImagePress, setImageUri };
};

export default useImageHandler;
