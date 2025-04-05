import React, { useCallback, useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";
import { CommunityCard } from "@/components/Card";
import useLoading from "@/hook/useLoading";
import LoadingIndicator from "@/components/Loading";
import { IReview } from "@/interface/review";
import { IThread } from "@/interface/threads";
import { ModalCreateReviewPost, ModalCreateThread } from "@/components/Modal";
import { CopyPlus, Plus, MessageCircleQuestion } from "lucide-react-native";
import axios, { AxiosError } from "axios";
import { Search } from "@/components/Search";
import { useLocalSearchParams } from "expo-router";
import { ConfirmAlert } from "@/components/Alert";

export default function CommonScreen() {
  const [threads, setThreads] = useState<IThread[] | null>(null);
  const [reviews, setReviews] = useState<IReview[] | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); 
  const { startLoading, stopLoading, isLoading } = useLoading();
  const router = useRouter();
  const [isMode, setIsMode] = useState(false);
  const [isThreadModalOpen, setIsThreadModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { mode } = useLocalSearchParams();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handle404Error = (error: unknown) => {
    const axiosError = error as AxiosError;
    if (axiosError?.response?.status === 404 && !alertVisible) {
      setAlertMessage("Your session has expired or account not found.");
      setAlertVisible(true);
    }
  };

  const fetchThread = useCallback(async () => {
    startLoading();
    const token = await AsyncStorage.getItem("token");
    await axiosInstance
      .get("/thread", {
        headers: { token },
      })
      .then((res) => {
        if (res.data.status) {
          setThreads(res.data.data);
          stopLoading();
        }
      })
      .catch((err) => {
        handle404Error(err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          console.log("Unauthorized");
        }
      });
  }, [startLoading, stopLoading]);

  const fetchReview = useCallback(async () => {
    startLoading();
    const token = await AsyncStorage.getItem("token");
    await axiosInstance
      .get("/reviews", {
        headers: { token },
      })
      .then((res) => {
        if (res.data.status) {
          setReviews(res.data.data);
          stopLoading();
        }
      })
      .catch((err) => {
        handle404Error(err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          console.log("Unauthorized");
        }
      });
  }, [startLoading, stopLoading]);

  useEffect(() => {
    fetchThread();
    fetchReview();
  }, []);

  const handleFavorite = async (id: number) => {
    const token = await AsyncStorage.getItem("token");
    const endpoint = isMode
      ? `/favorite/thread/${id}`
      : `/favorite/review/skincare/${id}`;
    try {
      await axiosInstance.post(endpoint, null, { headers: { token } });

      if (isMode) {
        fetchThread();
      } else {
        fetchReview();
      }
    } catch (err) {
      handle404Error(err);
      console.error("Toggle favorite error:", err);
    }
  };

  const filteredThreads = threads?.filter((thread) =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredReviews = reviews?.filter((review) =>
    review.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRouter = (id: number) => {
    router.push(isMode ? `/thread/${id}` : `/review/${id}`);
  };

  useEffect(() => {
    if (mode === "thread") {
      setIsMode(true);
    } else if (mode === "review") {
      setIsMode(false);
    }
  }, [mode]);

  const CustomHeader = () => (
    <View className="bg-Snow p-4 border-b-2 border-gray-300 relative">
      <View className="flex flex-row items-center justify-between ml-2">
        <Text className="text-Heading3 text-Black">
          {isMode ? "Threads" : "Reviews"}
        </Text>

        <View className="flex flex-row items-center justify-between">
          <TouchableOpacity className="bg-Bittersweet w-8 h-8 rounded-lg flex items-center justify-center mr-2">
            <Plus
              size={18}
              color="white"
              onPress={() =>
                isMode ? setIsThreadModalOpen(true) : setIsReviewModalOpen(true)
              }
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex flex-row items-center justify-around mt-4">
        <TouchableOpacity onPress={() => setIsMode(false)}>
          <View className="flex items-center relative -mb-2">
            <CopyPlus size={30} />
            {!isMode && (
              <View className="absolute bottom-[-9px] w-full border-b-2 border-black" />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsMode(true)}>
          <View className="flex items-center relative -mb-2">
            <MessageCircleQuestion size={30} />
            {isMode && (
              <View className="absolute bottom-[-9px] w-full border-b-2 border-black" />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader />
          ),
        }}
      />
      <SafeAreaView className="flex-1 bg-Snow p-4">
        <View className="flex justify-center mt-2">
        <Search
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    />
          {isMode ? (
            isLoading && !threads ? (
              <LoadingIndicator />
            ) : !threads ? (
              <Text className="text-gray-500 text-center mt-4">
                No threads found.
              </Text>
            ) : (
              <FlatList
                data={filteredThreads}
                keyboardShouldPersistTaps="handled"
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={{
                  justifyContent: "space-between",
                  columnGap: 6,
                  paddingHorizontal: 4,
                }}
                onRefresh={fetchThread}
                refreshing={isLoading}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleRouter(item.id)}>
                    <CommunityCard
                      image={item.images?.[0]?.image}
                      title={item.title}
                      user={item.user?.full_name}
                      userAvatar={item.user?.image}
                      isFavorited={item.favorite}
                      onFavorite={() => handleFavorite(item.id)}
                    />
                  </TouchableOpacity>
                )}
              />
            )
          ) : isLoading && !reviews ? (
            <LoadingIndicator />
          ) : !reviews ? (
            <Text className="text-gray-500 text-center mt-4">
              No reviews found.
            </Text>
          ) : (
            <FlatList
              data={filteredReviews}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: "space-between",
                columnGap: 6,
                paddingHorizontal: 4,
              }}
              onRefresh={fetchReview}
              refreshing={isLoading}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleRouter(item.id)}>
                  <CommunityCard
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
        </View>
      </SafeAreaView>
      <ModalCreateThread
        isOpen={isThreadModalOpen}
        onClose={() => setIsThreadModalOpen(false)}
        isMode={isMode}
      />
      <ModalCreateReviewPost
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        isMode={isMode}
      />
      <ConfirmAlert
        visible={alertVisible}
        title={alertMessage}
        confirm="Back to login"
        onClose={() => {
          setAlertVisible(false);
          router.replace("/login");
        }}
      />
    </SafeAreaProvider>
  );
}
