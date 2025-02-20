import React, { useEffect, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { useCompare } from "@/context/CompareContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";
import CompareDiary from "@/components/CompareDiary";
import LineChartComponent from "@/components/LineChart";
import LoadingIndicator from "@/components/Loading";
import { IResult, Type } from "@/interface/result";

export default function CompareScreen() {
  const { compare } = useCompare();
  const [compareData, setCompareData] = useState<IResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const acneTypeLabels: Record<number, string> = {
    1: "Blackheads",
    2: "Whiteheads",
    3: "Inflamed Acne",
    4: "Pimples with Pus",
    5: "Nodules",
    6: "Red Pimples",
  };

  const skinProblemLabels: Record<number, string> = {
    1: "Red marks",
    2: "Black marks",
    3: "Enlarged Pores",
    4: "Wrinkles",
    5: "Scars",
    6: "Dull Facial Skin",
    7: "Freckles and Dark Spots",
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axiosInstance.post<{ data: IResult[] }>(
          "/results/compare",
          { IDs: compare },
          { headers: { token } }
        );
        setCompareData(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [compare]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!compareData.length) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-label2">No data available</Text>
      </View>
    );
  }

  const dates: string[] = compareData.map((item) =>
    new Date(item.create_at).toLocaleDateString()
  );

  const createGenres = (labels: Record<number, string>, key: keyof IResult) =>
    Object.keys(labels).map((id) => ({
      label: labels[Number(id)],
      data: compareData.map((item) => {
        const found = (item[key] as Type[]).find((entry) => entry.id === Number(id));
        return found ? found.count : 0;
      }),
    }));

  const acneGenres = createGenres(acneTypeLabels, "acne_type");
  const skinProblemGenres = createGenres(skinProblemLabels, "facial_type");

  return (
    <ScrollView className="flex-1 bg-Snow p-4">
      <View className="flex-row justify-center mb-6">
        {compareData?.map((item) => (
          <CompareDiary key={item.create_at.toString()} image={item.image} date={item.create_at} />
        ))}
      </View>

      <LineChartComponent title="Summary of Acne Types" labels={dates} genres={acneGenres} />
      <LineChartComponent title="Summary of Skin Problems" labels={dates} genres={skinProblemGenres} />
    </ScrollView>
  );
}
