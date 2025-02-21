import { FC } from "react";
import { View, Text, Image, Pressable, TouchableOpacity } from "react-native";
import { CardSkincareProps, DiaryCardProps, ThreadCardProps } from "@/interface/Card";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { Heart } from "lucide-react-native";

export const CardSkincare: FC<CardSkincareProps> = (props) => {
  const { image, name } = props;

  return (
    <View className="bg-white rounded-2xl shadow w-[115px] h-[130px] mx-2 mb-2 relative overflow-hidden">
      <View className="w-[115px] h-[115px] relative overflow-hidden">
        <Image
          source={{ uri: image }}
          className="w-full h-full rounded-t-2xl object-cover"
          style={{ borderBottomRightRadius: 32.5 }}
        />
      </View>

      <View
        className="absolute bottom-0 left-0 w-[120px] h-[30px] bg-white"
        style={{ borderTopLeftRadius: 13, borderTopRightRadius: 5 }}
      >
        <View className="p-2">
          <Text
            className="text-label12 font-medium w-full"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {name}
          </Text>
        </View>
      </View>
    </View>
  );
};

export const CardDiary: FC<DiaryCardProps> = (props) => {
  const { data, compareMode, selectItem, selectArray = [] } = props;
  const router = useRouter();
  const check = selectArray.includes(data.id);

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
    <Pressable
      onPress={() =>
        compareMode && selectItem
          ? selectItem()
          : router.push(`/diary/${result_id}` as any)
      }
    >
      <View
        className={`flex-row items-center rounded-lg shadow p-4 mb-4 ${
          check && compareMode ? "bg-[#CAC9C9]" : "bg-white"
        }`}
      >
        <Image
          source={{ uri: data.image }}
          className="w-[88px] h-[118px] rounded-lg ml-4 mr-6"
        />
        <View className="flex-1">
          <Text className={`text-label4 font-semibold `}>Date: {date}</Text>
          <Text className={`text-label6`}>Skin Type: {skinType}</Text>
          <Text className={`text-label6 `}>Acnes: {countAcne}</Text>
          <Text className={`text-label6`}>Skin Problems: {skinProblems}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export const PopularThreadCard: FC<ThreadCardProps> = (props) => {
  const { image, title, user, userAvatar } = props;
  return (
    <View className="bg-white rounded-2xl shadow w-[120px] h-[155px] mx-2 mb-2 relative overflow-hidden">
      <View className="w-[120px] h-[120px] relative overflow-hidden">
        <Image
          source={{ uri: image }}
          className="w-full h-full rounded-t-2xl object-cover"
          style={{ borderBottomRightRadius: 32.5 }}
        />
      </View>

      <View
        className="absolute bottom-0 left-0 w-[120px] bg-white"
        style={{ borderTopLeftRadius: 13, borderTopRightRadius: 5 }}
      >
        <View className="p-2">
          <Text
            className="text-label12 font-medium mb-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Image
                source={{ uri: userAvatar }}
                className="w-5 h-5 rounded-full mr-2"
              />
              <Text className="text-label13 text-gray-600">{user}</Text>
            </View>

            <TouchableOpacity className="w-7 h-7 bg-White rounded-full flex items-center justify-center">
              <Heart size={12} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export const ThreadCard: FC<ThreadCardProps> = (props) => {
  const { image, title, user, userAvatar } = props;
  return (
    <View className="bg-white rounded-2xl shadow w-[175px] h-[220px] mx-5 mb-6 relative overflow-hidden">
      <View className="w-[175px] h-[165px] relative overflow-hidden">
        <Image
          source={{ uri: image }}
          className="w-full h-full rounded-t-2xl object-cover"
          style={{ borderBottomRightRadius: 32.5 }}
        />
      </View>

      <View
        className="absolute bottom-0 left-0 w-[175px] bg-white"
        style={{ borderTopLeftRadius: 13, borderTopRightRadius: 5 }}
      >
        <View className="p-3">
          <Text
            className="text-label2 font-medium"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center">
              <Image
                source={{ uri: userAvatar }}
                className="w-5 h-5 rounded-full mr-2"
              />
              <Text className="text-label6 text-gray-600">{user}</Text>
            </View>

            <TouchableOpacity className="w-7 h-7 bg-White rounded-full flex items-center justify-center">
              <Heart size={12} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
