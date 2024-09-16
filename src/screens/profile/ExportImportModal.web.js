import { ActivityIndicator, Alert, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import BottomSheetModal from "../../components/common/BottomSheetModal";
import Buttons from "../../components/Buttons/Buttons";

export default React.forwardRef(
  (
    {
      percentageProp = 0,
      showPercentage = true,
      hideCancel = false,
      containserStyle = {},
    },
    ref
  ) => {
    const [title, setTitle] = useState();
    const [loadingText, setLoadingText] = useState();
    const [percentage, setPercentage] = useState(0);
    const [loading, setLoading] = useState(false);

    const authData = useSelector((state) => state.app.authData);

    const dispatch = useDispatch();
    const _bottomSheetRef = useRef();

    React.useImperativeHandle(
      ref,
      () => ({
        hide,
        showLoading,
      }),
      []
    );

    useEffect(() => {
      setPercentage(percentageProp);
    }, [percentageProp]);

    const showLoading = async (title = "", loadingtext = "") => {
      setTitle(title);
      setLoading(true);
      setLoadingText(loadingtext);
      _bottomSheetRef?.current?.show();
      setPercentage(0);
    };

    const hide = () => {
      _bottomSheetRef?.current?.hide();
    };

    return (
      <BottomSheetModal
        MAX_HEIGHT_PERC={1}
        START_PERC={0.7}
        ref={_bottomSheetRef}
        ignoreKeyboardOpen={true}
        restrictClose={true}
        disbaleGesture={true}
      >
        <View
          style={[
            { paddingTop: 8, paddingBottom: 20, padding: 16 },
            containserStyle,
          ]}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
            }}
          >
            {title}
          </Text>
          {loading && (
            <ActivityIndicator
              style={{ paddingVertical: 20 }}
              color={"gray"}
              size="large"
            />
          )}
          <Text
            style={{
              fontSize: 13,
              textAlign: "center",
            }}
          >
            {loadingText}
          </Text>
          {showPercentage && (
            <Text
              style={{
                fontSize: 13,
                textAlign: "center",
                marginTop: 20,
              }}
            >
              {`${percentage}%`}
            </Text>
          )}
          {!hideCancel && (
            <Buttons
              text="Cancel"
              containerStyle={{ width: "100%", marginTop: 50 }}
              onPress={hide}
            />
          )}
        </View>
      </BottomSheetModal>
    );
  }
);
