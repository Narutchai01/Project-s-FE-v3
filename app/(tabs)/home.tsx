import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { SkinAnalysisCard } from "@/components/SkinAnalysisCard";
import { PopularReviews } from "@/components/PopularReviews";
import { PopularSkincare } from "@/components/PopularSkincare";
import dayjs from "dayjs";
import { useCompare } from "@/context/CompareContext";

export default function SkincareScreen() {
  const today = dayjs();
  const day = today.date();
  const weekday = today.format("dddd");
  const month = today.format("MMM");
  const year = today.year();
  const { skincares } = useCompare();

  return (
    <ScrollView className="px-4 pt-8 bg-Snow flex-1">
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

      <PopularReviews />
      <PopularSkincare skincares={skincares} />
    </ScrollView>
  );
}
