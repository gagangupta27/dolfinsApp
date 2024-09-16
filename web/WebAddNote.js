import {
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { StyleSheet, Text, TextInput } from "react-native";
import { useEffect, useRef, useState } from "react";

import BottomSheetModal from "../src/components/common/BottomSheetModal";
import ExportImportModalWeb from "../src/screens/profile/ExportImportModal.web";
import { Feather } from "@expo/vector-icons";
import SendButtonIcon from "../src/components/icons/SendButtonIcon";
import useCheckMobileScreen from "../src/utils/useCheckMobileScreen";
import useImageHandler from "../src/hooks/ImageHandler.web";
import { useSelector } from "react-redux";

const WebAddNote = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const authData = useSelector((state) => state.app.authData);

  const { imageUri, onImagePress, setImageUri } = useImageHandler();
  const { height, width } = useWindowDimensions();
  const isMobile = useCheckMobileScreen();

  console.log("imageUri", imageUri);

  const _loadingRef = useRef();

  const onSend = async () => {
    let tempContent = content;
    let tempImageData = [];
    let count = 0;
    if (imageUri && imageUri?.assets && Array.isArray(imageUri?.assets)) {
      for await (const image of imageUri?.assets) {
        ++count;
        _loadingRef?.current?.showLoading(
          "Converting Images",
          `Preparing Data\n${count}/${imageUri?.assets?.length}`
        );
        const formData = new FormData();
        formData.append("image", {
          uri: image?.uri,
          type: "png/jpeg",
          name: "image.png",
        });

        let imageText = await fetch(
          "https://dolfins-server-development.up.railway.app/api/1.0/user/ocr/image",
          {
            method: "POST",
            body: formData,
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: "Bearer " + authData?.idToken,
            },
          }
        )
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            return data?.text || "";
          })
          .catch((error) => {
            console.error("Error transcribing image:", error);
            setLoading(false);
            return "";
          });
        tempImageData.push({ ...image, imageText: imageText });
      }
      // _loadingRef?.current?.hide();
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: isMobile ? -100 : 0,
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontWeight: "700",
            paddingBottom: 20,
          }}
        >
          Add Note
        </Text>
        <View
          style={{
            height: height / 2,
            width: isMobile ? width * 0.9 : width / 2,
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
          }}
        >
          <TextInput
            style={{
              verticalAlign: "top",
              fontSize: 16,
              width: "100%",
              height: "100%",
              borderWidth: 0,
              outline: "none",
            }}
            multiline
            value={content}
            onChangeText={(e) => setContent(e)}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {imageUri &&
              imageUri?.assets &&
              Array.isArray(imageUri?.assets) && (
                <ScrollView
                  contentContainerStyle={{
                    flexGrow: 1,
                  }}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                >
                  {imageUri?.assets?.map((o) => (
                    <Image
                      source={{ uri: o?.uri }}
                      style={{
                        height: 100,
                        width: 100,
                        borderRadius: 4,
                        overflow: "hidden",
                        marginRight: 10,
                      }}
                      resizeMode="cover"
                    />
                  ))}
                </ScrollView>
              )}
            <TouchableOpacity
              style={{ paddingRight: 10 }}
              onPress={onImagePress}
            >
              <Feather name="file" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onSend}>
              <SendButtonIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ExportImportModalWeb
        hideCancel={true}
        showPercentage={false}
        ref={_loadingRef}
        containserStyle={{
          paddingBottom: 100,
        }}
      />
    </View>
  );
};

export default WebAddNote;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
});
