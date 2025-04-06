import React from "react";
import { View, Text, Image, ScrollView, SafeAreaView } from "react-native";
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
    <SafeAreaView className="flex-1 bg-Snow p-6">
      <ScrollView>
        <View className="flex-row items-center mb-6">
          <Image
            source={require("../../assets/images/ucare-logo.png")}
            className="w-[18%] h-[65px] rounded-lg mr-4"
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
    </SafeAreaView>
  );
}
