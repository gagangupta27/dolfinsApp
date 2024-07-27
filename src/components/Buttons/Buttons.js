import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import React from "react";

const Buttons = ({
  text = "",
  onPress = () => {},
  isInverse = false,
  noBorder = false,
  fontSize = 14,
  disabled = false,
  textColor = "",
  loading = false,
  imageIcon = null,
  containerStyle = {},
  marginBottom = 0,
  iconStyle = {},
  textTransform = "capitalize",
  textStyle = {},
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.buttonContainer(isInverse, noBorder),
        containerStyle,
        marginBottom,
      ]}
      onPress={loading ? () => {} : onPress}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={[
              styles.buttontext(isInverse, textColor, textTransform, fontSize),
              textStyle,
            ]}
          >
            {text}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Buttons;

const styles = StyleSheet.create({
  buttonContainer: (isInverse, noBorder) => ({
    backgroundColor: isInverse ? "#FFFFFF" : "#212427",
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: noBorder ? "transparent" : "rgba(33, 36, 39, 0.16)",
    borderRadius: 8,
    marginBottom: 8,
  }),
  buttontext: (isInverse, textColor, textTransform, fontSize) => ({
    color: textColor ? textColor : isInverse ? "black" : "white",
    textTransform: textTransform,
    fontSize: fontSize,
    fontWeight: "bold",
    lineHeight: 20,
  }),
});
