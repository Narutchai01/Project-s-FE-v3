import React, { FC, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import dayjs from "dayjs";
import { Avatar } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAcneStore } from "@/store/acneStore";
import { useFacialStore } from "@/store/facialStore";
import { useSkinsStore } from "@/store/skinStore";
import { IResult } from "@/interface/result";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";
import useLoading from "@/hook/useLoading";
import LoadingIndicator from "@/components/Loading"; 

export const SkinAnalysisCard: FC = () => {
  const router = useRouter();
  const { acnes, fetchAcnes, loadAcnes } = useAcneStore();
  const { facials, fetchFacials, loadFacials } = useFacialStore();
  const { skins, fetchskins, loadskinsFromStore } = useSkinsStore();
  const [resultLatest, setResultLatest] = useState<IResult | null>(null);
  const { startLoading, stopLoading, isLoading } = useLoading(); 

  const fetchLatestResult = async () => {
    startLoading(); 
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.get("/results/latest", {
        headers: {
          token,
        },
      });
      const data = res.data;
      if (data.status) {
        setResultLatest(data.data);
        stopLoading();
      }
    } catch (error) {
      console.log(error);
      stopLoading();
    } finally {
      stopLoading();
    }
  }

  useEffect(() => {
    loadAcnes();
    fetchAcnes();
    loadFacials();
    fetchFacials();
    loadskinsFromStore();
    fetchskins();
    fetchLatestResult();
  }, []);

  const updatedDate = resultLatest
    ? dayjs(resultLatest.create_at).format("MMMM D, YYYY")
    : "";

  return isLoading ? (
    <LoadingIndicator />
  ) : !resultLatest ? (
    <Text className="text-gray-500 text-center mt-4">No result analysis found.</Text>
  ) : (
    <TouchableOpacity
      className="flex justify-center items-center mt-2"
      onPress={() => router.push(`/diary/${resultLatest.id}`)}
    >
      <View className="bg-white rounded-3xl shadow-md flex items-center justify-center w-[350px] h-[246px]">
        <View className="flex-row items-center justify-center">
          <View className="w-[148px] h-[200.95px]">
            <Image
              source={{ uri: resultLatest?.image }}
              className="w-[148px] h-[200.95px] rounded-2xl object-cover"
            />
          </View>

          <View className="flex flex-col justify-evenly ml-8">
            <Text className="text-label2 font-bold mb-1 mt-1">Skin Type:</Text>
            <View className="flex flex-row gap-2">
              {skins
                .filter((item) => item.id === resultLatest?.skin_id)
                .map((item, index) => (
                  <Avatar.Image size={24} key={index} source={{ uri: item.image }} />
                ))}
            </View>

            <Text className="text-label2 font-bold mb-1">Acne Type:</Text>
            <View className="flex flex-row gap-2">
              {acnes
                .filter((item) => resultLatest?.acne_type.some((acne) => acne.id === item.id))
                .map((item, index) => (
                  <Avatar.Image size={24} key={index} source={{ uri: item.image }} />
                ))}
            </View>

            <Text className="text-label2 font-bold mb-1">Skin Problems:</Text>
            <View className="flex flex-row gap-2">
              {facials
                .filter((item) => resultLatest?.facial_type.some((facial) => facial.id === item.id))
                .map((item, index) => (
                  <Avatar.Image size={24} key={index} source={{ uri: item.image }} />
                ))}
            </View>
          </View>
        </View>
      </View>

      <View className="flex-row justify-end mt-4 mr-16 w-full">
        <Text className="text-gray-500 text-label7">
          Updated {updatedDate}
        </Text>
      </View>
    </TouchableOpacity>
  );
};