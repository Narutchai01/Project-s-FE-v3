import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { router, Stack, useFocusEffect } from "expo-router";
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
import { ButtonComponents } from "@/components/Buntton";
import { ConfirmAlert } from "@/components/Alert";

interface CustomHeaderProps {
  openCalendar: () => void;
  onConfirmPress: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = (props) => {
  const { setIsCompare, isCompare, compare, setCompare } = useCompare();
  const { openCalendar, onConfirmPress } = props;

  return (
    <View className="bg-Snow p-6 border-b-2 border-gray-300 relative">
      <View className="flex flex-row items-center justify-between">
        {isCompare ? (
          <ButtonComponents
            title="Cancel"
            textSize="text-label4 font-semibold text-Bittersweet"
            onPress={() => {
              setIsCompare(false);
              setCompare([]);
            }}
          />
        ) : (
          <Text className="text-Heading3 text-Black">Diary</Text>
        )}

        <View className="flex flex-row items-center gap-x-2">
          <TouchableOpacity onPress={openCalendar} className="bg-Bittersweet w-8 h-8 rounded-lg flex items-center justify-center mr-2">
            <View className="bg-Bittersweet px-4 py-2 rounded-full">
              <CalendarDays size={18} color="white" />
            </View>
          </TouchableOpacity>

          <ButtonComponents
            title={isCompare ? "Confirm" : "Compare"}
            className="bg-Bittersweet px-2 rounded-full h-8 flex items-center justify-center"
            textSize="text-label4 text-white font-semibold"
            onPress={() => {
              if (isCompare) {
                onConfirmPress();
              } else {
                setIsCompare(true);
              }
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default function DiaryScreen() {
  const { setIsCompare, isCompare, compare, setCompare } = useCompare();
  const [results, setResults] = useState<IResult[] | null>(null);
  const [filteredResults, setFilteredResults] = useState<IResult[] | null>(
    null
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [showAlert, setShowAlert] = useState(false);
  const [showSelectMaxAlert, setShowSelectMaxAlert] = useState(false);

  const fetchResults = useCallback(async () => {
    startLoading();
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const res = await axiosInstance.get("/results", { headers: { token } });
        setResults(res.data.data);
        setFilteredResults(res.data.data);
      }
    } catch (error) {
      console.log("Error fetching results:", error);
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    if (!selectedRange.startDate || !selectedRange.endDate) {
      setFilteredResults(results);
      return;
    }

    const filtered = results?.filter((diary) => {
      const diaryDate = dayjs(diary.create_at).startOf("day");
      const start = selectedRange.startDate!.startOf("day");
      const end = selectedRange.endDate!.startOf("day");

      return (
        (diaryDate.isAfter(start) || diaryDate.isSame(start)) &&
        (diaryDate.isBefore(end) || diaryDate.isSame(end))
      );
    });

    setFilteredResults(filtered || []);
  }, [selectedRange, results]);

  const handleCompareOrConfirm = (id: number) => {
    if (compare?.includes(id)) {
      setCompare(compare.filter((compareId) => compareId !== id));
    } else {
      if (compare && compare.length >= 3) {
        setShowSelectMaxAlert(true);
        return;
      }
      setCompare(compare ? [...compare, id] : [id]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setCompare([]);
      setIsCompare(false);
    }, [setCompare, setIsCompare])
  );

  return (
    <SafeAreaProvider>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader
              openCalendar={() => setIsCalendarOpen(true)}
              onConfirmPress={() => {
                if (compare.length < 2) {
                  setShowAlert(true);
                } else {
                  setIsCompare(false);
                  router.push("/compare");
                }
              }}
              
            />
          ),
        }}
      />

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <SafeAreaView className="flex-1 bg-Snow p-4">
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

          <ConfirmAlert
            visible={showAlert}
            onClose={() => setShowAlert(false)}
            title="Please select at least 2 diary to compare."
            confirm="OK"
          />

          <ConfirmAlert
            visible={showSelectMaxAlert}
            onClose={() => setShowSelectMaxAlert(false)}
            title="You can compare up to 3 diaries only."
            confirm="OK"
          />
        </SafeAreaView>
      )}
    </SafeAreaProvider>
  );
}
