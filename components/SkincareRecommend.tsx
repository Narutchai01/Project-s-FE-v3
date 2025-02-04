import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";

export default function SkincareRecommendComponent() {
  const [expanded, setExpanded] = useState(false);
  const skincareItems = expanded ? 6 : 3;

  return (
    <View>
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-Heading3">Recommended Skincare</Text>
        <TouchableOpacity onPress={() => setExpanded(!expanded)} className="flex-row items-center">
          <Text className="text-label2 text-gray-500 mr-1">
            {expanded ? "see less" : "see more"}
          </Text>
          {expanded ? <ChevronUp size={18} color="gray" /> : <ChevronDown size={18} color="gray" />}
        </TouchableOpacity>
      </View>

      <ScrollView horizontal={!expanded} showsHorizontalScrollIndicator={false} className="mb-6">
        <View className={`flex-row justify-around grid gap-4 ml-4   ${expanded ? "flex-wrap justify-around grid gap-4 " : ""}`}>
          {Array(skincareItems)
            .fill(null)
            .map((_, index) => (
              <View
                key={index}
                className={`rounded-lg shadow-lg mb-4 ${
                  expanded ? "w-[115px] h-[109px]" : "mr-4"
                }`}
              >
                <Image
                  source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf81PydDJjzDIgjSuK3A7ZaOWALBQlG3-_0g&s" }}
                  className="w-[115px] h-[109px] rounded-lg"
                />
                <Text className="text-label12 text-center mt-2 ">Granactive Retinoid 5%</Text>
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
