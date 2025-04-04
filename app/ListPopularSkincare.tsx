import React, { useState } from "react";
import { CardListPopularSkincare } from "@/components/Card";
import { useCompare } from "@/context/CompareContext";
import useLoading from "@/hook/useLoading";
import { ISkincare } from "@/interface/skincare";
import {
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import LoadingIndicator from "@/components/Loading";
import { ModalSkincareDetail } from "@/components/Modal";
import { useSkincareStore } from "@/store/skincare";
import { useRouter } from "expo-router";
import { BackButtonComponents } from "@/components/Buntton";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function ListPopularSkincare() {
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
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-Snow p-4">
        <View className="h-16 mb-2 bg-Snow -ml-2">
          <View className="h-full flex-row items-center justify-between px-3">
            <BackButtonComponents
              title={"Popular Skincare"}
              textSize="text-Heading3 text-Quartz"
              onPress={() => router.back()}
            />
          </View>
        </View>
        <View className="flex justify-center items-center mb-10">
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
                  <CardListPopularSkincare
                    image={item.image}
                    name={item.name}
                  />
                </TouchableOpacity>
              )}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginBottom: 15,
                paddingHorizontal: 5,
              }}
            />
          )}
        </View>

        <ModalSkincareDetail
          isOpen={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
