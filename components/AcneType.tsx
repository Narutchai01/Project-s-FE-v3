import React from "react";
import { View, Text, Image } from "react-native";

const acneTypes = [
  "Blackheads",
  "Whiteheads",
  "Inflamed Acne",
  "Pimples with Pus",
  "Nodules",
  "Red Pimples",
];

export default function AcneTypeComponent() {
  return (
    <View className="ml-4">
      <Text className="text-Heading4 font-semibold mb-4">Your Acne Type:</Text>
      <View className="flex-row flex-wrap justify-start mb-4">
        {acneTypes.map((acne, index) => (
          <View key={index} className="w-[51px] h-[68px] flex items-center justify-start mr-2">
            <Image
              source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf81PydDJjzDIgjSuK3A7ZaOWALBQlG3-_0g&s" }}
              className={`w-10 h-10 rounded-full mb-2 ${acne === "Whiteheads" ? "border border-black" : ""}`}
              style={acne === "Whiteheads" ? { borderWidth: 1.5 } : {}}
            />
            <Text 
              className={`text-label6 text-center leading-tight ${acne === "Whiteheads" ? "font-bold text-black" : "text-gray-500"}`}
            >
              {acne}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
