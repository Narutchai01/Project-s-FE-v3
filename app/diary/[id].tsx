import { View, SafeAreaView, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { IResult } from "@/interface/result";
import { axiosInstance } from "@/lib/axios_instance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CardSkincare } from "@/components/Card";

const ResultAnalysis = () => {
  const { id } = useLocalSearchParams();

  const [result, setResult] = useState<IResult | null>(null);

  useEffect(() => {
    const getResult = async () => {
      const token = await AsyncStorage.getItem("token");
      await axiosInstance
        .get(`/results/${id}`, {
          headers: {
            token: token,
          },
        })
        .then((res) => {
          setResult(res.data.data);
        });
    };

    getResult();
  }, [id]);

  const image = result?.image;

  return (
    <SafeAreaView style={{ marginHorizontal: 10, paddingHorizontal: 10 }}>
      <View>
        <View className="justify-center" style={{ flexDirection: 'row', marginBottom: 8 }}>
          <Image
            source={{ uri: image }}
            style={{ width: 183.11, height: 236.77, borderRadius: 8 }}
          />
        </View>
      </View>

    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {result?.skincare.slice(0, 3).map((item, index: number) => (
        <View key={index} style={{ width: '30%', marginBottom: 8 }}>
        <CardSkincare name={item.name} image={item.image} />
        </View>
      ))}
    </View>
    </SafeAreaView>
  );
};

export default ResultAnalysis;
