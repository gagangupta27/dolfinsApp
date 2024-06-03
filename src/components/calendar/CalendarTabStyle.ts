import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  container: {
    margin: 0,
    flex: 1,
    paddingTop: 5,
  },
  item: {
    marginHorizontal: 5,
    marginTop: 5,
    marginBottom: 5,
    padding: 10,
    backgroundColor: "#A5A6F64F",
    flexDirection: "row",
  },
  title: {
    fontSize: 16,
    fontFamily: "WorkSans-Bold",
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
});

export default Styles;
