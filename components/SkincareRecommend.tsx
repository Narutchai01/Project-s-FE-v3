import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";

export default function SkincareRecommendComponent() {
  const [expanded, setExpanded] = useState(false);
  const skincareItems = expanded ? 6 : 3;

  return (
    <View className="px-4">
      <View className="flex-row items-center justify-between mb-6">
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
          className={`flex ${
            expanded ? "flex-wrap w-full" : "flex-nowrap"
          } flex-row gap-1 mb-4`}
        >
          {Array(skincareItems)
            .fill(null)
            .map((_, index) => (
              <View
                key={index}
                className="rounded-2xl shadow bg-white w-[114px] h-[130px] mx-2 mb-4 relative overflow-hidden"
              >
                <Image
                  source={{
                    uri: "https://www.osdco.net/images/communities/content/knowledge/checklist/03-seven-week-old-puppy.jpg",
                  }}
                  className="w-full h-[115px] rounded-t-2xl object-cover"
                  style={{ borderBottomRightRadius: 32.5 }}
                />
                <View
                  className="absolute bottom-0 left-0 w-full h-[30px] bg-white px-2 flex items-start justify-center"
                  style={{ borderTopLeftRadius: 13, borderTopRightRadius: 10 }}
                >
                  <Text
                    className="text-label12 font-medium w-full"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Granactive Retinoid 5% Serum for Anti-Aging
                  </Text>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
