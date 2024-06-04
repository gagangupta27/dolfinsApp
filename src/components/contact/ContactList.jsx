import { FlatList, StyleSheet, View } from "react-native";

import ContactItem from "./ContactItem";

const ContactList = ({
  contacts,
  onLongPress,
  onFavPress = () => {},
  onPinPress = () => {},
}) => {
  const renderItem = ({ item }) => {
    return (
      <ContactItem
        showPin={true}
        showFav={true}
        item={item}
        onLongPress={onLongPress}
        onFavPress={() => onFavPress(item)}
        onPinPress={() => onPinPress(item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toHexString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 5,
  },
});

export default ContactList;
