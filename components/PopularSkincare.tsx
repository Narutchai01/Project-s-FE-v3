import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";

const skincareImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf81PydDJjzDIgjSuK3A7ZaOWALBQlG3-_0g&s";

export default function PopularSkincare() {
  const skincareList = Array(6).fill(skincareImage);

  return (
    <View className="mt-8">
     
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-Heading3">Popular Skincare</Text>
        <TouchableOpacity className="flex-row items-center">
          <Text className="text-label2 text-gray-500 mr-1">see more</Text>
          <ChevronRight size={16} color="gray" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {skincareList.map((image, index) => (
          <View key={index} className="bg-white rounded-2xl shadow w-[115px] h-[130px] mx-2 mb-2">
            <Image source={{ uri: image }} className="w-full h-[100px] rounded-t-lg" />
            <View className="p-2">
              <Text className="text-label12 font-medium">Granactive Retinoid 5%</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
