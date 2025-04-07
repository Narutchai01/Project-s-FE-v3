import {
  View,
  SafeAreaView,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { IResult } from "@/interface/result";
import { axiosInstance } from "@/lib/axios_instance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CardSkincareReccommemded } from "@/components/Card";
import { ChevronUp, ChevronDown } from "lucide-react-native";
import { Image } from "expo-image";
import { useCompare } from "@/context/CompareContext";
import { BackButtonComponents } from "@/components/Buntton";
import useLoading from "@/hook/useLoading";
import LoadingIndicator from "@/components/Loading";
import { ISkincare } from "@/interface/skincare";
import { useSkincareStore } from "@/store/skincare";
import { ModalSkincareDetail } from "@/components/Modal";
import { ConfirmAlert } from "@/components/Alert";
import { AxiosError } from "axios";

const ResultAnalysis = () => {
  const { id } = useLocalSearchParams();
  const [result, setResult] = useState<IResult | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const { skins, acnes, facials } = useCompare();
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [modalVisible, setModalVisible] = useState(false);
  const { setSkincare } = useSkincareStore();
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

  const fetchResult = useCallback(async () => {
    startLoading();
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.get(`/results/${id}`, {
        headers: {
          token,
        },
      });
      const data = res.data;
      if (data.status) {
        setResult(data.data);
        stopLoading();
      }
    } catch (error) {
      handleError(error);
      console.log(error);
      stopLoading();
    } finally {
      stopLoading();
    }
  }, [id, startLoading, stopLoading]);

  useEffect(() => {
    fetchResult();
  }, [id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchResult().then(() => setRefreshing(false));
  }, [fetchResult]);

  const image = result?.image;

  const skincareData = useMemo(() => result?.skincare || [], [result]);

  const handleSkincare = (item: ISkincare) => {
    setSkincare(item);
    setModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-Snow p-4">
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ScrollView
          style={{ backgroundColor: "#FCFAFD", height: "100%" }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className="h-16 bg-Snow -ml-2">
            <View className="h-full flex-row items-center justify-between px-3">
              <BackButtonComponents
                title={"Result Analysis"}
                textSize="text-Heading3 text-Quartz"
                onPress={() => router.push("/diary")}
              />
            </View>
          </View>

          <View className="flex justify-center items-center">
            {image && (
              <View
                className="justify-center"
                style={{ flexDirection: "row", marginBottom: 8 }}
              >
                <Image
                  source={{ uri: image }}
                  style={{ width: 183, height: 236, borderRadius: 8 }}
                />
              </View>
            )}

            <View className="w-full">
              <View className="w-full flex justify-center">
                <MemoizedSection
                  title="Skin type"
                  items={skins || []}
                  highlightId={result?.skin_id}
                />

                <MemoizedSection
                  title="Acne Type"
                  items={acnes || []}
                  highlightIds={result?.acne_type?.map((item) => item.id)}
                />

                <MemoizedSection
                  title="Skin Problems"
                  items={facials || []}
                  highlightIds={result?.facial_type?.map((item) => item.id)}
                />
              </View>
            </View>

            <View>
              <View className="w-full flex flex-row justify-between items-center">
                <Text className="text-Heading3 font-bold mb-4 mt-2 ml-4">
                  Recommended Skincare
                </Text>
                <TouchableOpacity
                  onPress={() => setIsOpened(!isOpened)}
                  className="flex flex-row items-center gap-x-2"
                >
                  <Text className="text-label2 text-gray-500">
                    {isOpened ? "See less" : "See more"}
                  </Text>
                  {isOpened ? (
                    <ChevronUp size={16} color="gray" />
                  ) : (
                    <ChevronDown size={16} color="gray" />
                  )}
                </TouchableOpacity>
              </View>
              <View className="w-full flex flex-row flex-wrap">
                {skincareData
                  ?.slice(0, isOpened ? skincareData.length : 3)
                  .map((item, index) => (
                    <TouchableOpacity
                      key={item.id || index}
                      onPress={() => handleSkincare(item)}
                      style={{
                        width: "32%",
                        alignItems: "center",
                        marginBottom: 15,
                        marginLeft: 4,
                      }}
                    >
                      <CardSkincareReccommemded
                        key={index}
                        name={item.name}
                        image={item.image}
                      />
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          </View>

          <ModalSkincareDetail
            isOpen={modalVisible}
            onClose={() => setModalVisible(false)}
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
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

interface SectionProps {
  title: string;
  items: { id: number; name: string; image: string }[];
  highlightId?: number;
  highlightIds?: number[];
}

const Section: React.FC<SectionProps> = ({
  title,
  items,
  highlightId,
  highlightIds,
}) => (
  <View className="w-full">
    <Text className="text-Heading4 mb-3 mt-4 ml-2">{title}</Text>
    <View
      className={`flex flex-row w-full gap-x-4 ml-2 ${
        items.length > 4 ? "flex-wrap" : ""
      }`}
    >
      {items.map((item, index) => {
        const isHighlighted =
          item.id === highlightId || highlightIds?.includes(item.id);
        const hasData = !!item.image && !!item.name;

        return (
          <View key={index} style={{ alignItems: "center" }}>
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 40,
                borderWidth: 2.5,
                borderColor: isHighlighted ? "black" : "gray",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  width: 65,
                  height: 65,
                  borderRadius: 40,
                  tintColor: hasData ? undefined : "gray",
                }}
              />
            </View>
            <View className="flex items-center justify-center mt-2 mb-4">
              <Text
                numberOfLines={3}
                style={{
                  width: 60,
                  textAlign: "center",
                  color: hasData ? "#000" : "#999",
                }}
                className="text-label7"
              >
                {item.name}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  </View>
);

const MemoizedSection = React.memo(Section);

export default ResultAnalysis;
