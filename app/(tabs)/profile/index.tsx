import React, { useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Image,
  Text,
} from "react-native";
import { router, Stack } from "expo-router";
import {
  AlignJustify,
  Bookmark,
  CopyPlus,
  MessageCircleQuestion,
} from "lucide-react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const [mode, setMode] = useState<"reviews" | "threads" | "bookmark">(
    "reviews"
  );

  const CustomHeader = () => (
    <View className="bg-Snow p-4 border-b-2 border-gray-300 mb-4 relative">
      <View className="flex flex-row justify-end items-center">
        <TouchableOpacity onPress={() => router.push("/setting")}>
          <AlignJustify size={24} />
        </TouchableOpacity>
      </View>

      <View className="items-center mt-8 mb-4">
        <Image className="w-24 h-24 rounded-full bg-gray-300" />

        <Text className="text-Heading3 mt-2">ByeWind</Text>

        <View className="flex flex-row justify-around w-1/2 mt-4">
          <View className="items-center">
            <Text className="text-card1 text-OldSilver">followers</Text>
            <Text className="text-card1 text-OldSilver">2</Text>
          </View>

          <View className="items-center">
            <Text className="text-card1 text-OldSilver">following</Text>
            <Text className="text-card1 text-OldSilver">222</Text>
          </View>
        </View>
      </View>

      <View className="flex flex-row items-center justify-around mt-4">
        <TouchableOpacity onPress={() => setMode("reviews")}>
          <View className="flex items-center relative">
            <CopyPlus size={34} />
            {mode === "reviews" && (
              <View className="absolute bottom-[-15px] w-full border-b-2 border-black" />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode("threads")}>
          <View className="flex items-center relative">
            <MessageCircleQuestion size={34} />
            {mode === "threads" && (
              <View className="absolute bottom-[-15px] w-full border-b-2 border-black" />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode("bookmark")}>
          <View className="flex items-center relative">
            <Bookmark size={34} />
            {mode === "bookmark" && (
              <View className="absolute bottom-[-15px] w-full border-b-2 border-black" />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => <CustomHeader />,
        }}
      />
      <SafeAreaView></SafeAreaView>
    </SafeAreaProvider>
  );
}
