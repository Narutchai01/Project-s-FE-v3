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
    <View className="ml-4">
      <Text className="text-Heading4 font-semibold mb-4">Your Facial Skin Problems:</Text>
      <View className="flex-row flex-wrap justify-start mb-8">
        {skinProblems.map((problem, index) => (
          <View key={index} className="w-[51px] h-[68px] flex items-center justify-start mr-2">
            <Image
              source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf81PydDJjzDIgjSuK3A7ZaOWALBQlG3-_0g&s" }}
              className={`w-10 h-10 rounded-full mb-2 ${problem === "Enlarged Pores" ? "border border-black" : ""}`}
              style={problem === "Enlarged Pores" ? { borderWidth: 1.5 } : {}}
            />
            <Text className={`text-label6 text-center leading-tight ${problem === "Enlarged Pores" ? "font-bold text-black" : "text-gray-500"}`}>
              {problem}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
