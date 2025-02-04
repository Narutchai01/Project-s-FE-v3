import React from "react";
import { View, Text, Image } from "react-native";

const skinProblems = [
  "Red marks",
  "Black marks",
  "Enlarged Pores",
  "Wrinkles",
  "Scars",
  "Dull Facial Skin",
  "Freckles and Dark Spots",
];

export default function SkinProblemComponent() {
  return (
    <View>
      <Text className="text-Heading4 font-semibold mb-2">Your Facial Skin Problems:</Text>
      <View className="flex-row flex-wrap justify-start mb-6">
        {skinProblems.map((problem, index) => (
          <View key={index} className="items-center w-[38px] h-[68px] mr-6">
            <Image
              source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf81PydDJjzDIgjSuK3A7ZaOWALBQlG3-_0g&s" }}
              className="w-10 h-10 rounded-full mb-1"
            />
            <Text className={`text-label6 ${problem === "Enlarged Pores" ? "font-bold text-black" : "text-gray-500"}`}>
              {problem}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
