import {
  ActivityIndicator,
  InteractionManager,
  Modal,
  StyleSheet,
  View,
} from "react-native";

import React, { useState, useEffect } from "react";

const Loader = ({ loading = false }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      InteractionManager.runAfterInteractions(() => {
        return setIsLoading(true);
      });
    } else {
      setIsLoading(false);
    }
  }, [loading]);

  return (
    <Modal transparent animationType={"none"} visible={isLoading}>
      <View style={styles.modalBackground}>
        <ActivityIndicator animating={loading} color={"black"} size={80} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#00000050",
    zIndex: 100,
  },
});

export default Loader;
