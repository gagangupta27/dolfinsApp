import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useQuery, useRealm } from "@realm/react";

import AntDesign from "@expo/vector-icons/AntDesign";
import Modal from "react-native-modal";
import QuickNotes from "../../components/home/QuickNotes";
import { useNavigation } from "@react-navigation/native";
import Organisation from "../../realm/models/Organisation";
import OrganisationList from "../../components/organisation/OrganisationList";
import { deleteOrganisation } from "../../realm/queries/organisationOperations";

const SearchBar = ({ search, text, setText }) => {
  useEffect(() => {
    search(text);
  }, [text]);

  return (
    <View style={styles.searchbar}>
      <AntDesign
        style={{ marginRight: 10 }}
        name="search1"
        size={20}
        color="#A5A6F6"
      />
      <TextInput
        style={{ flex: 1 }}
        placeholder="Search"
        value={text}
        onChangeText={setText}
      />
      {text.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            setText("");
            search("");
          }}
        >
          <Text style={{ color: "black", paddingLeft: 10 }}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const OrganisationTab = ({ route }) => {
  const realm = useRealm();

  const [text, setText] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [searchListData, setSearchListData] = useState([]);

  const navigation = useNavigation();
  const settingOrg = useRef();

  const organisations = useQuery(
    Organisation,
    (tasks) => {
      return tasks.sorted([
        ["isPinned", true],
        ["name", false],
      ]);
    },
    []
  );

  const [settingModalVisible, setSettingModalVisible] = useState(false);

  const delOrg = async () => {
    deleteOrganisation(realm, settingOrg.current?._id);
    setSettingModalVisible(false);
  };

  const handleLongPress = (item) => {
    settingOrg.current = item;
    setSettingModalVisible(true);
  };

  const handleCloseModal = () => {
    settingOrg.current = null;
    setSettingModalVisible(false);
  };

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

  const onFavPress = (item) => {
    realm.write(() => {
      realm.create(
        "Organisation",
        { ...item, isFavourite: !item?.isFavourite },
        "modified"
      );
    });
  };

  const onPinPress = (item) => {
    realm.write(() => {
      realm.create(
        "Organisation",
        { ...item, isPinned: !item?.isPinned },
        "modified"
      );
    });
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={64}
      behavior="padding"
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <SearchBar search={search} text={text} setText={setText} />
        <View style={{ flex: 1 }}>
          <QuickNotes />
          <OrganisationList
            organisations={text?.length > 0 ? searchListData : organisations}
            onLongPress={handleLongPress}
            onFavPress={onFavPress}
            onPinPress={onPinPress}
          />
        </View>
        <Modal
          isVisible={settingModalVisible}
          onBackdropPress={handleCloseModal}
          backdropColor="rgba(0, 0, 0, 0.8)" // semi-transparent black
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 5,
              borderRadius: 5,
              ...styles.shadow,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                delOrg();
                handleCloseModal();
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 5,
                }}
              >
                <AntDesign name="delete" size={24} color="black" />
                <Text
                  style={{
                    marginLeft: 5,
                    fontSize: 16,
                    fontFamily: "WorkSans-Medium",
                    letterSpacing: -0.32,
                  }}
                >
                  Delete
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  searchbar: {
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 15,
    marginTop: 5,
    marginBottom: 5,
    marginHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default OrganisationTab;
