import React from "react";
import { View, Text, Image } from "react-native";

interface CompareDiaryProps {
  image: string;
  date: string;
}

export default function CompareDiary({ image, date }: CompareDiaryProps) {
  return (
    <View className="items-center bg-white shadow-md p-2 rounded-lg mx-2 w-[113px] h-[186px]">
      <Image source={{ uri: image }} className="w-[88px] h-[118px] rounded-md" />
      <Text className="text-label2 mt-2">Date {date}</Text>
    </View>
  );
}