import React from "react";
import { View, Text, Image, ScrollView} from "react-native";
import SkinAnalysisCard from "@/components/SkinAnalysisCard";
import PopularThreads from "@/components/PopularThreads";
import PopularSkincare from "@/components/PopularSkincare";

export default function SkincareScreen() {
  const today = new Date();
  const day = today.getDate();
  const weekday = today.toLocaleDateString("en-US", { weekday: "long" });
  const month = today.toLocaleDateString("en-US", { month: "short" });
  const year = today.getFullYear();

  return (
    <ScrollView className="px-4 pt-8 bg-Snow">
      <View className="flex-row items-center mb-6">
        <Image
          source={require("../../assets/images/ucare-logo.png")}
          className="w-[55px] h-[65px] rounded-lg mr-4"
        />
        <View>
          <Text className="text-Heading3">
            {day} {weekday}
          </Text>
          <Text className="text-Heading3">
            {month} {year}
          </Text>
        </View>
      </View>

      <SkinAnalysisCard />
      <PopularThreads />
      <PopularSkincare />
    </ScrollView>
  );
}
