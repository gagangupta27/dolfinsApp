import * as Clipboard from "expo-clipboard";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import Svg, { Path } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";

import { Feather } from "@expo/vector-icons";
import FeedBackModal from "../../components/Profile/FeedBackModal";
import { FontAwesome5 } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Foundation from "@expo/vector-icons/Foundation";
import LoginModal from "../login/LoginModal";
import { MarkdownView } from "../../utils/markdown";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import ProfileModal from "../../components/ProfileModal.web";
import Toast from "react-native-toast-message";
import { chatGptStreamWeb } from "../../utils/gpt";
import { setAuthData } from "../../redux/reducer/app";
import useCheckMobileScreen from "../../utils/useCheckMobileScreen";
import useDocumentHandler from "../../hooks/DocumentHandler.web";
import { useNavigation } from "@react-navigation/native";
import { uuidv4 } from "../../utils/common";

const AskScreen = ({}) => {
  const [allMessages, setAllMessages] = useState([]);
  const [fetchingAnswer, setFetchingAnswer] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");

  const navigation = useNavigation();

  const MENU_ITEMS = [
    {
      title: "My Profile",
      icon: () => <AntDesign name="user" size={24} color="#b0b0b0" />,
      onPress: () => {
        _profileRef?.current?.show();
      },
    },
    {
      title: "My Organisations",
      icon: () => <Octicons name="organization" size={24} color="#b0b0b0" />,
      onPress: () => {
        navigation.navigate("Organisations");
      },
    },
    {
      title: "Quick Notes",
      icon: () => (
        <Foundation name="clipboard-notes" size={24} color="#b0b0b0" />
      ),
      onPress: () => {
        navigation.navigate("QuickNotes");
      },
    },
    {
      title: "T&C",
      icon: () => <Entypo name="text-document" size={24} color="#b0b0b0" />,
      onPress: () => {
        Linking.openURL("https://dolfins.ai/tnc.html");
      },
    },
    {
      title: "Privacy Policy",
      icon: () => <Entypo name="text-document" size={24} color="#b0b0b0" />,
      onPress: () => {
        Linking.openURL("https://dolfins.ai/privacy.html");
      },
    },
    {
      title: "Contact Us",
      icon: () => <FontAwesome6 name="discord" size={20} color="#b0b0b0" />,
      onPress: () => {
        Linking.openURL("https://discord.com/channels/@me/1266497641089335348");
      },
    },
    {
      title: "FeedBack",
      icon: () => <MaterialIcons name="feedback" size={24} color="#b0b0b0" />,
      onPress: () => {
        _feedBackRef?.current?.show();
      },
    },
    {
      title: "Logout",
      icon: () => <AntDesign name="logout" size={24} color="#b0b0b0" />,
      onPress: () => {
        dispatch(setAuthData());
      },
    },
    {
      title: "Clear Data",
      icon: () => <AntDesign name="delete" size={24} color="#b0b0b0" />,
      onPress: () => {
        Alert.alert(
          "Delete Account",
          "Are you sure you want to delete ypur account?",
          [
            {
              text: "Cancel",
              onPress: () => {},
              style: "cancel",
            },
            {
              text: "Delete",
              onPress: () => {
                dispatch(setAuthData());
              },
              style: "destructive",
            },
          ]
        );
      },
    },
  ];

  const sessionId = uuidv4();

  const Apple = require("../../assets/js/Apple.js");

  const { document, onDocumentPress, setDocument } = useDocumentHandler();

  const authData = useSelector((state) => state.app.authData);

  const { height, width } = useWindowDimensions();
  const isMobile = useCheckMobileScreen();

  console.log("document", document);

  const textInputRef = useRef(null);
  const flatListRef = useRef();
  const _loginRef = useRef();
  const _profileRef = useRef();
  const _feedBackRef = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    Apple?.auth?.init({
      clientId: "com.dolfins.ai.appleSignin", // This is the service ID we created.
      scope: "name email", // To tell apple we want the user name and emails fields in the response it sends us.
      redirectURI: "https://dolfins.netlify.app", // As registered along with our service ID
      state: "origin:web", // Any string of your choice that you may use for some logic. It's optional and you may omit it.
      usePopup: true, // Important if we want to capture the data apple sends on the client side.
    });
  }, []);

  const submit = () => {
    const question = input;
    if (question.trim().length != 0) {
      handleNewQuestion(question);
      setInput("");
      textInputRef.current.clear();
    }
  };

  const copyToClipboard = async (data) => {
    await Clipboard.setStringAsync(data);
    Toast.show({
      type: "success",
      text1: "Copied",
    });
  };

  const handleNewQuestion = async (question) => {
    try {
      setError();
      const start = Date.now();

      let base64 = null;

      let updatedMessages = [
        ...allMessages?.map((entry) => {
          if (entry && entry?.role == "system") {
            return {
              role: "system",
              content: "",
            };
          } else return entry;
        }),
        base64 ? { role: "user", pdfData: base64, content: "" } : null,
        { role: "user", content: question.trim() },
      ].filter(Boolean);
      setAllMessages(updatedMessages);
      let answer = "";
      setFetchingAnswer(true);
      // Use chatGptStream with a callback for each streamed message
      await chatGptStreamWeb(question.trim(), sessionId, (streamedMessage) => {
        setFetchingAnswer(false);
        answer += streamedMessage;
        setAllMessages((prevMessages) => [
          ...updatedMessages,
          { role: "assistant", content: answer },
        ]);
      });
      setHasAnswered(true);
      setFetchingAnswer(false);

      const end = Date.now();
      const timeToLoad = end - start;

      updatedMessages = [
        ...updatedMessages,
        { role: "assistant", content: answer },
      ];
      setAllMessages(updatedMessages);
      // _loginRef?.current?.show();
    } catch (e) {
      console.log("err", e);
      setFetchingAnswer(false);
      setError("Having trouble at the moment. Please try again later.");
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View>
        {item && item?.role == "user" && (
          <Text
            style={{
              backgroundColor: "#000",
              paddingLeft: 31,
              paddingRight: 31,
              paddingTop: 15,
              paddingBottom: 15,
              fontFamily: "Inter-Regular",
              color: "white",
              fontSize: 16,
            }}
          >
            <MarkdownView style={{ fontSize: 18, color: "white" }}>
              {"You - "}
            </MarkdownView>
            <MarkdownView
              onLinkPress={(url) => {
                Linking.openURL(url);
              }}
              style={{ fontSize: 16, fontWeight: "400" }}
            >
              {item.content}
            </MarkdownView>
          </Text>
        )}
        {item && item?.role == "assistant" && (
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.7)",
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                backgroundColor: "rgba(0,0,0,0.7)",
                paddingLeft: 31,
                paddingRight: 31,
                paddingTop: 20,
                paddingBottom: 0,
                flex: 1,
              }}
            >
              {/* <MarkdownView
                style={{
                  fontFamily: "Inter-Bold",
                  fontSize: 18,
                  color: "white",
                }}
              >
                {"GPT - "}
              </MarkdownView> */}
              <MarkdownView
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 16,
                  color: "white",
                }}
                onLinkPress={(url) => {
                  Linking.openURL(url);
                }}
              >
                {item.content}
              </MarkdownView>
            </Text>
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                marginRight: 10,
                marginBottom: 10,
                fontFamily: "Inter-Regular",
                fontSize: 12,
              }}
              onPress={() => copyToClipboard(item.content)}
            >
              <FontAwesome5 name="copy" size={16} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={64}
      behavior={"padding"}
      style={{ flex: 1, width: width }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
          backgroundColor: "#181b1a",
          width: width,
          height: height,
        }}
      >
        {!isMobile && (
          <View
            style={{ backgroundColor: "#1f2221", width: 200, height: height }}
          >
            <Text
              style={{
                fontWeight: "700",
                textAlign: "center",
                fontSize: 25,
                color: "white",
                paddingTop: 20,
              }}
            >
              Preppd.ai
            </Text>
            <View
              style={{
                marginTop: 40,
              }}
            >
              {MENU_ITEMS.map((o, idx) => (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 10,
                  }}
                  onPress={o?.onPress}
                  key={idx}
                >
                  {o?.icon()}
                  <Text
                    style={{
                      fontWeight: "500",
                      textAlign: "center",
                      fontSize: 16,
                      color: "#b0b0b0",
                      paddingLeft: 10,
                    }}
                  >
                    {o?.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* <View
              style={{
                padding: 10,
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  const response = await Apple?.auth?.signIn();
                  console.log("response", JSON.stringify(response));
                  dispatch(setAuthData(response));
                }}
                style={{
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#000",
                  padding: 10,
                  flexDirection: "row",
                  marginTop: 50,
                }}
              >
                <AntDesign name="apple1" size={24} color="white" />
                <Text
                  style={{
                    fontFamily: "Urbanist-Bold",
                    color: "white",
                    fontSize: 16,
                    paddingLeft: 16,
                  }}
                >
                  Sign In with Apple
                </Text>
              </TouchableOpacity>
            </View> */}

            <View
              style={{
                position: "absolute",
                bottom: 0,
                borderTopWidth: 1,
                width: 200,
                borderColor: "#b0b0b0",
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 16,
                  color: "#b0b0b0",
                }}
              >
                Download
              </Text>
              <FontAwesome6 name="discord" size={24} color="#b0b0b0" />
            </View>
          </View>
        )}

        <View
          style={{
            backgroundColor: "#181b1a",
            width: width - (isMobile ? 0 : 200),
            height: height,
          }}
        >
          <View style={{ flex: 1 }}>
            <FlatList
              ref={flatListRef}
              // ListHeaderComponent={() => (
              //   <View
              //     style={{
              //       width: width,
              //       backgroundColor: "red",
              //       height: height,
              //     }}
              //   ></View>
              // )}
              data={[...allMessages].reverse()}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              inverted
            />
            <ActivityIndicator
              animating={fetchingAnswer}
              size="large"
              color="#ffffff"
            />
            {error && (
              <View
                style={{
                  alignSelf: "center",
                  backgroundColor: "rgba(255, 0, 0, 0.2)",
                  margin: 20,
                  padding: 10,
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: "red",
                }}
              >
                <MarkdownView
                  style={{
                    fontFamily: "Inter-Regular",
                    fontSize: 12,
                    color: "white",
                  }}
                >
                  {error}
                </MarkdownView>
              </View>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              bottom: 0,
              margin: 10,
              marginBottom: 20,
              backgroundColor: "rgba(0,0,0,0.3)",
              borderRadius: 5,
              padding: 10,
              width: width - (isMobile ? 0 : 200) - 20,
            }}
          >
            <TextInput
              ref={textInputRef}
              value={input}
              style={{
                flex: 1,
                color: "white",
                fontFamily: "Inter-Regular",
                fontSize: 16,
                outline: "none",
              }}
              onChangeText={async (text) => {
                setInput(text);
              }}
              maxHeight={100}
              minHeight={35}
              placeholder={
                !hasAnswered ? "LinkedIn Url" : "Ask a follow up question"
              }
              placeholderTextColor="rgba(255, 255, 255, 0.8)"
              keyboardType="default"
              returnKeyType="done"
              selectionColor="white"
              autoCapitalize="none"
            ></TextInput>
            <TouchableOpacity
              onPress={onDocumentPress}
              style={{
                padding: 5,
                color: "#000",
              }}
            >
              <Feather name="file" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={{ margin: 5 }} onPress={() => submit()}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <Path
                  d="M10.1101 13.6499L13.6901 10.0599M7.40005 6.31991L15.8901 3.48991C19.7001 2.21991 21.7701 4.29991 20.5101 8.10991L17.6801 16.5999C15.7801 22.3099 12.6601 22.3099 10.7601 16.5999L9.92005 14.0799L7.40005 13.2399C1.69005 11.3399 1.69005 8.22991 7.40005 6.31991Z"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <LoginModal ref={_loginRef} />
      <ProfileModal ref={_profileRef} />
      <FeedBackModal ref={_feedBackRef} />
    </KeyboardAvoidingView>
  );
};

export default AskScreen;
