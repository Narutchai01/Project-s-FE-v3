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
import { CardSkincare } from "@/components/Card";
import { ChevronUp, ChevronDown } from "lucide-react-native";
import { Image } from "expo-image";
import { useCompare } from "@/context/CompareContext";
import { BackButtonComponents } from "@/components/Buntton";
import useLoading from "@/hook/useLoading";
import LoadingIndicator from "@/components/Loading";
import { ISkincare } from "@/interface/skincare";
import { useSkincareStore } from "@/store/skincare";
import { ModalSkincareDetail } from "@/components/Modal";

const ResultAnalysis = () => {
  const { id } = useLocalSearchParams();
  const [result, setResult] = useState<IResult | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const { skins, acnes, facials } = useCompare();
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [modalVisible, setModalVisible] = useState(false);
  const { setSkincare } = useSkincareStore();

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
          style={{ backgroundColor: "#ffffff", height: "100%" }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className="h-16 bg-Snow">
            <View className="h-full flex-row items-center justify-between px-3">
              <BackButtonComponents
                title={"Result Analysis"}
                textSize="text-Heading3 text-Quartz"
                onPress={() => router.push("/diary")}
              />
            </View>
          </View>

          <View className="flex justify-center items-center p-4">
            {image && (
              <View
                className="justify-center"
                style={{ flexDirection: "row", marginBottom: 8 }}
              >
                <Image
                  source={{ uri: image }}
                  style={{ width: 183.11, height: 236.77, borderRadius: 8 }}
                />
              </View>
            )}

            <View className="w-full">
              <View className="w-full flex justify-center">
                <MemoizedSection title="Skin type" items={skins || []} />
                <MemoizedSection title="Acne Type" items={acnes || []} />
                <MemoizedSection title="Skin Problems" items={facials || []} />
              </View>
            </View>

            <View>
              <View className="w-full flex flex-row justify-between items-center">
                <Text className="text-Heading3 font-bold mb-4 mt-2">
                  Recommended Skincare
                </Text>
                <TouchableOpacity
                  onPress={() => setIsOpened(!isOpened)}
                  className="flex flex-row items-center gap-x-2"
                >
                  <Text className="text-label2 text-gray-500">See all</Text>
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
                      className="mb-4"
                    >
                      <CardSkincare
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
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

interface SectionProps {
  title: string;
  items: { name: string; image: string }[];
}

const Section: React.FC<SectionProps> = ({ title, items }) => (
  <View className="w-full">
    <Text className="text-Heading4 mb-2 mt-2">{title}</Text>
    <View
      className={`flex flex-row w-full gap-x-5 ${
        items.length > 5 ? "flex-wrap" : ""
      }`}
    >
      {items?.map((item, index) => (
        <View key={index}>
          <Image
            source={{ uri: item.image }}
            style={{ width: 75, height: 75, borderRadius: 50 }}
          />
          <View className="flex items-center justify-center mt-2 mb-4">
            <Text className="text-label6">{item.name}</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

const MemoizedSection = React.memo(Section);

export default ResultAnalysis;
