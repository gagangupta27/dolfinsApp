import { CARD_NAME, EVENTS, useTrackWithPageInfo } from "../../utils/analytics";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

import { useNavigation } from "@react-navigation/native";

const OrganisationItem = ({
  item,
  setOrganisation,
  onLongPress,
  showPin = false,
  showFav = false,
  onFavPress = () => {},
  onPinPress = () => {},
}) => {
  const track = useTrackWithPageInfo();

  const navigation = useNavigation();

  const onPress = () => {
    track(EVENTS.CARD_TAPPED.NAME, {
      [EVENTS.CARD_TAPPED.KEYS.CARD_NAME]: CARD_NAME.NOTE_PAGE,
      [EVENTS.CARD_TAPPED.KEYS.CARD_IDENTIFIER]: item.name,
    });

    navigation.navigate("ContactScreen", {
      contactId: item._id.toHexString(),
      setContact: setContact,
    });
  };
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={() => onLongPress(item)}
    >
      <View style={styles.organisationbase}>
        <Text style={styles.notedetails}>{item.name}</Text>
      </View>

      {(showFav || showPin) && (
        <View style={styles.rightBox}>
          {showFav && (
            <TouchableOpacity onPress={onFavPress}>
              <Svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={item?.isFavourite ? "red" : "none"}
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11.9932 5.13581C9.9938 2.7984 6.65975 2.16964 4.15469 4.31001C1.64964 6.45038 1.29697 10.029 3.2642 12.5604C4.89982 14.6651 9.84977 19.1041 11.4721 20.5408C11.6536 20.7016 11.7444 20.7819 11.8502 20.8135C11.9426 20.8411 12.0437 20.8411 12.1361 20.8135C12.2419 20.7819 12.3327 20.7016 12.5142 20.5408C14.1365 19.1041 19.0865 14.6651 20.7221 12.5604C22.6893 10.029 22.3797 6.42787 19.8316 4.31001C17.2835 2.19216 13.9925 2.7984 11.9932 5.13581Z"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          )}
          {showPin && (
            <TouchableOpacity style={{ paddingLeft: 10 }} onPress={onPinPress}>
              <Svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={item?.isPinned ? "black" : "none"}
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M8.3767 15.6163L2.71985 21.2732M11.6944 6.64181L10.1335 8.2027C10.0062 8.33003 9.94252 8.39369 9.86999 8.44427C9.80561 8.48917 9.73616 8.52634 9.66309 8.555C9.58077 8.58729 9.49249 8.60495 9.31592 8.64026L5.65145 9.37315C4.69915 9.56361 4.223 9.65884 4.00024 9.9099C3.80617 10.1286 3.71755 10.4213 3.75771 10.7109C3.8038 11.0434 4.14715 11.3867 4.83387 12.0735L11.9196 19.1592C12.6063 19.8459 12.9497 20.1893 13.2821 20.2354C13.5718 20.2755 13.8645 20.1869 14.0832 19.9928C14.3342 19.7701 14.4294 19.2939 14.6199 18.3416L15.3528 14.6771C15.3881 14.5006 15.4058 14.4123 15.4381 14.33C15.4667 14.2569 15.5039 14.1875 15.5488 14.1231C15.5994 14.0505 15.663 13.9869 15.7904 13.8596L17.3512 12.2987C17.4326 12.2173 17.4734 12.1766 17.5181 12.141C17.5578 12.1095 17.5999 12.081 17.644 12.0558C17.6936 12.0274 17.7465 12.0048 17.8523 11.9594L20.3467 10.8904C21.0744 10.5785 21.4383 10.4226 21.6035 10.1706C21.7481 9.95025 21.7998 9.68175 21.7474 9.42348C21.6875 9.12813 21.4076 8.84822 20.8478 8.28839L15.7047 3.14526C15.1448 2.58543 14.8649 2.30552 14.5696 2.24565C14.3113 2.19329 14.0428 2.245 13.8225 2.38953C13.5705 2.55481 13.4145 2.91866 13.1027 3.64636L12.0337 6.14071C11.9883 6.24653 11.9656 6.29944 11.9373 6.34905C11.9121 6.39313 11.8836 6.43522 11.852 6.47496C11.8165 6.51971 11.7758 6.56041 11.6944 6.64181Z"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#A5A6F62B",
    paddingRight: 10,
  },
  rightBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  organisationbase: {
    // backgroundColor: "#A5A6F62B",
    justifyContent: "center",
    padding: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  organisationdetails: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  organisationName: {
    color: "#000000",
    fontSize: 16,
    // fontWeight: 600, // 'normal' is not a valid value in React Native, '400' is equivalent to normal
    fontFamily: "WorkSans-Bold", // You will need to include the font in your project
  },
  notecontainer: {
    paddingTop: 2,
    paddingBottom: 2,
    flexDirection: "row",
    justifyContent: "space-between", // This will position the children at either end
  },
  notedetails: {
    color: "black",
    fontSize: 16,
    // fontWeight: 600, // 'normal' is not a valid value in React Native, '400' is equivalent to normal
    fontFamily: "WorkSans-Regular", // You will need to include the font in your project
    flex: 1, // Take up all available space
    marginRight: 5, // Add some margin between text input and button
  },
  notelastupdated: {
    color: "#000000",
    fontSize: 16,
    // fontWeight: 600, // 'normal' is not a valid value in React Native, '400' is equivalent to normal
    fontFamily: "WorkSans-Regular", // You will need to include the font in your project
  },
});

export default OrganisationItem;
