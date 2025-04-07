import React, { useCallback, useEffect, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { useCompare } from "@/context/CompareContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";
import { CompareDiary } from "@/components/Card";
import LineChartComponent from "@/components/LineChart";
import LoadingIndicator from "@/components/Loading";
import { IResult, Type } from "@/interface/result";
import { useAcneStore } from "@/store/acneStore";
import { useFacialStore } from "@/store/facialStore";
import { BackButtonComponents } from "@/components/Buntton";
import { router } from "expo-router";
import { AxiosError } from "axios";
import { ConfirmAlert } from "@/components/Alert";

export default function CompareScreen() {
  const { compare } = useCompare();
  const { acnes, fetchAcnes, loadAcnes } = useAcneStore();
  const { facials, fetchFacials, loadFacials } = useFacialStore();
  const [compareData, setCompareData] = useState<IResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const loadAcnesStore = useCallback(loadAcnes, [loadAcnes]);
  const fetchAcnesStore = useCallback(fetchAcnes, [fetchAcnes]);
  const loadFacialsStore = useCallback(loadFacials, [loadFacials]);
  const fetchFacialsStore = useCallback(fetchFacials, [fetchFacials]);

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
  

  useEffect(() => {
    loadAcnesStore();
    fetchAcnesStore();
    loadFacialsStore();
    fetchFacialsStore();
  }, []);

  const fetchData = useCallback(async () => {
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
      handleError(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [compare]);

  useEffect(() => {
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

  const acneTypeLabels: Record<number, string> = Object.fromEntries(
    acnes.map((acne) => [acne.id, acne.name])
  );

  const skinProblemLabels: Record<number, string> = Object.fromEntries(
    facials.map((facial) => [facial.id, facial.name])
  );

  const createGenres = (labels: Record<number, string>, key: keyof IResult) =>
    Object.keys(labels).map((id) => ({
      label: labels[Number(id)],
      data: compareData.map((item) => {
        const found = (item[key] as Type[]).find(
          (entry) => entry.id === Number(id)
        );
        return found ? found.count : 0;
      }),
    }));

  const acneGenres = createGenres(acneTypeLabels, "acne_type");
  const skinProblemGenres = createGenres(skinProblemLabels, "facial_type");

  return (
    <ScrollView className="flex-1 bg-Snow p-4">
      <View className="h-14 bg-Snow">
        <View className="h-full flex-row items-center justify-between px-3">
          <BackButtonComponents
            title={"Result Analysis"}
            textSize="text-Heading3 text-Quartz"
            onPress={() => router.back()}
          />
        </View>
      </View>
      <View className="p-4">
        <View className="flex-row justify-center mb-6">
          {compareData?.map((item) => (
            <CompareDiary
              key={item.create_at.toString()}
              image={item.image}
              date={item.create_at}
            />
          ))}
        </View>

        <LineChartComponent
          title="Summary of Acne Types"
          labels={dates}
          genres={acneGenres}
        />
        <LineChartComponent
          title="Summary of Skin Problems"
          labels={dates}
          genres={skinProblemGenres}
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
      </View>
    </ScrollView>
  );
}
