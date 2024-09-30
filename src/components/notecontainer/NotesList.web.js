import { FlatList, StyleSheet, View } from "react-native";

import NoteItem from "./NoteItem.web";
import { forwardRef } from "react";

const NotesList = forwardRef(
  (
    {
      notes = [],
      setEditMode,
      contact,
      onDelete,
      onPinPress = () => {},
      showPin = false,
      ListHeaderComponent = () => {},
    },
    ref
  ) => {
    const renderItem = ({ item }) => {
      return (
        <NoteItem
          note={item}
          setEditMode={setEditMode}
          contact={contact}
          onDelete={onDelete}
          showPin={showPin}
          onPinPress={() => {
            onPinPress(item);
          }}
        />
      );
    };

    return (
      <View style={styles.container}>
        <FlatList
          ref={ref}
          ListHeaderComponent={ListHeaderComponent}
          data={notes || []}
          renderItem={renderItem}
          keyExtractor={(item) => "keyss__" + item?._id}
          extraData={notes}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
  },
});

export default NotesList;
