import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import { Alert } from "react-native";
import { useState } from "react";

const useImageHandler = (existingImageUrl) => {
  const [imageUri, setImageUri] = useState(existingImageUrl);

  const onImagePress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      setImageUri(result);
    }
  };

  return { imageUri, onImagePress, setImageUri };
};

export default useImageHandler;
