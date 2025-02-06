import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";

export default function SkincareRecommendComponent() {
  const [expanded, setExpanded] = useState(false);
  const skincareItems = expanded ? 6 : 3;

  return (
    <View className="px-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-Heading3 font-bold">Recommended Skincare</Text>
        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          className="flex-row items-center"
        >
          <Text className="text-label2 text-gray-500 mr-1">
            {expanded ? "see less" : "see more"}
          </Text>
          {expanded ? (
            <ChevronUp size={18} color="gray" />
          ) : (
            <ChevronDown size={18} color="gray" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal={!expanded}
        showsHorizontalScrollIndicator={false}
        className={`mb-8 ${!expanded ? "pr-4" : ""}`}
      >
        <View
          className={`flex ${expanded ? "flex-wrap w-full" : "flex-nowrap"} flex-row gap-6 mb-2`}
        >
          {Array(skincareItems)
            .fill(null)
            .map((_, index) => (
              <View
                key={index}
                className="rounded-lg shadow bg-white overflow-hidden w-[115px] h-[140px]"
              >
                <Image
                  source={{
                    uri: "https://www.osdco.net/images/communities/content/knowledge/checklist/03-seven-week-old-puppy.jpg",
                  }}
                  className="w-[115px] h-[109px]"
                />
                <View className="w-full h-[31px] justify-center items-center">
                  <Text className="text-label12 text-center px-2">
                    Granactive Retinoid 5%
                  </Text>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
