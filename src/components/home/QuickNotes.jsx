import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const QuickNotes = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate("ContactScreen", {
          contactId: "000000000000000000000000", // 24 times 0
          name: "Quick Notes",
        })
      }
    >
      <View style={styles.quicknotes}>
        <Text style={styles.title}>Quick Notes</Text>
        <Text style={styles.details}>Add any dope here quickly</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: "#A5A6F64F",
  },
  quicknotes: {
    margin: 15,
  },
  title: {
    fontSize: 16,
    fontFamily: "WorkSans-Bold",
  },
  details: {
    fontSize: 16,
    fontFamily: "WorkSans-Regular",
  },
});

export default QuickNotes;
