import React, { useState } from "react";
import { View, TextInput, Icon, TouchableOpacity, Text } from "react-native";
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
                <Text>x</Text>
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
        }}
        onPress={addInput}
      >
        <Text style={{ textAlign: "center" }}>{addText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MultiInput;
