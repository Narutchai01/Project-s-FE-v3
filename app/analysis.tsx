import React from "react";
import { View, Image, ScrollView, TouchableOpacity } from "react-native";
import { BackButtonComponents } from "@/components/Buntton";
import { Share2 } from "lucide-react-native";
import SkinType from "@/components/SkinType";
import AcneType from "@/components/AcneType";
import SkinProblem from "@/components/SkinProblem";
import SkincareRecommend from "@/components/SkincareRecommend";

export default function AnalysisResultsScreen() {
  return (
    <ScrollView className="flex-1 bg-white p-4">
 
      <View className="flex-row items-center mb-4">
        <BackButtonComponents title="Analysis Results" textSize="text-Heading3 font-bold text-gray-700" />
        <TouchableOpacity className="ml-auto">
          <Share2 size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-center mb-6">
        <Image
          source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf81PydDJjzDIgjSuK3A7ZaOWALBQlG3-_0g&s" }}
          className="w-[183.11px] h-[236.77px] rounded-lg"
        />
      </View>

      <SkinType />
      <AcneType />
      <SkinProblem />
      <SkincareRecommend />
    </ScrollView>
  );
}