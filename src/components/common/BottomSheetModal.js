import Animated, {
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  runOnJS,
  useAnimatedKeyboard,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import React, { useState } from "react";

import { debounce } from "../../utils/common";
import { useSelector } from "react-redux";

export default React.forwardRef(
  (
    {
      restrictClose = false,
      START_PERC = 0,
      children = [],
      BottomStuckComp = [],
      BottomStuckCompStyle = {},
      containerStyle = {},
      touchContainerStyle = {},
      hideLine = false,
      extraOffset = 0,
      ignoreKeyboardOpen = false,
      disbaleGesture = false,
    },
    ref
  ) => {
    let ScreenHeight = Dimensions.get("screen").height;
    const [bottomStuckVisible, setBottomStuckVisible] = useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const offsetY = useSharedValue(ScreenHeight);
    const layoutHeight = useSharedValue(0);
    const keyboard =
      Platform.OS == "web" ? { height: { value: 0 } } : useAnimatedKeyboard();

    const isDark = useSelector((state) => state.app.isDark);

    React.useImperativeHandle(
      ref,
      () => ({
        show,
        hide,
        onFinalizeChange,
      }),
      [showModal]
    );

    const onFinalizeChange = async () => {
      if (layoutHeight?.value > ScreenHeight) {
        if (
          offsetY?.value <
          -layoutHeight?.value + ScreenHeight + ScreenHeight * 0.25
        ) {
          offsetY.value = withTiming(-layoutHeight?.value + ScreenHeight);
        } else if (offsetY?.value > ScreenHeight * 0.65) {
          offsetY.value = withTiming(ScreenHeight, {}, () => {
            runOnJS(setShowModal)(false);
          });
        }
      } else {
        if (offsetY?.value > ScreenHeight - layoutHeight?.value / 2) {
          offsetY.value = withTiming(ScreenHeight, {}, () => {
            runOnJS(setShowModal)(false);
          });
        } else {
          offsetY.value = withTiming(-layoutHeight?.value + ScreenHeight);
        }
      }
    };

    const debouncedOnFinalizeChange = debounce(onFinalizeChange, 100);

    useAnimatedReaction(
      () => layoutHeight?.value,
      (res, prev) => {
        if (res - prev > prev * 0.05 || prev - res > res * 0.05) {
          offsetY.value = withTiming(
            layoutHeight?.value > ScreenHeight * 0.7
              ? ScreenHeight * (1 - START_PERC)
              : ScreenHeight - layoutHeight?.value
          );
        } else {
          runOnJS(debouncedOnFinalizeChange)();
        }
      },
      []
    );

    const show = () => {
      setShowModal(true);
      setBottomStuckVisible(true);
      offsetY.value = withTiming(
        layoutHeight?.value > ScreenHeight * 0.7
          ? ScreenHeight * (1 - START_PERC)
          : ScreenHeight - layoutHeight?.value
      );
    };

    const hide = (onClose = () => {}) => {
      setBottomStuckVisible(false);
      offsetY.value = withTiming(ScreenHeight, {}, () => {
        runOnJS(setShowModal)(false);
        try {
          runOnJS(onClose)();
        } catch (err) {
          console.log("err", err);
        }
      });
    };

    const pan = Gesture.Pan()
      .onBegin((event) => {})
      .onChange((event) => {
        if (!disbaleGesture) {
          if (layoutHeight?.value > ScreenHeight) {
            if (offsetY?.value + event.changeY < 0) {
              if (
                offsetY?.value + event.changeY >
                -layoutHeight?.value + ScreenHeight
              ) {
                offsetY.value += event.changeY;
              }
            } else {
              offsetY.value += event.changeY;
            }
          } else {
            if (
              offsetY?.value + event.changeY >
              ScreenHeight - layoutHeight?.value
            ) {
              if (offsetY?.value + event.changeY < 0) {
                if (
                  offsetY?.value + event.changeY >
                  -layoutHeight?.value + ScreenHeight
                ) {
                  offsetY.value += event.changeY;
                }
              } else {
                offsetY.value += event.changeY;
              }
            }
          }
        }
      })
      .onFinalize((event) => {
        if (layoutHeight?.value > ScreenHeight) {
          if (
            offsetY?.value <
            -layoutHeight?.value + ScreenHeight + ScreenHeight * 0.25
          ) {
            offsetY.value = withTiming(-layoutHeight?.value + ScreenHeight);
          } else if (offsetY?.value > ScreenHeight * 0.65) {
            offsetY.value = withTiming(ScreenHeight, {}, () => {
              runOnJS(setShowModal)(false);
            });
          }
        } else {
          if (offsetY?.value > ScreenHeight - layoutHeight?.value / 2) {
            offsetY.value = withTiming(ScreenHeight, {}, () => {
              runOnJS(setShowModal)(false);
            });
          } else {
            offsetY.value = withTiming(-layoutHeight?.value + ScreenHeight);
          }
        }
      });

    const animatedStyles = useAnimatedStyle(() => ({
      top:
        offsetY?.value -
        (ignoreKeyboardOpen ? 0 : keyboard.height?.value) +
        extraOffset,
    }));

    return (
      <Modal
        visible={showModal}
        animationType={"none"}
        onRequestClose={restrictClose ? () => {} : hide}
        transparent
        statusBarTranslucent={true}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            outline: "none",
          }}
          onPress={restrictClose ? () => {} : hide}
        >
          <GestureDetector gesture={pan}>
            <Animated.View
              style={[
                {
                  width: "100%",
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  backgroundColor: isDark ? "#181b1a" : "white",
                  position: "absolute",
                  overflow: "hidden",
                  paddingBottom: 20,
                  top: ScreenHeight,
                },
                animatedStyles,
                containerStyle,
              ]}
            >
              <TouchableOpacity
                style={[
                  {
                    flex: 1,
                    overflow: "hidden",
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    outline: "none",
                  },
                  touchContainerStyle,
                ]}
                onLayout={(data) => {
                  layoutHeight.value = data.nativeEvent.layout.height;
                }}
                onPress={() => {
                  Keyboard.dismiss();
                }}
                activeOpacity={1}
              >
                {!hideLine && (
                  <View
                    style={{
                      marginVertical: 7,
                      backgroundColor: "#D9D9D9",
                      height: 3,
                      width: 87,
                      alignSelf: "center",
                      borderRadius: 30,
                    }}
                  ></View>
                )}
                {children}
              </TouchableOpacity>
            </Animated.View>
          </GestureDetector>
        </TouchableOpacity>
        {bottomStuckVisible && (
          <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            style={[
              {
                position: "absolute",
                bottom: 0,
                width: "100%",
                backgroundColor: isDark ? "#181b1a" : "white",
                zIndex: 100,
              },
              BottomStuckCompStyle,
            ]}
          >
            {BottomStuckComp}
          </Animated.View>
        )}
      </Modal>
    );
  }
);
