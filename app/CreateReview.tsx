import React, { useState } from "react";
import { Text, View, FlatList, SafeAreaView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ReviewCard } from "@/components/Card";
import Loading from "@/components/Loading";
import { ButtonComponents } from "@/components/Buntton";
import { useRouter } from "expo-router";
import { useReview } from "@/context/ReviewContext"; 
import { useCompare } from "@/context/CompareContext";
import useLoading from "@/hook/useLoading";

export default function CreateSkincareScreen() {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const router = useRouter();
  const { setReview, setIsReview } = useReview();
  const {skincares} = useCompare();
  const {isLoading} = useLoading();


  const handleSelectItem = (id: number) => {
    setSelectedItems((prevSelectedItems) => {
      const isAlreadySelected = prevSelectedItems.includes(id);
      if (isAlreadySelected) {
        return prevSelectedItems.filter((item) => item !== id);
      } else {
        if (prevSelectedItems.length < 10) {
          return [...prevSelectedItems, id];
        } else {
          console.error("You can only select up to 10 items.");
          return prevSelectedItems;
        }
      }
    });
  };

  const handleCancel = () => {
    router.push("/CreateReviewPost");
    setSelectedItems([]); 
  };

  const handleConfirm = () => {
    const selectedSkincareData = skincares.filter((item) =>
      selectedItems.includes(item.id)
    );

    setReview(selectedSkincareData); 
    setIsReview(true);
    router.push("/CreateReviewPost"); 
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-Snow p-8">
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <ButtonComponents
            title="cancel"
            textSize="text-md font-semibold"
            onPress={handleCancel}
          />
          <ButtonComponents
            title="Confirm"
            className="bg-Bittersweet px-2 py-2 rounded-full"
            textSize="text-md font-semibold"
            onPress={handleConfirm}
          />
        </View>

        <View className="flex items-center mb-4">
          <Text className="text-Heading3 font-semibold text-center">
            Select skincares to review ({selectedItems.length}/10)
          </Text>
        </View>

        {isLoading ? (
          <Loading /> 
        ) : (
          <FlatList
            data={skincares}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ReviewCard
                key={item.id}
                data={item}
                selectMode={true} 
                selectItem={handleSelectItem}
                selectArray={selectedItems} 
              />
            )}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
