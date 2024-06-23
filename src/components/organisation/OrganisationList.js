import { FlatList, StyleSheet, View } from "react-native";
import OrganisationItem from "./OrganisationItem";


const OrganisationList = ({
  organisations = [],
  onLongPress,
  onFavPress = () => {},
  onPinPress = () => {},
}) => {
  const renderItem = ({ item }) => {
    return (
      <OrganisationItem
        showPin={true}
        showFav={false}
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
        data={organisations}
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

export default OrganisationList;
