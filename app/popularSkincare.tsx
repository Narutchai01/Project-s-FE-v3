import React, { useState } from "react";
import { CardPopularSkincare } from "@/components/Card";
import { useCompare } from "@/context/CompareContext";
import useLoading from "@/hook/useLoading";
import { ISkincare } from "@/interface/skincare";
import { SquareArrowLeft } from "lucide-react-native";
import {
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import LoadingIndicator from "@/components/Loading";
import { ModalSkincareDetail } from "@/components/Modal";
import { useSkincareStore } from "@/store/skincare";
import { useRouter } from "expo-router";

export default function PopularSkincare() {
  const router = useRouter();
  const { skincares } = useCompare();
  const { isLoading } = useLoading();
  const [modalVisible, setModalVisible] = useState(false);
  const { setSkincare } = useSkincareStore();

  const handleSelectSkincare = (item: ISkincare) => {
    setSkincare(item);
    setModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-Snow p-4">
      <View className="h-16 mb-4">
        <View className="h-full flex-row items-center justify-between">
          <TouchableOpacity
            className="flex flex-row gap-x-3 items-center"
            onPress={() => router.back()}
          >
            <SquareArrowLeft size={28} color="#4A4A4A" />
            <Text className="text-2xl font-semibold text-Quartz">
              Popular Skincare
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <FlatList
          key={"skincare-list"}
          numColumns={2}
          data={skincares}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectSkincare(item)}>
              <CardPopularSkincare image={item.image} name={item.name} />
            </TouchableOpacity>
          )}
          contentContainerStyle={{
            paddingHorizontal: 15,
            paddingBottom: 0,
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        />
      )}
      <ModalSkincareDetail
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}
