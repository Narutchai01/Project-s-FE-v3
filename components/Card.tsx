import { FC } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { CardSkincareProps, DiaryCardProps } from "@/interface/Card";
import dayjs from "dayjs";
import { useRouter } from "expo-router";

export const CardSkincare: FC<CardSkincareProps> = (props) => {
  const { image, name } = props;


  return (
    <View className="bg-white rounded-2xl shadow w-[115px] h-[130px] mx-2 mb-2 relative overflow-hidden">
      <View className="w-full h-[115px] rounded-t-2xl object-cover">
        <Image
          source={{ uri: image }}
          className="w-full h-full rounded-t-2xl object-cover"
          style={{ borderBottomRightRadius: 32.5 }}
        />
      </View>

      <View
        className="absolute bottom-0 left-0 w-full h-[30px] bg-white px-2 flex items-start justify-center"
        style={{ borderTopLeftRadius: 13, borderTopRightRadius: 10 }}
      >
        <Text
          className="text-label12 font-medium w-full"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name}
        </Text>
      </View>
    </View>
  );
};

export const CardDiary: FC<DiaryCardProps> = (props) => {
  const { data } = props;
  const router = useRouter();

  const date = dayjs(data.create_at).format("DD MMM YYYY");
  const countAcne = data.acne_type
    .map((item) => item.count)
    .reduce((a, b) => a + b, 0);
  const skinProblems = data.facial_type
    .map((item) => item.count)
    .reduce((a, b) => a + b, 0);

  const skinType = data.skin.name;
  const result_id = data.id.toString();
  return (
    <Pressable onPress={() => router.push(`/diary/${result_id}` as any)}>
      <View className="flex-row items-center bg-white rounded-lg shadow p-4 mb-4">
        <Image
          source={{ uri: data.image }}
          className="w-[88px] h-[118px] rounded-lg ml-4 mr-6"
        />
        <View className="flex-1">
          <Text className={`text-label4 font-semibold `}>Date: {date}</Text>
          <Text className={`text-label6`}>Skin Problems: {skinProblems}</Text>
          <Text className={`text-label6 `}>Acnes: {countAcne}</Text>
          <Text className={`text-label6`}>Skin Type: {skinType}</Text>
        </View>
      </View>
    </Pressable>
  );
};
