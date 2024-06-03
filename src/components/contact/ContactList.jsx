import { FlatList, StyleSheet, View } from "react-native";
import ContactItem from "./ContactItem";

const ContactList = ({ contacts, onLongPress }) => {
  const renderItem = ({ item }) => {
    return <ContactItem item={item} onLongPress={onLongPress} />;
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
