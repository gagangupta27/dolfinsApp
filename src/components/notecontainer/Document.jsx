import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Entypo } from "@expo/vector-icons";

const Document = ({ document, onRemoveDoc = () => {}, showRemove = false }) => {
  return (
    <View style={styles.container}>
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyItems: "center",
            alignItems: "center",
            margin: 10,
            width: 24,
            height: 34,
            borderTopLeftRadius: 2,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 2,
            borderBottomRightRadius: 2,
            backgroundColor: "#000",
          }}
        >
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 10,
              color: "white",
              flex: 1,
              padding: 2,
            }}
          >
            PDF
          </Text>
        </View>
      </View>
      <Text style={styles.text}>{document.documentName}</Text>
      {showRemove && (
        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            borderRadius: 100,
            alignItems: "center",
            justifyContent: "center",
            alignContent: "center",
            position: "absolute",
            top: -3,
            right: -3,
          }}
          onPress={onRemoveDoc}
        >
          <Entypo name="cross" size={20} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: "nowrap",
    padding: 5,
    backgroundColor: "rgba(255, 255, 255, 0.48)",
    width: "80%",
    borderRadius: 20,
    height: 61,
  },
  text: {
    flex: 1,
  },
});
export default Document;
