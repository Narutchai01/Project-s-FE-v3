import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { CopyPlus, Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";
import { ThreadCard } from "@/components/Card";
import useLoading from "@/hook/useLoading";
import LoadingIndicator from "@/components/Loading";
import axios from "axios";
import { MessageCircleQuestion } from "lucide-react-native";
import { IReview } from "@/interface/review";
import { IThread } from "@/interface/threads";
import { ModalCreateThread } from "@/components/Modal";

const renderCard = (item: IThread , handlerRouter: (id: number) => void) => {
  return (
    <TouchableOpacity onPress={() => handlerRouter(item.id)}>
      <ThreadCard
        image={item.images?.[0]?.image}
        title={item.title}
        user={item.user?.full_name}
        userAvatar={item.user?.image}
      />
    </TouchableOpacity>
  );
};

const renderCardReview = (item: IReview , handlerRouter: (id: number) => void) => {
  return (
    <TouchableOpacity onPress={() => handlerRouter(item.id)}>
      <ThreadCard
        image={item.image}
        title={item.title}
        user={item.user?.full_name}
        userAvatar={item.user?.image}
      />
    </TouchableOpacity>
  );
};

export default function CommonScreen() {
  const [threads, setThreads] = useState<IThread[] | null>(null);
  const [reviews, setReviews] = useState<IReview[] | null>(null);
  const { startLoading, stopLoading, isLoading } = useLoading();
  const router = useRouter();
  const [isMode, setIsMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchThread = async () => {
    startLoading();
    const token = await AsyncStorage.getItem("token");
    await axiosInstance
      .get("/thread", {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        if (res.data.status) {
          setThreads(res.data.data);
          stopLoading();
        }
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            console.log("Unauthorized");
          }
        }
      });
  };

  const fecthReview = async () => {
    startLoading();
    const token = await AsyncStorage.getItem("token");
    await axiosInstance
      .get("/reviews", {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        if (res.data.status) {
          setReviews(res.data.data);
          stopLoading();
        }
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            console.log("Unauthorized");
          }
        }
      });
  };
  

  const handleRouter = (id: number) => {
    console.log(`Navigating to: ${isMode ? '/thread/' : '/reviewSkincare/'}${id}`);
    router.push(isMode ? `/thread/${id}` : `/review/${id}`);
  };

  useEffect(() => {
    fetchThread();
    fecthReview();
  }, []);

  const CustomHeader = () => {
    const router = useRouter();
    return (
      <View className="bg-Snow p-4 border-b-2 border-gray-300 mb-4 relative">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-Heading3 text-Quartz">
            {isMode ? "Threads" : "Review"}
          </Text>
          <TouchableOpacity className="bg-Bittersweet w-10 h-10 rounded-lg flex items-center justify-center">
            <Plus
              size={24}
              color="white"
              onPress={() => isMode ? setIsModalOpen(true) : router.push("/CreateReviewPost")}
            />
          </TouchableOpacity>
        </View>
        <View className="flex flex-row items-center justify-around mt-4">
          <TouchableOpacity onPress={() => setIsMode(false)}>
            <View className="flex items-center relative">
              <CopyPlus size={34} />
              {!isMode && (
                <View className="absolute bottom-[-15px] w-full border-b-2 border-black" />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsMode(true)}>
            <View className="flex items-center relative">
              <MessageCircleQuestion size={34} />
              {isMode && (
                <View className="absolute bottom-[-15px] w-full border-b-2 border-black" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => <CustomHeader />,
        }}
      />
      <SafeAreaView>
        <View>
          {isMode ? (
            isLoading && !threads ? (
              <LoadingIndicator />
            ) : (
              <FlatList
                data={threads}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                renderItem={({ item }) => renderCard(item, handleRouter)}
              />
            )
          ) : isLoading && !reviews ? (
            <LoadingIndicator />
          ) : (
            <FlatList
              data={reviews}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              renderItem={({ item }) => renderCardReview(item, handleRouter)}
            />
          )}
        </View>
      </SafeAreaView>
      <ModalCreateThread isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </SafeAreaProvider>
  );
}
