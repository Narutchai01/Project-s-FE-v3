import React, { FC, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { PopularThreadCard } from "@/components/Card";
import useLoading from "@/hook/useLoading";
import { IReview } from "@/interface/review";
import LoadingIndicator from "@/components/Loading";
import { AxiosError } from "axios";
import { ConfirmAlert } from "./Alert";
import { useReviewStore } from "@/store/reviewStore";
import { useRouter } from "expo-router";

export const PopularReviews: FC = () => {
  const router = useRouter();
  const { isLoading } = useLoading();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { reviews, fetchReviews, favoriteReview } = useReviewStore();

    const handleError = (error: unknown) => {
      const axiosError = error as AxiosError;
    
      if (!alertVisible) {
        if (axiosError?.response?.status === 401) {
          setAlertMessage("Unauthorized. Please log in again.");
          setAlertVisible(true);
        }
      }
    };
    
  
    useEffect(() => {
      fetchReviews().catch(handleError);
    }, []);
  
    const handleFavorite = async (id: number) => {
      try {
        await favoriteReview(id);
      } catch (error) {
        handleError(error);
      }
    };
  
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
