import React from "react";
import { Text, View, FlatList, SafeAreaView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CardDiary } from "@/components/Card";
import { useCompare } from "@/context/CompareContext";
import { useState, useEffect } from "react";
import { IResult } from "@/interface/result";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";

export default function DiaryScreen() {
  const { setIsCompare, isCompare, compare, setCompare } = useCompare();
  const [results, setResults] = useState<IResult[] | null>(null);

  const handleCompareOrConfirm = (id: number) => {
    if (compare?.includes(id)) {
      setCompare(compare.filter((compareId) => compareId !== id));
    } else {
      if (compare && compare.length >= 3) {
        console.error("Cannot compare more than 3 items");
        return;
      }
      setCompare(compare ? [...compare, id] : [id]);
    }
  };

  const fetchResults = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const res = await axiosInstance.get("/results", {
          headers: { token },
        });
        setResults(res.data.data);
      }
    } catch (error) {
      console.log("Error fetching results:", error);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-Snow p-8">
        {isCompare && (
          <View className="flex items-center mb-4">
            <Text className="text-Heading3 font-semibold text-center">
              Select diary to compare ({compare?.length || 0}/3)
            </Text>
          </View>
        )}

        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CardDiary
              key={item.id}
              data={item}
              compareMode={isCompare}
              selectItem={() => handleCompareOrConfirm(item.id)}
              selectArray={compare}
            />
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
