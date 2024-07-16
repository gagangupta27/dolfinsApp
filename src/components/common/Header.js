import Animated, {
  FadeInRight,
  FadeOutRight,
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Header = ({
  title = "",
  hideBack = false,
  onBackPress,
  titleStyle = {},
  bottomComp = () => {},
  rightIconsContainer = {},
  leftIconsContainer = {},
  isSearchEnabled = false,
  setSearchText = () => {},
  seachProps = {},
  searchStyle = {},
  rightIcons = () => {},
  leftIcons = () => {},
  setIsSearch = () => {},
  isSearch = false,
  container = {},
  subConatinerStyle = {},
  isTitleCntered = false,
  isSearchForClientAndStylists = false,
  showShadow = true,
  leftTitleFontSize = 17,
}) => {
  const navigation = useNavigation();

  return (
    <View style={[showShadow && Styles.container, container]}>
      {isSearch && (
        <Animated.View
          entering={SlideInRight}
          exiting={SlideOutRight}
          style={[
            Styles.headerFlex,
            {
              paddingTop: useSafeAreaInsets().top,
              width: "100%",
              justifyContent: "flex-start",
            },
          ]}
        >
          <TouchableOpacity
            style={{
              paddingRight: 16,
            }}
            activeOpacity={0.8}
            onPress={() => {
              setIsSearch(false);
            }}
          >
            <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
          </TouchableOpacity>
          <TextInput
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              borderRadius: 4,
              padding: 12,
              ...searchStyle,
              flex: 1,
            }}
            onChangeText={(text) => setSearchText(text)}
            autoFocus
            {...seachProps}
          />
        </Animated.View>
      )}
      {!isSearch && (
        <Animated.View
          entering={FadeInRight}
          exiting={FadeOutRight}
          style={[
            Styles.headerFlex,
            { paddingTop: useSafeAreaInsets().top },
            subConatinerStyle,
          ]}
        >
          {leftIcons()}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {!hideBack && (
              <TouchableOpacity
                style={{
                  paddingRight: 16,
                }}
                activeOpacity={0.8}
                onPress={() => {
                  if (onBackPress) {
                    onBackPress();
                  } else {
                    navigation.goBack();
                  }
                }}
              >
                <MaterialIcons
                  name="arrow-back-ios-new"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            )}
            {!isTitleCntered && (
              <Text
                style={[
                  {
                    fontSize: leftTitleFontSize,
                    fontWeight: "900",
                    color: "#212427",
                  },
                  titleStyle,
                ]}
              >
                {title}
              </Text>
            )}
          </View>
          {isTitleCntered && (
            <Text
              style={[
                {
                  fontSize: leftTitleFontSize,
                  fontWeight: "900",
                  color: "#212427",
                },
                titleStyle,
              ]}
            >
              {title}
            </Text>
          )}

          <View
            style={[
              {
                flexDirection: "row",
                alignItems: "center",
              },
              rightIconsContainer,
            ]}
          >
            {isSearchForClientAndStylists ? (
              <>
                {isSearchEnabled && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setIsSearch(true)}
                  >
                    <MaterialIcons name="search" size={24} color="black" />
                  </TouchableOpacity>
                )}
                {rightIcons()}
              </>
            ) : (
              <>
                {rightIcons()}
                {isSearchEnabled && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setIsSearch(true)}
                  >
                    <MaterialIcons name="search" size={24} color="black" />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </Animated.View>
      )}
      {bottomComp()}
    </View>
  );
};

export default Header;

const Styles = StyleSheet.create({
  container: {
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    marginBottom: 5,
    backgroundColor: "#fff",
  },
  headerFlex: {
    padding: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
