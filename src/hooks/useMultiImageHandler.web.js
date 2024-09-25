import * as ImagePicker from "expo-image-picker";

import { useState } from "react";

const useMultiImageHandler = (existingImageUrl = []) => {
  const [imageData, setImageData] = useState(existingImageUrl);

  const onImagePress = async () => {
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
          let localUri = file?.uri || "";
          let filename = localUri?.split("/")?.pop();
          tempResults.push({
            // _id: new BSON.ObjectID(),
            uri: filename,
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
