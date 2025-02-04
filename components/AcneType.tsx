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
    <View>
      <Text className="text-Heading4 font-semibold mb-2">Your Acne Type:</Text>
      <View className="flex-row flex-wrap justify-start mb-4">
        {acneTypes.map((acne, index) => (
          <View key={index} className="items-center w-[38px] h-[68px] mr-6">
            <Image
              source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf81PydDJjzDIgjSuK3A7ZaOWALBQlG3-_0g&s" }}
              className="w-10 h-10 rounded-full mb-1"
            />
            <Text className={`text-label6 ${acne === "Whiteheads" ? "font-bold text-black" : "text-gray-500"}`}>
              {acne}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
