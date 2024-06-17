import * as Clipboard from "expo-clipboard";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import {
  BUTTON_NAME,
  CARD_NAME,
  EVENTS,
  INPUT_NAME,
  LOADING_TEXT_NAME,
  useTrackWithPageInfo,
} from "../../utils/analytics";
import {
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import React, { useRef, useState } from "react";
import Svg, { G, Path } from "react-native-svg";
import {
  addChat,
  removeChat,
  updateChat,
  useChat,
  useChats,
} from "../../realm/queries/chatOperations";
import {
  useAllCalendarNotes,
  useAllContactNotes,
} from "../../realm/queries/noteOperations";

import { ASK_MODULE_TOP_LEVEL_PROMPT } from "../../../prompts";
import { BSON } from "realm";
import Toast from "react-native-toast-message";
import UserMentionDropdown from "../../components/notecontainer/UserMentionDropdown";
import UserMentionOptionsDropdown from "../../components/notecontainer/UserMentionOptionsDropdown";
import { chatGptStream } from "../../utils/gpt";
import { getLastSubstringAfterAt } from "../../utils/common";
import { getWorkHistoryList } from "../../utils/linkedin";
import useContactPermission from "../../hooks/ContactPermission";
import { useContacts } from "../../realm/queries/contactOperations";
import { useNavigation } from "@react-navigation/native";
import { useRealm } from "@realm/react";
import { useRecentCalendarEvents } from "../../realm/queries/calendarEventOperations";
import useSearchFilter from "../../hooks/SearchFilter";

const ChatComponent = ({ route }) => {
  const track = useTrackWithPageInfo();
  const realm = useRealm();
  const { id } = route.params;

  const textInputRef = useRef(null);
  const flatListRef = useRef();

  const chat = useChat(realm, new BSON.ObjectId(id));
  const [allMessages, setAllMessages] = useState([
    ...JSON.parse(chat.messages),
  ]);

  const [fetchingAnswer, setFetchingAnswer] = useState(false);
  const [error, setError] = useState(null);
  const [mentionData, setMentionData] = useState([]);
  const [input, setInput] = useState("");

  const contacts = useContactPermission();
  const contactsRealm = useContacts(realm);
  const calendarEvents = useRecentCalendarEvents(realm);
  const allCalendarNotes = useAllCalendarNotes(realm);
  const allNotes = useAllContactNotes(realm);
  const { searchText, setSearchText, searchFilter, filteredContacts } =
    useSearchFilter(contacts, mentionData);

  const submit = () => {
    track(EVENTS.INPUT_DONE.NAME, {
      [EVENTS.INPUT_DONE.KEYS.INPUT_NAME]: INPUT_NAME.ASK_QUERY,
    });

    const question = input;
    if (question.trim().length != 0) {
      handleNewQuestion(question);
      setInput("");
      textInputRef.current.clear();
    }
  };

  const getSystemPrompt = async (mentions = []) => {
    const contactIds = mentions?.map((o) => o?.contactId);
    const quickNotesContact = {
      _id: "000000000000000000000000",
      name: "Quick Notes",
    };

    const contactMap = contactsRealm
      .filter((o) => contactIds?.includes(o?.id))
      .reduce((acc, contact) => {
        acc[contact._id] = contact;
        return acc;
      }, {});

    contactMap[quickNotesContact._id] = quickNotesContact;
    const notesMap = allNotes
      ?.filter((o) => {
        if (Array.isArray(o?.mentions)) {
          const mentionIDs = o?.mentions?.map((o) => o?.contactId);
          if (
            contactIds?.includes(o?.contactId) ||
            mentionIDs?.includes(o?.contactId)
          ) {
            return true;
          }

          return false;
        } else {
          return true;
        }
      })
      .reduce((acc, note) => {
        if (!acc[note.contactId]) {
          acc[note.contactId] = [];
        }
        acc[note.contactId].push(note);
        return acc;
      }, {});
    const calendarEventMap = calendarEvents.reduce((acc, calendarEvent) => {
      acc[calendarEvent._id] = calendarEvent;
      return acc;
    }, {});
    const notesCalendarMap = allCalendarNotes
      .filter((o) => {
        const mentionIDs = JSON.parse(o?.mentions)?.map((o) => o?.contactId);
        if (mentionIDs.includes(o?.contactId)) {
          return true;
        }
        return false;
      })
      .reduce((acc, note) => {
        if (!acc[note.calendarEventId]) {
          acc[note.calendarEventId] = [];
        }
        acc[note.calendarEventId].push(note);
        return acc;
      }, {});

    async function setupSystemPrompt(allNotes, contactMap) {
      const systemPrompt = Object.keys(contactMap)
        .map((contactId, entityIndex) => {
          const contact = contactMap[contactId];
          const entityName = contact.name;
          const linkedinProfileData = JSON.parse(
            contact.linkedinProfileData ? contact.linkedinProfileData : null
          );
          const linkedinSummary = contact.linkedinSummary;
          const workHistoryNote = getWorkHistoryList(linkedinProfileData);

          const savedNotes = allNotes[contactId];

          const notes = [];

          if (workHistoryNote) {
            notes.push({ content: "Work History \n" + workHistoryNote });
          }
          if (linkedinSummary) {
            notes.push({ content: "Linkedin Summary \n" + linkedinSummary });
          }

          if (savedNotes && savedNotes.length > 0) {
            notes.push(...savedNotes);
          }

          const noteData = notes
            .map((note, index) => {
              const lastNoteContent = note.content;
              const lastNoteUpdatedAt = note.updatedAt;
              if (note.content && note.content.trim()) {
                return `  Note ${entityIndex + 1}.${
                  index + 1
                } - ${lastNoteContent} \n$`;
              } else {
                return;
              }
            })
            .join("\n");

          return `Entity ${
            entityIndex + 1
          } - ${entityName} \n\n All Notes about ${entityName} \n\n${noteData}`;
        })
        .join("\n\n------------------------\n\n");

      const calendarNotesPrompt = Object.keys(calendarEventMap)
        .map((calendarEventId, entityIndex) => {
          const calendarEvent = calendarEventMap[calendarEventId];
          const entityName = calendarEvent.title;

          const calendarDescription = calendarEvent.description;
          const attendees = calendarEvent.attendees
            ? calendarEvent.attendees.join("\n")
            : "";
          const organizer = calendarEvent.organizer;
          const startTime = calendarEvent.eventStartTime;
          const endTime = calendarEvent.eventEndTime;

          const savedNotes = notesCalendarMap[calendarEventId];
          const notes = [];

          if (savedNotes && savedNotes.length > 0) {
            notes.push(...savedNotes);
          }

          const noteData = notes
            .map((note, index) => {
              const lastNoteContent = note.content;
              if (note.content && note.content.trim()) {
                return `  Note ${entityIndex + 1}.${
                  index + 1
                } - ${lastNoteContent} \n$`;
              } else {
                return;
              }
            })
            .join("\n");

          return `Entity ${
            entityIndex + 1
          } - ${entityName} \n\n All Notes about Calendar Event \n
          Title - ${entityName}\n
          Description - ${calendarDescription}\n
          Attendees - ${attendees}\n
          Organizer - ${organizer} \n
          Start Time - ${startTime}\n
          End Time - ${endTime}\n
          \n${noteData}\n`;
        })
        .join("\n\n------------------------\n\n");
      return (
        ASK_MODULE_TOP_LEVEL_PROMPT +
        "\n\n\n" +
        systemPrompt +
        "\n\n\n" +
        calendarNotesPrompt
      );
    }

    const systemPrompt = await setupSystemPrompt(notesMap, contactMap);
    return systemPrompt;
  };

  // <-- add this line
  const handleNewQuestion = async (question) => {
    try {
      track(EVENTS.LOADING_START.NAME, {
        [EVENTS.LOADING_START.KEYS.TEXT_NAME]:
          LOADING_TEXT_NAME.RESPONSE_TO_QUERY,
      });
      const start = Date.now();

      const systemPrompt = await getSystemPrompt(mentionData);

      let updatedMessages = [
        ...allMessages.map((entry) => {
          if (entry.role == "system") {
            return { role: "system", content: systemPrompt };
          } else return entry;
        }),
        { role: "user", content: question.trim() },
      ];
      let title = chat.title;
      if (!title) {
        title = question.trim().slice(0, 25);
      }
      updateChat(realm, new BSON.ObjectId(id), {
        title: title,
        messages: updatedMessages,
      });
      setAllMessages(updatedMessages);

      let answer = "";
      setFetchingAnswer(true);
      // Use chatGptStream with a callback for each streamed message
      await chatGptStream(updatedMessages, (streamedMessage) => {
        setFetchingAnswer(false);
        answer += streamedMessage;
        setAllMessages((prevMessages) => [
          ...updatedMessages,
          { role: "assistant", content: answer },
        ]);
      });

      setFetchingAnswer(false);

      const end = Date.now();
      const timeToLoad = end - start;

      track(EVENTS.LOADING_DONE.NAME, {
        [EVENTS.LOADING_DONE.KEYS.TEXT_NAME]:
          LOADING_TEXT_NAME.RESPONSE_TO_QUERY,
        [EVENTS.LOADING_DONE.KEYS.TIME_TO_LOAD]: timeToLoad,
      });

      updatedMessages = [
        ...updatedMessages,
        { role: "assistant", content: answer },
      ];
      updateChat(realm, new BSON.ObjectId(id), {
        title: title,
        messages: updatedMessages,
      });
      setAllMessages(updatedMessages);
    } catch (e) {
      setFetchingAnswer(false);
      setError("Having trouble at the moment. Please try again later.");
    }
  };

  const copyToClipboard = async (data) => {
    await Clipboard.setStringAsync(data);
    Toast.show({
      type: "success",
      text1: "Copied",
    });
    // toast message
    // copied to clipboard
  };

  const handleOptionSelect = async (option) => {
    const exisiting = mentionData.filter(
      (mention) => mention.contactId == option.id
    );
    if (exisiting.length == 0) {
      setMentionData([
        ...mentionData,
        { contactId: option.id, name: option.name },
      ]);
    }
    const str = await getLastSubstringAfterAt(input);
    let newConent = input;
    if (str !== null) {
      const boldSubstring = `*${option?.name}* `;
      newConent = newConent.replace(`@${str}`, boldSubstring);
    }
    setInput(newConent);
    setSearchText("");
    setTimeout(() => {
      textInputRef.current.setNativeProps({
        selection: { start: newConent?.length, end: newConent?.length },
      });
    }, 300);
  };

  const handleMentionSelect = (user) => {
    const remaining = mentionData.filter(
      (mention) => mention.contactId != (user.id || user?.contactId)
    );
    setInput((prev) => {
      return prev?.replace(`*${user?.name}*`, "");
    });
    setSearchText("");
    setMentionData(remaining);
  };

  const renderItem = ({ item }) => {
    return (
      <View>
        {item.role == "user" && (
          <Text
            style={{
              backgroundColor: "#7879F1",
              paddingLeft: 31,
              paddingRight: 31,
              paddingTop: 15,
              paddingBottom: 15,
              fontFamily: "Inter-Regular",
              color: "white",
              fontSize: 16,
            }}
          >
            <Text
              style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "white" }}
            >
              {"You - "}
            </Text>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 16 }}>
              {item.content}
            </Text>
          </Text>
        )}
        {item.role == "assistant" && (
          <View
            style={{
              backgroundColor: "#5D5EB8",
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                backgroundColor: "#5D5EB8",
                paddingLeft: 31,
                paddingRight: 31,
                paddingTop: 20,
                paddingBottom: 0,
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  fontSize: 18,
                  color: "white",
                }}
              >
                {"GPT - "}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 16,
                  color: "white",
                }}
              >
                {/* <MarkdownView style={{
              backgroundColor: "#5D5EB8",
              paddingLeft: 31,
              paddingRight: 31,
              paddingTop: 20,
              paddingBottom: 0,
              flex:1, fontFamily: "Inter-Regular", fontSize: 16, color: "white", padding: 5}}
                          onLinkPress={(url) => {Linking.openURL(url)}} // Open a webpage in in-app browser

                          >
                            *GPT -  * 
                            {item.content}
                  </MarkdownView> */}
                {item.content}
              </Text>
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
    <View style={{ flex: 1, backgroundColor: "#7879F1" }}>
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
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
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 12,
                color: "white",
              }}
            >
              {error}
            </Text>
          </View>
        )}
      </View>
      {searchText && filteredContacts.length > 0 && (
        <UserMentionOptionsDropdown
          filteredContacts={filteredContacts}
          onSelectOption={handleOptionSelect}
          containerStyle={{
            backgroundColor: "#5D5EB8",
            paddingVertical: 10,
          }}
        />
      )}
      <UserMentionDropdown
        data={mentionData}
        onMentionSelect={handleMentionSelect}
        searchText={searchText}
        setSearchText={searchFilter}
        setIsMentionFocused={() => {}}
        hasTextInput={false}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          bottom: 0,
          margin: 10,
          marginBottom: 20,
          backgroundColor: "#5D5EB8",
          borderRadius: 5,
          padding: 10,
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
          }}
          onChangeText={async (text) => {
            setInput(text);
            const matches = await getLastSubstringAfterAt(text);
            if (matches && matches?.length > 0) {
              searchFilter(matches);
              setSearchText(matches);
            } else {
              searchFilter("");
              setSearchText("");
            }
          }}
          multiline
          maxHeight={100}
          minHeight={35}
          placeholder="Ask any question about your contacts"
          placeholderTextColor="rgba(255, 255, 255, 0.8)"
          keyboardType="default"
          returnKeyType="done"
          selectionColor="white"
          autoCapitalize="none"
        ></TextInput>
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
  );
};

const CustomDrawerContent = (props) => {
  const track = useTrackWithPageInfo();
  const { createNewChat, state } = props;

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: "#5D5EB8" }}>
      <TouchableOpacity
        onPress={() => {
          track(EVENTS.BUTTON_TAPPED.NAME, {
            [EVENTS.BUTTON_TAPPED.KEYS.BUTTON_NAME]: BUTTON_NAME.NEW_ASK,
          });
          createNewChat(props.navigation);
        }}
        style={{ borderWidth: 1, borderColor: "white", margin: 10 }}
      >
        <Text style={{ margin: 10, color: "white" }}>Create New Chat</Text>
      </TouchableOpacity>
      {state.routes.map((route, index) => {
        const focused = index === state.index;
        const label = route.name;

        const chatId = route?.params?.id;

        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              backgroundColor: "transparent",
              paddingRight: 10,
            }}
            key={route.key}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <DrawerItem
                label={label}
                focused={focused}
                onPress={() => {
                  track(EVENTS.CARD_TAPPED.NAME, {
                    [EVENTS.CARD_TAPPED.KEYS.CARD_NAME]: CARD_NAME.PREVIOUS_ASK,
                    [EVENTS.CARD_TAPPED.KEYS.CARD_IDENTIFIER]: label,
                  });
                  props.navigation.navigate(route.name);
                }}
                style={{
                  backgroundColor: "transparent",
                }}
                labelStyle={{ color: "white" }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                if (chatId) {
                  props?.deleteChat(chatId);
                }
              }}
            >
              <Svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <G id="icon/action/delete_24px">
                  <Path
                    id="icon/action/delete_24px_2"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M14.5 3H9.5L8.5 4H5V6H19V4H15.5L14.5 3ZM16 9V19H8V9H16ZM6 7H18V19C18 20.1 17.1 21 16 21H8C6.9 21 6 20.1 6 19V7Z"
                    fill="white"
                    fill-opacity="0.54"
                  />
                </G>
              </Svg>
            </TouchableOpacity>
          </View>
        );
      })}
    </DrawerContentScrollView>
  );
};

const CommonComponent = ({}) => {
  const track = useTrackWithPageInfo();
  const realm = useRealm();
  const navigation = useNavigation();
  const chats = useChats(realm);
  if (chats.length == 0) {
    const newChat = {
      title: `Chat 1`,
      messages: [{ role: "assistant", content: "Hi, How can I help you?" }],
    };
    addChat(realm, newChat);
  }

  const Drawer = createDrawerNavigator();

  const createNewChat = (navigation) => {
    const newChat = {
      title: `Chat ${chats.length + 1}`,
      messages: [{ role: "assistant", content: "Hi, How can I help you?" }],
    };
    const id = addChat(realm, newChat);
    setTimeout(() => {
      navigation.navigate(newChat.title, { id: id.toHexString() });
    }, 500);
  };

  const deleteChat = async (chatId) => {
    const objectId = new BSON.ObjectId(chatId);
    Alert.alert("Delete Chat", "Are you sure you want to delete this chat?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          removeChat(realm, objectId);
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#7879F1",
        justifyContent: "space-between",
      }}
    >
      {chats.length > 0 && (
        <Drawer.Navigator
          drawerStyle={{
            backgroundColor: "#7879F1",
            width: 240,
          }}
          drawerContentOptions={{
            activeTintColor: "#7879F1",
            labelStyle: {
              color: "#d7879F1",
            },
          }}
          drawerContent={(props) => (
            <CustomDrawerContent
              deleteChat={deleteChat}
              {...props}
              createNewChat={createNewChat}
            />
          )}
        >
          {[...chats].reverse().map((chat, index) => (
            <Drawer.Screen
              options={{
                headerStyle: {
                  backgroundColor: "#7879F1", // Change this to your desired color
                },
                headerTintColor: "#fff", // Change this to your desired color
                headerTitleStyle: {
                  fontWeight: "bold",
                },
                headerTitle: "Ask",
              }}
              key={index}
              name={chat.title}
              component={ChatComponent}
              initialParams={{
                id: chat._id.toHexString(),
              }}
            />
          ))}
        </Drawer.Navigator>
      )}
      <TouchableOpacity
        style={{ position: "absolute", right: 10, top: 60 }}
        onPress={() => {
          track(EVENTS.BUTTON_TAPPED.NAME, {
            [EVENTS.BUTTON_TAPPED.KEYS.BUTTON_NAME]: BUTTON_NAME.CLOSE,
          });
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      >
        <AntDesign name="closecircleo" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const AskScreen = () => {
  const realm = useRealm();

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={64}
      behavior={"padding"}
      style={{ flex: 1 }}
    >
      <CommonComponent />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#7879F1",
    borderWidth: 1,
    borderColor: "red",
  },
});

export default AskScreen;
