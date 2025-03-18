import React, { useState, useEffect } from "react";
import { Text, View, FlatList, SafeAreaView, TouchableOpacity } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CardDiary } from "@/components/Card";
import { useCompare } from "@/context/CompareContext";
import { IResult } from "@/interface/result";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";
import dayjs, { Dayjs } from "dayjs";
import { CalendarPicker } from "@/components/CalendarPicker";
import { CalendarDays } from "lucide-react-native";
import useLoading from "@/hook/useLoading";
import LoadingIndicator from "@/components/Loading";

export default function DiaryScreen() {
  const { setIsCompare, isCompare, compare, setCompare } = useCompare();
  const [results, setResults] = useState<IResult[] | null>(null);
  const [filteredResults, setFilteredResults] = useState<IResult[] | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{ startDate: Dayjs | null; endDate: Dayjs | null }>({
    startDate: null,
    endDate: null,
  });
  const { isLoading, startLoading, stopLoading } = useLoading();

  const fetchResults = async () => {
    startLoading();
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const res = await axiosInstance.get("/results", {
          headers: { token },
        });
        setResults(res.data.data);
        setFilteredResults(res.data.data);
      }
    } catch (error) {
      console.log("Error fetching results:", error);
    }
    finally {
      stopLoading();
    }
  };


  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    if (!selectedRange.startDate || !selectedRange.endDate) {
      setFilteredResults(results);
      return;
    }
  
    const filtered = results?.filter((diary) => {
      const diaryDate = dayjs(diary.create_at); 
      return (
        diaryDate.isAfter(selectedRange.startDate!.subtract(1, "day")) &&
        diaryDate.isBefore(selectedRange.endDate!.add(1, "day"))
      );
    });
  
    setFilteredResults(filtered || []);
  }, [selectedRange, results]);
  

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

  return (
    <SafeAreaProvider>
       {isLoading ? (
        <LoadingIndicator />
      ) : (
      <SafeAreaView className="flex-1 bg-Snow p-4">
        
        <TouchableOpacity 
          onPress={() => setIsCalendarOpen(true)}
          className="flex-row items-center gap-x-2 bg-Bittersweet px-4 py-2 rounded-full mb-4 self-center"
        >
          <CalendarDays size={24} color="white" /> 
        </TouchableOpacity>

        {isCompare && (
          <View className="flex items-center mb-4">
            <Text className="text-Heading3 font-semibold text-center">
              Select diary to compare ({compare?.length || 0}/3)
            </Text>
          </View>
        )}

        <FlatList
          data={filteredResults}
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

        <CalendarPicker
          visible={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          onSave={(startDate, endDate) => {
            setSelectedRange({ startDate, endDate });
            setIsCalendarOpen(false);
          }}
        />
      </SafeAreaView>
      )}
    </SafeAreaProvider>
  );
}
