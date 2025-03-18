import React, { FC, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { PopularThreadCard } from "@/components/Card";
import { useRouter } from "expo-router";
import useLoading from "@/hook/useLoading";
import { IReview } from "@/interface/review";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";
import LoadingIndicator from "@/components/Loading";

export const PopularReviews: FC = () => {
  const router = useRouter();
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [reviews, setReviews] = useState<IReview[] | null>(null);

  const fetchReviews = async () => {
    startLoading();
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.get("/reviews", {
        headers: { token },
      });

      if (res.data.status) {
        setReviews(res.data.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        console.log("Unauthorized");
      }
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReviews = (item: IReview) => {
    router.push(`/review/${item.id}`);
  };

  return (
    <View className="mt-8">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-Heading3">Popular Reviews</Text>
        <TouchableOpacity
         className="flex-row items-center"
         onPress={() => router.push("/(tabs)/community")}
         >
          <Text className="text-label2 text-gray-500">see more</Text>
          <ChevronRight size={16} color="gray" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={reviews}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleReviews(item)}>
              <PopularThreadCard
                image={item.image}
                title={item.title}
                user={item.user?.full_name}
                userAvatar={item.user?.image}
              />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};
