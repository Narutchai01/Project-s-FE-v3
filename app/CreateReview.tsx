import React, { useEffect, useState } from "react"; 
import {
  Text,
  View,
  FlatList,
  SafeAreaView,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SelectSkincareCard } from "@/components/Card";
import { axiosInstance } from "@/lib/axios_instance"; 
import { ISkincare } from "@/interface/skincare";
import Loading from "@/components/Loading";

export default function PostThreadScreen() {
  const [skincareItems, setSkincareItems] = useState<ISkincare[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-Snow p-8">
        <View className="flex items-center mb-4">
          <Text className="text-Heading3 font-semibold text-center">
            Select skincares to post
          </Text>
        </View>

        {loading ? (
          <Loading /> 
        ) : (
          <FlatList
            data={skincareItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <SelectSkincareCard
                name={item.name}
                image={item.image}
              />
            )}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
