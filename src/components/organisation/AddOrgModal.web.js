import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";

import Api from "../../utils/Api";
import BottomSheetModal from "../common/BottomSheetModal";
import ExactTextBox from "../notecontainer/ExactTextBox";
import { Ionicons } from "@expo/vector-icons";
import MultiInput from "../common/MultiInput";

const TEMP = [
  {
    id: 1,
    name: "Google",
    linkedinUrl: "https:google",
    links: ["https:googlrhwywgu"],
  },
  {
    id: 2,
    name: "NVDA",
    linkedinUrl: "https:google",
    links: ["https:googlrhwywgu"],
  },
];

export default React.forwardRef(({}, ref) => {
  const [name, setName] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [contacts, setContacts] = useState([]);
  const [links, setLinks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingOrg, setExistingOrg] = useState(null);

  const existingContacts = existingOrg ? [] : [];

  const _bottomSheetRef = useRef();

  React.useImperativeHandle(
    ref,
    () => ({
      show,
      hide,
    }),
    []
  );

  useEffect(() => {
    if (existingOrg) {
      setName(existingOrg?.name);
      setLinkedin(existingOrg?.linkedinUrl || "");
      setLinks(existingOrg?.links || []);
    } else {
      setName();
      setLinkedin();
      setLinks([]);
    }
  }, [existingOrg]);

  useEffect(() => {
    if (existingContacts && existingContacts?.length > 0) {
      setContacts([...existingContacts]);
    }
  }, [JSON.stringify(existingContacts)]);

  const show = (title = "Create New Organisation", existingOrg = null) => {
    setExistingOrg(existingOrg);
    setTitle(title);
    _bottomSheetRef?.current?.show();
  };

  const hide = () => {
    _bottomSheetRef?.current?.hide();
  };

  const onCreate = async () => {
    if (existingOrg) {
      // realm.write(() => {
      //   existingOrg.name = name;
      //   existingOrg.linkedinUrl = linkedin;
      //   existingOrg.links = new Set([...links]);
      // });
      // contacts?.forEach((contact) => {
      //   OrgContactLink(realm, String(existingOrg?._id), String(contact?._id));
      // });
    } else {
      if (name?.trim()?.length == 0) {
        Alert.alert("Error", "Please Enter Organisation Name!");
        return;
      }
      setLoading(true);
      Api.post("/api/1.0/user/organization/", {
        user_id: 1,
        name: name,
        linkedInUrl: linkedin,
        links: links,
      })
        .then((res) => {
          setLoading(false);
          console.log("res", res?.data);
          // return res?.data?.response || "";
          // setName("");
          // hide();
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error:", error);
        });
      // const linkedinProfileData = await fetchLinkedinData();
      // const createdOrg = await addOrganisation(realm, {
      //   name: name,
      //   linkedinUrl: linkedin,
      //   linkedinProfile: "",
      //   linkedinProfileData: JSON.stringify(linkedinProfileData),
      //   summary: "",
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      //   links: new Set([...links]),
      // });

      // contacts?.forEach((contact) => {
      //   OrgContactLink(realm, String(createdOrg?._id), String(contact?._id));
      // });
    }
  };

  const fetchLinkedinData = async () => {
    if (linkedin) {
      return Api.post("/api/1.0/user/linkedin-details", {
        profile_url: linkedin,
      })
        .then((res) => {
          return res?.data?.response || "";
        })
        .catch((error) => {
          console.error("Error:", error);
          return null;
        });
    } else {
      return "";
    }
  };

  return (
    <BottomSheetModal
      MAX_HEIGHT_PERC={1}
      START_PERC={0.7}
      ref={_bottomSheetRef}
      // ignoreKeyboardOpen={true}
      // restrictClose={true}
      // disbaleGesture={true}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 5000 }}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={hide}
            style={{
              outline: "none",
            }}
          >
            <Ionicons
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
              }}
              name="chevron-back"
              size={24}
              color="#b0b0b0"
            />
          </TouchableOpacity>
          <Text style={styles.createtext}>{title}</Text>
          <TouchableOpacity onPress={onCreate}>
            {loading && <ActivityIndicator />}
            {!loading && <Text style={styles.done}>Done</Text>}
          </TouchableOpacity>
        </View>
        <View style={styles.form}>
          <View style={{ height: 50, marginVertical: 10 }}>
            <ExactTextBox
              content={name}
              setContent={setName}
              placeholder="Name*"
            />
          </View>
          <View style={{ height: 50, marginVertical: 10 }}>
            <ExactTextBox
              content={linkedin}
              setContent={setLinkedin}
              placeholder="Linkedin Profile Url"
            />
          </View>
          <MultiInput
            inputs={links}
            setInputs={setLinks}
            addText="Add Additional Link"
            placeholder="Additional Links"
          />
        </View>
      </ScrollView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181b1a",
    marginTop: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  createtext: {
    fontSize: 20,
    fontFamily: "WorkSans-Bold",
    color: "#b0b0b0",
  },
  done: {
    fontSize: 20,
    fontFamily: "WorkSans-Bold",
    color: "#b0b0b0",
  },
  form: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
