import {
  View,
  SafeAreaView,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { IResult } from "@/interface/result";
import { axiosInstance } from "@/lib/axios_instance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CardSkincare } from "@/components/Card";
import { ChevronUp, ChevronDown } from "lucide-react-native";
import { useAcneStore } from "@/store/acneStore";
import { useFacialStore } from "@/store/facialStore";
import { useSkinsStore } from "@/store/skinStore";
import { Image } from "expo-image";
import { useCompare } from "@/context/CompareContext";

const ResultAnalysis = () => {
  const { id } = useLocalSearchParams();
  const [result, setResult] = useState<IResult | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const { skins, acnes, facials } = useCompare();

  const fetchResult = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      try {
        const res = await axiosInstance.get(`/results/${id}`, {
          headers: { token },
        });
        setResult(res.data.data);
      } catch (error) {
        console.error("Error fetching result:", error);
      }
    }
  };

  useEffect(() => {
    fetchResult();
  }, [id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchResult().then(() => setRefreshing(false));
  }, [id]);

  const image = result?.image;

  const skincareData = useMemo(() => result?.skincare || [], [result]);

  return (
    <SafeAreaView style={{ backgroundColor: "#ffffff", height: "100%" }}>
      <ScrollView
        style={{ backgroundColor: "#ffffff", height: "100%" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
              <Text className="text-xl font-bold">Recommended Skincare</Text>
              <TouchableOpacity
                onPress={() => setIsOpened(!isOpened)}
                className="flex flex-row items-center gap-x-2"
              >
                <Text>See all</Text>
                {isOpened ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </TouchableOpacity>
            </View>
            <View className="w-full flex flex-row flex-wrap">
              {skincareData
                ?.slice(0, isOpened ? skincareData.length : 3)
                .map((item, index) => (
                  <CardSkincare
                    key={index}
                    name={item.name}
                    image={item.image}
                  />
                ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface SectionProps {
  title: string;
  items: { name: string; image: string }[];
}

const Section: React.FC<SectionProps> = ({ title, items }) => (
  <View className="w-full">
    <Text className="text-xl font-bold">{title}</Text>
    <View
      className={`flex flex-row w-full gap-x-2 ${
        items.length > 5 ? "flex-wrap" : ""
      }`}
    >
      {items?.map((item, index) => (
        <View key={index}>
          <Image
            source={{ uri: item.image }}
            style={{ width: 50, height: 50, borderRadius: 50 }}
          />
          <Text>{item.name}</Text>
        </View>
      ))}
    </View>
  </View>
);

const MemoizedSection = React.memo(Section);

export default ResultAnalysis;
