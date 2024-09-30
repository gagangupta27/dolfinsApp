import {
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Text,
  TouchableOpacity,
} from "react-native";
import { Path, Svg } from "react-native-svg";
import { TouchableWithoutFeedback, View } from "react-native";
import { useRef, useState } from "react";

import AddOrgModalWeb from "../../components/organisation/AddOrgModal.web";
import Feather from "@expo/vector-icons/Feather";
import Header from "../../components/common/Header";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const Organisations = ({ route }) => {
  const [text, setText] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [searchListData, setSearchListData] = useState([]);

  const isDark = useSelector((state) => state.app.isDark);
  const webData = useSelector((state) => state.web.webData);

  const _addModalRef = useRef();

  const organisations = [];

  const navigation = useNavigation();

  const search = (text) => {
    if (text) {
      let searched = organisations?.filter((o) =>
        o.name.toLowerCase().includes(text.toLowerCase())
      );
      setSearchListData(searched);
      setIsSearch(true);
    } else {
      setIsSearch(false);
    }
    // Now Search
  };

  const _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{
          padding: 16,
          backgroundColor: "#1f2221",
          marginTop: 20,
        }}
        onPress={() => {
          navigation.navigate("OrgScreen", { organisation: item });
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: "#b0b0b0",
          }}
        >
          {item?.name}
        </Text>
        <TouchableOpacity
          style={{
            paddingTop: 8,
          }}
          onPress={() => Linking.openURL(item?.linkedinUrl)}
          activeOpacity={0.8}
        >
          <Text
            style={{
              fontSize: 16,
              color: "blue",
            }}
          >
            {item?.linkedinUrl}
          </Text>
        </TouchableOpacity>
        {Array.isArray(item?.links) && item?.links?.length > 0 && (
          <View
            style={{
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#b0b0b0",
              }}
            >
              {"Additional Links"}
            </Text>
            {item?.links?.map((o, idx) => (
              <TouchableOpacity
                style={{
                  paddingTop: 8,
                }}
                key={idx}
                onPress={() => Linking.openURL(o)}
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "blue",
                  }}
                >
                  {o}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 20,
            top: 20,
          }}
          activeOpacity={0.8}
          onPress={() => _addModalRef?.current?.show("Edit Organisation", item)}
        >
          <Feather name="edit-2" size={24} color="#b0b0b0" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={64}
      behavior={"padding"}
      style={{ flex: 1, backgroundColor: isDark ? "#181b1a" : "#fff" }}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Header title={"All Organisations"} />
          <FlatList
            contentContainerStyle={{
              padding: 50,
            }}
            data={
              Array.isArray(webData?.organisations)
                ? webData?.organisations
                : []
            }
            renderItem={_renderItem}
          />
        </View>
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            borderRadius: 100,
            backgroundColor: "black",
            position: "absolute",
            bottom: 40,
            right: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
          activeOpacity={0.8}
          onPress={() => _addModalRef?.current?.show()}
        >
          <Svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M12 5V12V19M5 12H19"
              stroke="white"
              stroke-width="5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>
      <AddOrgModalWeb ref={_addModalRef} />
    </KeyboardAvoidingView>
  );
};

export default Organisations;
