import { StyleSheet, Text, View } from "react-native";

const Document = ({ document }) => {
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
            backgroundColor: "#7879F1",
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
        {/* <Svg width="24" height="34" viewBox="0 0 24 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M0 2C0 0.89543 0.895431 0 2 0H14C19.5228 0 24 4.47715 24 10V32C24 33.1046 23.1046 34 22 34H2C0.89543 34 0 33.1046 0 32V2Z" fill="#7879F1"/>
            </Svg> */}
      </View>
      <Text style={styles.text}>{document.documentName}</Text>
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
    backgroundColor: "rgba(165, 166, 246, 0.48)",
    width: "80%",
    borderRadius: 20,
    height: 61,
  },
  text: {
    flex: 1,
  },
});
export default Document;
