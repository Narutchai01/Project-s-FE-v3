import React from "react";
import { ActivityIndicator, View } from "react-native";

const Loading = () => {
  return (
    <View className="mt-12 flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#FF6F61" /> 
    </View>
  );
};

export default Loading;
