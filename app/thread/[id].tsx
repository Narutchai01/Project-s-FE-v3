import { View, Text, FlatList, Dimensions } from "react-native";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { IThread } from "@/interface/threads";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";
import useLoading from "@/hook/useLoading";
import { Image } from "expo-image";
import { Heart, MessageCircle, Bookmark, Dot } from "lucide-react-native";
import { ButtonComponents } from "@/components/Buntton";

import LoadingIndicator from "@/components/Loading";
export default function ThreadDetails() {
  const { id } = useLocalSearchParams();
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [thread, setThread] = useState<IThread | null>(null);
  const { width } = Dimensions.get("screen");
  const [curImage, setCurrImage] = useState<number>(0);

  const fecThread = async () => {
    startLoading();
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.get(`/thread/${id}`, {
        headers: {
          token,
        },
      });

      const data = res.data;
      if (data.status) {
        setThread(data.data);
        stopLoading();
      }
    } catch (error) {
      console.log(error);
      stopLoading();
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fecThread();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <View>
            <View className="flex flex-row justify-between items-center">
              <View className="flex flex-row items-center gap-x-5">
                <View
                  style={{
                    width: 50,
                    height: 50,
                  }}
                >
                  <Image
                    source={{ uri: thread?.user.image }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 50,
                    }}
                  />
                </View>
                <Text>{thread?.user.full_name}</Text>
              </View>
              <ButtonComponents
                title="Folloow"
                className=" bg-Bittersweet px-5 py-2 rounded-full"
                textSize="text-white"
              />
            </View>
            <FlatList
              data={thread?.images}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    width: width,
                    height: 520,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: item?.image }}
                    style={{ width: "100%", height: "100%", borderRadius: 30 }}
                    onLoad={() => setCurrImage(index)}
                  />
                </View>
              )}
              keyExtractor={(_, index) => index.toString()}
              pagingEnabled
              bounces={false}
              horizontal
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / width
                );
                setCurrImage(index);
              }}
            />

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flexDirection: "row" }}>
                <View style={{ flexDirection: "row" }}>
                  <Heart color={thread?.favorite ? "red" : "gray"} />
                  <Text className="text-3xl">{thread?.favorite_count}</Text>
                </View>
                <MessageCircle />
              </View>

              <View style={{ flexDirection: "row" }}>
                {thread?.images.map((_, index) => (
                  <Dot
                    key={index}
                    size={48}
                    color={index !== curImage ? "gray" : "red"}
                  />
                ))}
              </View>
              <Bookmark />
            </View>

            <View>
              <Text className="text-3xl font-bold">{thread?.title}</Text>
              <Text>{thread?.caption}</Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
