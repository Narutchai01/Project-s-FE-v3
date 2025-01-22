import React from "react";
import { View, Text } from "react-native";

const DividerWithText = () => {
  return (
    <View className="flex-row items-center my-4">
      <View className="flex-1 h-px bg-gray-300" />
      <Text className="mx-4 text-gray-500">Or</Text>
      <View className="flex-1 h-px bg-gray-300" />
    </View>
  );
};

export default DividerWithText;
