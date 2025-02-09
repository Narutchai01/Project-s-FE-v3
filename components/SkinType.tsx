import React from "react";
import { View, Text, Image } from "react-native";

const skinTypes = ["Normal Skin", "Dry Skin", "Combination Skin", "Oily Skin"];

export default function SkinTypeComponent() {
  return (
    <View className="ml-4">
      <Text className="text-Heading4 font-semibold mb-4">Your Skin Type:</Text>
      <View className="flex-row justify-start mb-4">
        {skinTypes.map((type, index) => (
          <View key={index} className="w-[51px] h-[68px] flex items-center justify-start mr-2">
             <Image
              source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf81PydDJjzDIgjSuK3A7ZaOWALBQlG3-_0g&s" }}
              className={`w-10 h-10 rounded-full mb-2 ${type === "Combination Skin" ? "border border-black" : ""}`}
              style={type === "Combination Skin" ? { borderWidth: 1.5 } : {}}
            />
            <Text className={`text-label6 text-center leading-tight ${type === "Combination Skin" ? "font-bold text-black" : "text-gray-400"}`}>
              {type}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
