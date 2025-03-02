import React, { FC } from "react";
import { View, Text,TouchableOpacity ,FlatList } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { ISkincare } from "@/interface/skincare";
import { CardSkincare } from "./Card";

interface PopularSkincareProps {
  skincares: ISkincare[] | null;
}

export const PopularSkincare :FC<PopularSkincareProps> = (props) =>{
  const { skincares } = props;

  return (
    <View className="mt-8 mb-4">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-Heading3">Popular Skincare</Text>
        <TouchableOpacity className="flex-row items-center">
          <Text className="text-label2 text-gray-500">see more</Text>
          <ChevronRight size={16} color="gray" />
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={skincares}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <CardSkincare
        image={item.image}
        name={item.name}
          />
        )}
      />
    </View>
  );
}
