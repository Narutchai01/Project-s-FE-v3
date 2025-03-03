import React, { useEffect, useState } from "react";
import { Text, View, FlatList, SafeAreaView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ReviewCard } from "@/components/Card";
import { axiosInstance } from "@/lib/axios_instance";
import { ISkincare } from "@/interface/skincare";
import Loading from "@/components/Loading";
import { ButtonComponents } from "@/components/Buntton";
import { useRouter } from "expo-router";
import { useReview } from "@/context/ReviewContext"; 

export default function CreateSkincareScreen() {
  const [skincareItems, setSkincareItems] = useState<ISkincare[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const router = useRouter();
  const { setReview, setIsReview, setSkincare } = useReview();

  const fetchSkincareItems = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/skincare");
      if (response.data.status) {
        setSkincareItems(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching skincare items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkincareItems(); 
  }, []);

  useEffect(() => {
    const selectedSkincareData = skincareItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    setSkincare(selectedSkincareData); 
  }, [selectedItems, skincareItems, setSkincare]); 

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
    const selectedSkincareData = skincareItems.filter((item) =>
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

        {loading ? (
          <Loading /> 
        ) : (
          <FlatList
            data={skincareItems}
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
