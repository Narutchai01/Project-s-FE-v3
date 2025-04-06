import React, { FC, useCallback, useEffect, useState } from "react";
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
import { AxiosError } from "axios";
import { ConfirmAlert } from "./Alert";

export const SkinAnalysisCard: FC = () => {
  const router = useRouter();
  const { acnes, fetchAcnes, loadAcnes } = useAcneStore();
  const { facials, fetchFacials, loadFacials } = useFacialStore();
  const { skins, fetchskins, loadskinsFromStore } = useSkinsStore();
  const [resultLatest, setResultLatest] = useState<IResult | null>(null);
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const loadSkins = useCallback(loadskinsFromStore, [loadskinsFromStore]);
  const fetchSkins = useCallback(fetchskins, [fetchskins]);
  const fetchAcnesStore = useCallback(fetchAcnes, [fetchAcnes]);
  const fetchFacialsStore = useCallback(fetchFacials, [fetchFacials]);
  const loadAcnesStore = useCallback(loadAcnes, [loadAcnes]);
  const loadFacialsStore = useCallback(loadFacials, [loadFacials]);

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

  const fetchLatestResult = useCallback(async () => {
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
      handleError(error);
      console.log(error);
      stopLoading();
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  useEffect(() => {
    loadAcnesStore();
    fetchAcnesStore();
    loadFacialsStore();
    fetchFacialsStore();
    loadSkins();
    fetchSkins();
    fetchLatestResult();
  }, []);

  const updatedDate = resultLatest
    ? dayjs(resultLatest.create_at).format("MMMM D, YYYY")
    : "";

  return (
    <>
      {isLoading ? (
        <LoadingIndicator />
      ) : !resultLatest ? (
        <Text className="text-gray-500 text-center mt-4">
          No result analysis found.
        </Text>
      ) : (
        <TouchableOpacity
          className="flex justify-center items-center mt-2"
          onPress={() => router.push(`/diary/${resultLatest.id}`)}
        >
          <View className="bg-white rounded-3xl shadow-md flex items-center justify-center w-[90%] h-[240px]">
            <View className="flex-row items-center justify-center">
              <View className="w-[45%] h-[180px]">
                <Image
                  source={{ uri: resultLatest?.image }}
                  className="w-[125px] h-[175px] rounded-2xl object-cover"
                />
              </View>

              <View className="flex flex-col justify-evenly ml-5 ">
              <Text className="text-label4 mb-1">
                  Skin Type:
                </Text>
                <View className="flex flex-row gap-2 ">
                  {skins.filter((item) => item.id === resultLatest?.skin_id)
                    .length > 0 ? (
                    skins
                      .filter((item) => item.id === resultLatest?.skin_id)
                      .map((item, index) => {
                        const imageUri = item.image?.trim();
                        return imageUri ? (
                          <Avatar.Image
                            size={24}
                            key={index}
                            source={{ uri: imageUri }}
                          />
                        ) : (
                          <Avatar.Icon size={24} key={index} icon="image-off" />
                        );
                      })
                  ) : (
                    <Text className="text-gray-400 text-label2">
                      No data available
                    </Text>
                  )}
                </View>

                <Text className="text-label4 mb-1 mt-2">Acne Type:</Text>
                <View className="flex flex-row gap-2 ">
                  {acnes.filter((item) =>
                    resultLatest?.acne_type.some((acne) => acne.id === item.id)
                  ).length > 0 ? (
                    acnes
                      .filter((item) =>
                        resultLatest?.acne_type.some(
                          (acne) => acne.id === item.id
                        )
                      )
                      .map((item, index) => {
                        const imageUri = item.image?.trim();
                        return imageUri ? (
                          <Avatar.Image
                            size={24}
                            key={index}
                            source={{ uri: imageUri }}
                          />
                        ) : (
                          <Avatar.Icon size={24} key={index} icon="image-off" />
                        );
                      })
                  ) : (
                    <Text className="text-gray-400 text-label2">
                      No data available
                    </Text>
                  )}
                </View>

                <Text className="text-label4 mb-1 mt-2">
                  Skin Problems:
                </Text>
                <View className="flex flex-row gap-2">
                  {facials.filter((item) =>
                    resultLatest?.facial_type.some(
                      (facial) => facial.id === item.id
                    )
                  ).length > 0 ? (
                    facials
                      .filter((item) =>
                        resultLatest?.facial_type.some(
                          (facial) => facial.id === item.id
                        )
                      )
                      .map((item, index) => {
                        const imageUri = item.image?.trim();
                        return imageUri ? (
                          <Avatar.Image
                            size={24}
                            key={index}
                            source={{ uri: imageUri }}
                          />
                        ) : (
                          <Avatar.Icon size={24} key={index} icon="image-off" />
                        );
                      })
                  ) : (
                    <Text className="text-gray-400 text-label2">
                      No data available
                    </Text>
                  )}
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
    </>
  );
};
