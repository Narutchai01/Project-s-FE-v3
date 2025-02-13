import React from "react";
import { View, Text, Image } from "react-native";
import dayjs from "dayjs";

interface CompareDiaryProps {
  image: string;
  date: Date;
}

export default function CompareDiary({ image, date }: CompareDiaryProps) {
  const formattedDate = dayjs(date).format("DD/MM/YYYY");
  return (
    <View className="items-center bg-white shadow-md p-5 rounded-lg mx-2 w-[113px] h-[186px]">
      <View className="w-[88px] h-[118px] rounded-md ">
        <Image
          source={{ uri: image }}
          className="w-full h-full rounded-md object-cover "
        />
      </View>
      <Text className="text-label2 mt-2 self-start">Date</Text>
      <Text className="text-label2 mb-2 self-start">{formattedDate}</Text>
    </View>
  );
}
