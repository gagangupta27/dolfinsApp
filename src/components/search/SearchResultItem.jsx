import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MarkdownView } from "../../utils/markdown";

const SearchResultItem = ({ searchterm, name, note, onPress }) => {

  const getFormattedDate = (updatedAt) => {
    const date = new Date(updatedAt);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    return day + " " + month;
  };

  return (
    <TouchableOpacity style={styles.notecontainer} onPress={onPress}>
      <View>
        <Text
          style={{
            padding: 3,
            color: "#858585",
            fontFamily: "Inter-Bold",
            fontSize: 14,
          }}
        >
          {name}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            {note.content && (
              <MarkdownView style={styles.content}>{note.content}</MarkdownView>
            )}
          </View>
          {note.updatedAt && (
            <Text
              style={{
                maxWidth: 40,
                padding: 3,
                color: "#858585",
                fontFamily: "Inter-Regular",
                fontSize: 12,
              }}
            >
              {getFormattedDate(note.updatedAt)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notecontainer: {
    // padding:5
    // margin: 5,
    // padding: 10,
    // backgroundColor: '#A5A6F62B',
    // borderRadius: 5,
  },
  content: {
    flex: 1,
    padding: 3,
    color: "#000000",
    fontSize: 16,
    // fontWeight: '600', // 'normal' is not a valid value in React Native, '400' is equivalent to normal
    fontFamily: "WorkSans-Regular", // You will need to include the font in your project
  },
  item: {
    // justifyContent:'flex-end'
    alignItems: "flex-start",
    justifyContent: "center",
  },
  itemText: {
    paddingHorizontal: 6, // Vertical padding for each item
    marginHorizontal: 4,
    marginVertical: 2,
    backgroundColor: "#F8E6EF", // Border color for each item
    borderRadius: 5,
    height: 24,
    fontSize: 16, // Font size for item text
    color: "#000", // Text color for item text
  },
  tagsection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  tagnote: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  individualTag: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    backgroundColor: "#F8E6EF",
    borderRadius: 5,
    marginRight: 8,
    marginVertical: 5,
    paddingHorizontal: 4,
  },
  horizontalline: {
    marginVertical: 5,
    width: "100%",
    borderWidth: 1,
    borderColor: "#CACACB",
  },
});

export default SearchResultItem;
