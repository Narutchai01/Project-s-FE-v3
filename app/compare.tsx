import React, { useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BackButtonComponents } from "@/components/Buntton";
import CompareDiary from "@/components/CompareDiary";
import LineChartComponent from "@/components/LineChart";
import { useCompare } from "@/context/CompareContext";
import { IResult } from "@/interface/result";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";
import { Image } from "react-native";

export default function CompareScreen() {
  const { compare } = useCompare();

  const [compareData, setCompareData] = React.useState<IResult[] | null>(null);

  const fetchData = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
    await axiosInstance
      .post(
        "/results/compare",
        {
          IDs: compare,
        },
        {
          headers: {
            token: token,
          },
        }
      )
      .then((res) => {
        setCompareData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(compareData);

  // const acneData = {
  //   labels: parsedDiaries.map((diary: any) => diary.date),
  //   datasets: [
  //     {
  //       data: parsedDiaries.map((diary: any) => diary.numberOfSpots || 0),
  //       color: (opacity = 1) => `rgba(138, 43, 226, ${opacity})`,
  //       strokeWidth: 2,
  //     },
  //     {
  //       data: parsedDiaries.map((diary: any) => diary.numberOfSpots / 2 || 0),
  //       color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
  //       strokeWidth: 2,
  //     },
  //     {
  //       data: parsedDiaries.map((diary: any) => diary.numberOfSpots / 3 || 0),
  //       color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
  //       strokeWidth: 2,
  //     },
  //     {
  //       data: parsedDiaries.map((diary: any) => diary.numberOfSpots / 4 || 0),
  //       color: (opacity = 1) => `rgba(30, 144, 255, ${opacity})`,
  //       strokeWidth: 2,
  //     },
  //     {
  //       data: parsedDiaries.map((diary: any) => diary.numberOfSpots / 5 || 0),
  //       color: (opacity = 1) => `rgba(72, 61, 139, ${opacity})`,
  //       strokeWidth: 2,
  //     },
  //     {
  //       data: parsedDiaries.map((diary: any) => diary.numberOfSpots / 6 || 0),
  //       color: (opacity = 1) => `rgba(75, 0, 130, ${opacity})`,
  //       strokeWidth: 2,
  //     },
  //   ],
  //   legend: [
  //     "สิวอุดตันหัวขาว",
  //     "สิวหัวช้าง",
  //     "สิวอักเสบ",
  //     "สิวอุดตันหัวดำ",
  //     "สิวผื่นนูน",
  //     "สิวตุ่มแดง",
  //   ],
  // };

  // const skinProblemsData = {
  //   labels: parsedDiaries.map((diary: any) => diary.date),
  //   datasets: [
  //     {
  //       data: parsedDiaries.map((diary: any) => diary.numberOfSpots - 1 || 0),
  //       color: (opacity = 1) => `rgba(138, 43, 226, ${opacity})`,
  //       strokeWidth: 2,
  //     },
  //     {
  //       data: parsedDiaries.map((diary: any) => diary.numberOfSpots / 2 || 0),
  //       color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
  //       strokeWidth: 2,
  //     },
  //     {
  //       data: parsedDiaries.map((diary: any) => diary.numberOfSpots / 3 || 0),
  //       color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
  //       strokeWidth: 2,
  //     },
  //     {
  //       data: parsedDiaries.map((diary: any) => diary.numberOfSpots / 4 || 0),
  //       color: (opacity = 1) => `rgba(30, 144, 255, ${opacity})`,
  //       strokeWidth: 2,
  //     },
  //     {
  //       data: parsedDiaries.map((diary: any) => diary.numberOfSpots / 5 || 0),
  //       color: (opacity = 1) => `rgba(72, 61, 139, ${opacity})`,
  //       strokeWidth: 2,
  //     },
  //     {
  //       data: parsedDiaries.map((diary: any) => diary.numberOfSpots / 6 || 0),
  //       color: (opacity = 1) => `rgba(75, 0, 130, ${opacity})`,
  //       strokeWidth: 2,
  //     },
  //   ],
  //   legend: [
  //     "รอยดำรอยแดง",
  //     "ฝ้า กระ จุดด่างดำ",
  //     "รูขุมขนกว้าง",
  //     "หลุม แผลเป็น",
  //     "ริ้วรอย",
  //     "หน้าหมองคล้ำ",
  //   ],
  // };

  return (
    <ScrollView className="flex-1 bg-Snow p-4">

      <View className="flex-row justify-center mb-6">
        {compareData?.map((item) => (
          <CompareDiary image={item.image} date={item.create_at} />
        ))}
      </View>

      {/* {compareData && <LineChartComponent title="Summary of Acne Types" data={compareData} />} */}
      {/* <LineChartComponent title="Summary of Skin Problems" data={skinProblemsData} /> */}
    </ScrollView>
  );
}
