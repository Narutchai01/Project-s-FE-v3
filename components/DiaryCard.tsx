import React, { FC } from "react";
import { View, Image, Text, Pressable } from "react-native";

interface DiaryCardProps {
  image: string;
  date: string;
  skinProblems: string;
  numberOfSpots: number;
  skinType: string;
  isSelected?: boolean;
  isCompareMode?: boolean;
  onPress?: () => void;
}

export const DiaryCard:FC<DiaryCardProps> = (props) => {
  const {
image,
  date,
  skinProblems,
  numberOfSpots,
  skinType,
  isSelected,
  isCompareMode,
  onPress,
  } = props;
  return (
    <Pressable onPress={onPress} disabled={!isCompareMode}>
      <View
        className={`${
          isCompareMode ? (isSelected ? "bg-Quartz" : "bg-white") : "bg-white"
        } shadow-2xl mb-4 rounded-xl w-[350px] h-[140px] self-center flex-row justify-center items-center p-2`}
      >
        <Image
          source={{ uri: image }}
          className="w-[88px] h-[118px] rounded-lg ml-4 mr-6"
        />
        <View className="flex-1">
          <Text
            className={`text-label4 font-semibold ${
              isSelected ? "text-white" : "text-black"
            }`}
          >
            Date: {date}
          </Text>
          <Text
            className={`text-label6 ${
              isSelected ? "text-white" : "text-black"
            }`}
          >
            Skin Problems: {skinProblems}
          </Text>
          <Text
            className={`text-label6 ${
              isSelected ? "text-white" : "text-black"
            }`}
          >
            Number of Spots: {numberOfSpots}
          </Text>
          <Text
            className={`text-label6 ${
              isSelected ? "text-white" : "text-black"
            }`}
          >
            Skin Type: {skinType}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
