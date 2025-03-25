import React from "react";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { AlignJustify  } from "lucide-react-native";

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-Snow p-4">
      <TouchableOpacity 
      onPress={() => router.push("/setting")}
      >
        <AlignJustify />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
