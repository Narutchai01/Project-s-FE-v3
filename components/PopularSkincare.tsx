import React, { FC, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { ISkincare } from "@/interface/skincare";
import { CardSkincare } from "./Card";
import { router, useRouter } from "expo-router";
import { ModalSkincareDetail } from "./Modal";
import { useSkincareStore } from "@/store/skincare";

interface PopularSkincareProps {
  skincares: ISkincare[] | null;
}

export const PopularSkincare: FC<PopularSkincareProps> = (props) => {
  const { skincares } = props;
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const { setSkincare } = useSkincareStore();

  const handleSelectSkincare = (item: ISkincare) => {
    setSkincare(item);
    setModalVisible(true);
  };

  return (
    <View className="mt-8 mb-4">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-Heading3">Popular Skincare</Text>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => router.push("/popularSkincare")}
        >
          <Text className="text-label2 text-gray-500">see more</Text>
          <ChevronRight size={16} color="gray" />
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={skincares}
        keyExtractor={(item) => item.id.toString()} 
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectSkincare(item)}>
            <CardSkincare image={item.image} name={item.name} />
          </TouchableOpacity>
        )}
      />

        <ModalSkincareDetail
          isOpen={modalVisible}
          onClose={() => setModalVisible(false)}
        />
    </View>
  );
};
