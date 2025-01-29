import React from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BackButtonComponents } from "@/components/Buntton";
import CompareDiary from "@/components/CompareDiary";
import LineChartComponent from "@/components/LineChart";

export default function CompareScreen() {
  const { selectedDiaries } = useLocalSearchParams();
  const parsedDiaries = selectedDiaries ? JSON.parse(selectedDiaries as string) : [];

  console.log("Selected Diaries:", parsedDiaries);

  const acneData = {
    labels: parsedDiaries.map((diary: any) => diary.date),
    datasets: [
      {
        data: parsedDiaries.map((diary: any) => diary.numberOfSpots || 0),
        color: (opacity = 1) => `rgba(138, 43, 226, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: parsedDiaries.map((diary: any) => diary.numberOfSpots / 2 || 0),
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: parsedDiaries.map((diary: any) => diary.numberOfSpots / 3 || 0),
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: parsedDiaries.map((diary: any) => diary.numberOfSpots / 4 || 0),
        color: (opacity = 1) => `rgba(30, 144, 255, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: parsedDiaries.map((diary: any) => diary.numberOfSpots / 5 || 0),
        color: (opacity = 1) => `rgba(72, 61, 139, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: parsedDiaries.map((diary: any) => diary.numberOfSpots / 6 || 0),
        color: (opacity = 1) => `rgba(75, 0, 130, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: [
      "สิวอุดตันหัวขาว",
      "สิวหัวช้าง",
      "สิวอักเสบ",
      "สิวอุดตันหัวดำ",
      "สิวผื่นนูน",
      "สิวตุ่มแดง",
    ],
  };

  const skinProblemsData = {
    labels: parsedDiaries.map((diary: any) => diary.date),
    datasets: [
      {
        data: parsedDiaries.map((diary: any) => diary.numberOfSpots - 1 || 0),
        color: (opacity = 1) => `rgba(138, 43, 226, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: parsedDiaries.map((diary: any) => diary.numberOfSpots / 2 || 0),
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: parsedDiaries.map((diary: any) => diary.numberOfSpots / 3 || 0),
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: parsedDiaries.map((diary: any) => diary.numberOfSpots / 4 || 0),
        color: (opacity = 1) => `rgba(30, 144, 255, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: parsedDiaries.map((diary: any) => diary.numberOfSpots / 5 || 0),
        color: (opacity = 1) => `rgba(72, 61, 139, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: parsedDiaries.map((diary: any) => diary.numberOfSpots / 6 || 0),
        color: (opacity = 1) => `rgba(75, 0, 130, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: [
      "รอยดำรอยแดง",
      "ฝ้า กระ จุดด่างดำ",
      "รูขุมขนกว้าง",
      "หลุม แผลเป็น",
      "ริ้วรอย",
      "หน้าหมองคล้ำ",
    ],
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="flex-row items-center mb-4">
        <BackButtonComponents title="Compare" textSize="text-lg font-bold" /> 
      </View>

      <View className="flex-row justify-center mb-6">
        {parsedDiaries.map((diary: any, index: number) => (
          <CompareDiary key={index} image={diary.image} date={diary.date} />
        ))}
      </View>

      <LineChartComponent title="Summary of Acne Types" data={acneData} />
      <LineChartComponent title="Summary of Skin Problems" data={skinProblemsData} />
    </ScrollView>
  );
}
