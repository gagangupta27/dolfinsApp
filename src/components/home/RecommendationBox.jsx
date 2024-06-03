import { Entypo } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * 
 * This is not getting used but can be used.
 */
const RecommendationBox = ({
  recommendationBoxVisible,
  setRecommendationBoxVisible,
}) =>
  recommendationBoxVisible && (
    <View style={styles.recommendationBox}>
      <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
        <Text style={styles.recommendationTitle}>Recommended:</Text>
      </View>
      <TouchableOpacity
        style={{ position: "absolute", right: 4, top: 4 }}
        onPress={() => setRecommendationBoxVisible(false)}
      >
        <Entypo name="cross" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.recommendationMessage}>
        Bring in the people you are meeting with. We'll try to auto-fetch as
        much intel as possible
      </Text>
      <TouchableOpacity style={styles.connectButton}>
        <Text style={styles.connectButtonText}>Connect Calendar now</Text>
      </TouchableOpacity>
    </View>
  );
const styles = StyleSheet.create({
  recommendationBox: {
    marginHorizontal: 20, // Horizontal margin
    marginTop: 20, // Top margin, adjust as needed
    padding: 20, // Inner padding of the box
    backgroundColor: "#EDF5FA", // Background color for the box
    borderRadius: 6, // Rounded corners for the box
    shadowColor: "#000", // Shadow color
    shadowOffset: {
      width: 0, // Shadow offset width
      height: 2, // Shadow offset height
    },
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 6, // Shadow blur radius
    elevation: 5, // Elevation for Android
  },
  recommendationTitle: {
    fontSize: 16, // Font size for the title
    // fontWeight: 600, // Font weight for the title
    marginBottom: 4, // Space below the title
  },
  recommendationMessage: {
    fontSize: 14, // Font size for the message
    // fontWeight: 400, // Font weight for the message
    color: "#333", // Color for the message text
    marginBottom: 16, // Space below the message
  },
  connectButton: {
    backgroundColor: "#7879F1", // iOS blue color for the button
    paddingVertical: 8, // Vertical padding for the button
    paddingHorizontal: 10, // Horizontal padding for the button
    borderRadius: 6, // Rounded corners for the button
    shadowColor: "#000", // Shadow color for the button
    shadowOffset: {
      width: 0, // Shadow offset width for the button
      height: 2, // Shadow offset height for the button
    },
    shadowOpacity: 0.1, // Shadow opacity for the button
    shadowRadius: 4, // Shadow blur radius for the button
    elevation: 3, // Elevation for the button on Android
    width: "70%",
  },
  connectButtonText: {
    fontSize: 16, // Font size for button text
    // fontWeight: 600, // Font weight for button text
    color: "white", // Color for button text
    textAlign: "center", // Center the text inside the button
  },
});

export default RecommendationBox;
