import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useState } from "react";
import { IThread } from "@/interface/threads";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";
import { ThreadCard } from "@/components/Card";
import useLoading from "@/hook/useLoading";
import LoadingIndicator from "@/components/Loading";
import axios from "axios";

const renderCard = (item: IThread, handlerRouter: (id: number) => void) => {
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

export default function CommonScreen() {
  const [threads, setThreads] = useState<IThread[] | null>(null);
  const { startLoading, stopLoading, isLoading } = useLoading();
  const router = useRouter();

  const fecthThread = async () => {
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

  const handleRouter = (id: number) => {
    router.push(`/thread/${id}`);
  };

  useEffect(() => {
    fecthThread();
  }, []);

  const CustomHeader = () => {
    const router = useRouter();
    return (
      <View className="flex-1 bg-Snow p-4">
        <View className="flex-row items-center justify-between mt-6 mb-8">
          <Text className="text-Heading3 font-semibold">Threads</Text>
          <TouchableOpacity
            className="bg-Bittersweet w-10 h-10 rounded-lg flex items-center justify-center"
            onPress={() => router.push("/CreateReview")}
          >
            <Plus size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <Stack.Screen
        options={{
          // headerShown: true,
          header: () => <CustomHeader />,
        }}
      />
      <SafeAreaView>
        <View>
          {isLoading && !threads ? (
            <LoadingIndicator />
          ) : (
            <FlatList
              data={threads}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              renderItem={({ item }) => renderCard(item, handleRouter)}
            />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
