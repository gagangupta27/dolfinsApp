import { forwardRef } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import NoteItem from "./NoteItem";

const NotesList = forwardRef(
  ({ notes, setEditMode, contact, onDelete }, ref) => {
    const renderItem = ({ item }) => {
      return (
        <NoteItem
          note={item}
          setEditMode={setEditMode}
          contact={contact}
          onDelete={onDelete}
        />
      );
    };

    return (
      <View style={styles.container}>
        <FlatList
          ref={ref}
          data={notes}
          renderItem={renderItem}
          keyExtractor={(item) => "keyss__" + item._id}
          extraData={notes}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 10,
  },
});

export default NotesList;
