import React from "react";
import { View, Text, Image } from "react-native";

interface CompareDiaryProps {
  image: string;
  date: string;
}

export default function CompareDiary({ image, date }: CompareDiaryProps) {
  return (
    <View className="items-center bg-white shadow-md p-5 rounded-lg mx-2 w-[113px] h-[186px]">
      <View className="w-[88px] h-[118px] rounded-md ">
      <Image source={{ uri: image }} className="w-full h-full rounded-md object-cover " />
      </View>
      <Text className="text-label2 mt-2 self-start">Date</Text>
      <Text className="text-label2 mb-2 self-start">{date}</Text>
    </View>
  );
}