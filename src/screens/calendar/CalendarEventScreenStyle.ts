import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  container: {
    margin: 0,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: "WorkSans-Bold",
    padding: 1,
  },
  description: {
    fontSize: 12,
    fontFamily: "WorkSans-Regular",
    padding: 1,
  },
  time: {
    fontSize: 12,
    fontFamily: "WorkSans-Regular",
    padding: 1,
  },
  calendarIcon: {
    paddingLeft: 0,
    paddingRight: 10,
    paddingVertical: 5,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  navBar: {
    height: 50, // Fixed height for the navbar
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF", // Assuming a white navbar
    borderBottomWidth: 1, // Add a bottom border
    borderBottomColor: "#E8E8E8", // Light grey color for the bottom border
  },
  navTitle: {
    // fontWeight: '600', // Bold font for the title
    fontSize: 18, // Font size for the title
    color: "#000", // Assuming the title is black,
    paddingLeft: 10,
  },
  iconsContainer: {
    flexDirection: "row", // Layout icons horizontally
  },
  iconButton: {},
  box: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 8,
    flexDirection: "row",
  },
});

export default Styles;
