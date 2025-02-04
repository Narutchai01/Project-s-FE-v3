import React from "react";
import { View, Text, Image } from "react-native";

const skinTypes = ["Normal Skin", "Dry Skin", "Combination Skin", "Oily Skin"];

export default function SkinTypeComponent() {
  return (
    <View>
      <Text className="text-Heading4 font-semibold mb-2">Your Skin Type:</Text>
      <View className="flex-row justify-start mb-4">
        {skinTypes.map((type, index) => (
          <View key={index} className="items-center w-[38px] h-[68px] mr-6">
            <Image
              source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf81PydDJjzDIgjSuK3A7ZaOWALBQlG3-_0g&s" }}
              className="w-10 h-10 rounded-full mb-1"
            />
            <Text className={`text-label6 ${type === "Combination Skin" ? "font-bold text-black" : "text-gray-400"}`}>
              {type}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
