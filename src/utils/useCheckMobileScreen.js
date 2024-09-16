import React, { useEffect, useState } from "react";

import { useWindowDimensions } from "react-native";

const useCheckMobileScreen = () => {
  const { width } = useWindowDimensions();

  return width <= 768;
};

export default useCheckMobileScreen;
