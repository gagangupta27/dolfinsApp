import {
  Linking,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useRef, useState } from "react";

import AddOrgModalWeb from "../../components/organisation/AddOrgModal.web";
import Feather from "@expo/vector-icons/Feather";
import Header from "../../components/common/Header";
import NewNoteContainerV2 from "../../components/notecontainer/NewNoteContainerV2.web";
import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

const OrganisationScreen = ({ route }) => {
  const [editMode, setEditMode] = useState({ editMode: false, id: null });
  const isDark = useSelector((state) => state.app.isDark);

  const noteRef = useRef(null);
  const _editOrgModal = useRef(null);

  const organisation = route?.params?.organisation || {};

  console.log("organisation", organisation);

  const summaryNote = organisation.summary
    ? [
        {
          _id: "summary",
          contactId: organisation._id,
          content: "*Summary* \n\n" + organisation.summary,
          mentions: [],
          type: "text",
          nonEditable: true,
          readOnly: true,
        },
      ]
    : [];

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (noteRef.current) {
          noteRef.current.unfocus();
        }
      }}
    >
      <View style={{ flex: 1, backgroundColor: isDark ? "#181b1a" : "#fff" }}>
        <Header
          rightIcons={() => (
            <TouchableOpacity
              style={[{ marginLeft: 8 }]}
              onPress={() =>
                _editOrgModal?.current?.show("Edit Organization", organisation)
              }
            >
              <Feather name="edit-2" size={24} color="#b0b0b0" />
            </TouchableOpacity>
          )}
          title={organisation?.name}
        />
        <View
          style={{
            padding: 24,
          }}
        >
          <View
            style={{
              padding: 16,
              backgroundColor: "#1f2221",
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "#b0b0b0",
              }}
            >
              {organisation?.name}
            </Text>
            <TouchableOpacity
              style={{
                paddingTop: 8,
              }}
              onPress={() => Linking.openURL(organisation?.linkedinUrl)}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "blue",
                }}
              >
                {organisation?.linkedinUrl}
              </Text>
            </TouchableOpacity>
            {Array.isArray(organisation?.links) &&
              organisation?.links?.length > 0 && (
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
                  {organisation?.links?.map((o, idx) => (
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
          </View>
        </View>
        <AddOrgModalWeb ref={_editOrgModal} />
        <NewNoteContainerV2
          ref={noteRef}
          addNote={() => {}}
          note={editMode.editMode && editMode.note}
          updateNote={() => {}}
          mentionHasInput={false}
          type={"organisation"}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default OrganisationScreen;
