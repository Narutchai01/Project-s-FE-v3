import React from "react";
import { View, Image, Text } from "react-native";
import { DiaryCardProps } from "@/interface/diaryCard";

export default function DiaryCard({ image, date, skinProblems, numberOfSpots, skinType }: DiaryCardProps) {
  return (
    <View className="bg-white shadow-2xl mb-4 rounded-xl w-[350px] h-[140px] self-center flex-row justify-center items-center">
      <Image source={{ uri: image }} className="w-[88px] h-[118px] rounded-lg ml-4 mr-6" />
      <View className="flex-1">
        <Text className="text-label4 font-semibold text-black">Date: {date}</Text>
        <Text className="text-label6 text-black">Skin Problems: {skinProblems}</Text>
        <Text className="text-label6 text-black">Number of Spots: {numberOfSpots}</Text>
        <Text className="text-label6 text-black">Skin Type: {skinType}</Text>
      </View>
    </View>
  );
}
