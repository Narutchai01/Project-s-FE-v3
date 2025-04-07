import React, { FC, useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { PopularThreadCard } from "@/components/Card";
import { useRouter } from "expo-router";
import useLoading from "@/hook/useLoading";
import { IReview } from "@/interface/review";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";
import LoadingIndicator from "@/components/Loading";
import { AxiosError } from "axios";
import { ConfirmAlert } from "./Alert";

export const PopularReviews: FC = () => {
  const router = useRouter();
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [reviews, setReviews] = useState<IReview[] | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleError = (error: unknown) => {
    const axiosError = error as AxiosError;
  
    if (!alertVisible) {
      if (axiosError?.response?.status === 404) {
        setAlertMessage("Your session has expired or account not found.");
        setAlertVisible(true);
      } else if (axiosError?.response?.status === 401) {
        setAlertMessage("Unauthorized. Please log in again.");
        setAlertVisible(true);
      }
    }
  };
  const fetchReviews = useCallback(async () => {
    startLoading();
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.get("/reviews", {
        headers: { token },
      });

      const data = res.data;
      if (data.status) {
        setReviews(data.data);
        stopLoading();
      }
    } catch (error) {
      handleError(error);
      console.log(error);
      stopLoading();
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  const handleFavorite = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axiosInstance.post(`/favorite/review/skincare/${id}`, null, {
        headers: { token },
      });

      fetchReviews();
    } catch (error) {
      handleError(error);
      console.error("Favorite error:", error);
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
          onPress={() => router.push("/(tabs)/community?mode=review")}
        >
          <Text className="text-label2 text-gray-500">see more</Text>
          <ChevronRight size={16} color="gray" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <LoadingIndicator />
      ) : !reviews ? (
        <Text className="text-gray-500 text-center mt-4">
          No reviews found.
        </Text>
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
                isFavorited={item.favorite}
                onFavorite={() => handleFavorite(item.id)}
              />
            </TouchableOpacity>
          )}
        />
      )}
      <ConfirmAlert
        visible={alertVisible}
        title={alertMessage}
        confirm="Back to login"
        onClose={() => {
          setAlertVisible(false);
          router.replace("/login");
        }}
      />
    </View>
  );
};
