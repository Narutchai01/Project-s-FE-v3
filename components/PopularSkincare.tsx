import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";

const skincareImage =
  "https://www.osdco.net/images/communities/content/knowledge/checklist/03-seven-week-old-puppy.jpg";

export default function PopularSkincare() {
  const skincareList = Array(6).fill(skincareImage);

  return (
    <View className="mt-8 mb-4">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-Heading3">Popular Skincare</Text>
        <TouchableOpacity className="flex-row items-center">
          <Text className="text-label2 text-gray-500">see more</Text>
          <ChevronRight size={16} color="gray" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {skincareList.map((image, index) => (
          <View
            key={index}
            className="bg-white rounded-2xl shadow w-[115px] h-[130px] mx-2 mb-2 relative overflow-hidden"
          >
            <View
              key={index}
              className="w-full h-[115px] rounded-t-2xl object-cover"
            >
              <Image
                source={{ uri: image }}
                className="w-full h-full rounded-t-2xl object-cover"
                style={{ borderBottomRightRadius: 32.5 }}
              />
            </View>

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
      </ScrollView>
    </View>
  );
}
