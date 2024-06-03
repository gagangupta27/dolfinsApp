import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CARD_NAME, EVENTS, useTrackWithPageInfo } from "../../utils/analytics";

const ContactItem = ({ item, setContact, onLongPress }) => {
  const track = useTrackWithPageInfo();

  const navigation = useNavigation();

  const onPress = () => {
    track(EVENTS.CARD_TAPPED.NAME, {
      [EVENTS.CARD_TAPPED.KEYS.CARD_NAME]: CARD_NAME.DOPE_PAGE,
      [EVENTS.CARD_TAPPED.KEYS.CARD_IDENTIFIER]: item.name,
    });

    navigation.navigate("ContactScreen", {
      contactId: item._id.toHexString(),
      setContact: setContact,
    });
  };
  return (
    <TouchableOpacity onPress={onPress} onLongPress={() => onLongPress(item)}>
      <View style={styles.contactbase}>
        {item.tags && (
          <View style={styles.firstline}>
            <Text style={styles.tags}>{item.tags}</Text>
            <Text style={styles.status}>{item.contactstatus}</Text>
          </View>
        )}
        <View style={styles.contactdetails}>
          <Text style={styles.contactname}>{item.name}</Text>
          {item.contactposition && (
            <Text style={styles.contactposition}>{item.contactposition}</Text>
          )}
        </View>
        {item.notedetails && (
          <View style={styles.notecontainer}>
            <Text style={styles.notedetails}>{item.notedetails}</Text>
            <Text style={styles.notelastupdated}>{item.notelastupdated}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contactbase: {
    backgroundColor: "#A5A6F62B",
    justifyContent: "center",
    padding: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  firstline: {
    flexDirection: "row",
    justifyContent: "space-between", // This will position the children at either end
  },
  tags: {
    color: "#5D5FEF",
    fontSize: 12,
    // fontWeight: '400', // 'normal' is not a valid value in React Native, '400' is equivalent to normal
    lineHeight: 18,
    fontFamily: "WorkSans-Regular", // You will need to include the font in your project
  },
  status: {
    color: "#000000",
    fontSize: 12,
    // fontWeight: '400', // 'normal' is not a valid value in React Native, '400' is equivalent to normal
    lineHeight: 18,
    fontFamily: "WorkSans-Regular", // You will need to include the font in your project
  },
  contactdetails: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  contactname: {
    color: "#000000",
    fontSize: 16,
    // fontWeight: 600, // 'normal' is not a valid value in React Native, '400' is equivalent to normal
    fontFamily: "WorkSans-Bold", // You will need to include the font in your project
  },
  contactposition: {
    color: "#000000",
    fontSize: 16,
    // fontWeight: 600, // 'normal' is not a valid value in React Native, '400' is equivalent to normal
    fontFamily: "WorkSans-Regular", // You will need to include the font in your project
  },
  notecontainer: {
    paddingTop: 2,
    paddingBottom: 2,
    flexDirection: "row",
    justifyContent: "space-between", // This will position the children at either end
  },
  notedetails: {
    color: "#000000",
    fontSize: 16,
    // fontWeight: 600, // 'normal' is not a valid value in React Native, '400' is equivalent to normal
    fontFamily: "WorkSans-Regular", // You will need to include the font in your project
    flex: 1, // Take up all available space
    marginRight: 5, // Add some margin between text input and button
  },
  notelastupdated: {
    color: "#000000",
    fontSize: 16,
    // fontWeight: 600, // 'normal' is not a valid value in React Native, '400' is equivalent to normal
    fontFamily: "WorkSans-Regular", // You will need to include the font in your project
  },
});

export default ContactItem;
