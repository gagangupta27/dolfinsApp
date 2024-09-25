import { Icon, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

import ExactTextBox from "../notecontainer/ExactTextBox";

const MultiInput = ({
  inputs = [""],
  setInputs = () => {},
  placeholder = "",
  addText = "",
}) => {
  const addInput = () => {
    setInputs([...inputs, ""]);
  };

  const handleInputChange = (text, index) => {
    const updatedInputs = inputs.map((input, i) =>
      i === index ? text : input
    );
    setInputs(updatedInputs);
  };

  return (
    <View>
      {inputs.map((input, index) => (
        <View key={index}>
          <ExactTextBox
            content={input}
            setContent={(text) => handleInputChange(text, index)}
            placeholder={placeholder}
            containerStyle={{
              marginTop: 10,
            }}
            rightIcons={() => (
              <TouchableOpacity
                style={{
                  padding: 10,
                }}
                activeOpacity={0.8}
                onPress={() => setInputs(inputs.filter((_, i) => i !== index))}
              >
                <Text
                  style={{
                    color: "#b0b0b0",
                  }}
                >
                  x
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ))}
      <TouchableOpacity
        style={{
          borderWidth: 1,
          width: "100%",
          padding: 16,
          borderRadius: 10,
          marginTop: 20,
          backgroundColor: "rgba(255, 255, 255, 0.17)",
        }}
        onPress={addInput}
      >
        <Text style={{ textAlign: "center", color: "#b0b0b0" }}>{addText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MultiInput;
