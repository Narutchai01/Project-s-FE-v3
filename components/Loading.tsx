import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function Loading() {
  return (
    <View className="mt-12 flex-1 items-center justify-center">
      <ActivityIndicator size="large" className="text-Quartz" />
    </View>
  );
}
