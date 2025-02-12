import { IResult } from "@/interface/result";
import React, { FC } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import dayjs from "dayjs";
import { ISkin } from "@/interface/skin";
import { Avatar } from "react-native-paper";
import { IAcne } from "@/interface/acne";
import { IFacial } from "@/interface/facial";
import { useRouter } from "expo-router";

interface PropsSkinAnalysisCard {
  resultLatest: IResult | null;
  skins: ISkin[];
  acnes: IAcne[];
  facials: IFacial[];
}

export const SkinAnalysisCard: FC<PropsSkinAnalysisCard> = (props) => {
  const router = useRouter();
  const { resultLatest, skins, acnes, facials } = props;
  const updatedDate = resultLatest
    ? dayjs(resultLatest.create_at).format("MMMM D, YYYY")
    : "";

  return (
    <TouchableOpacity className="flex justify-center items-center mt-2" onPress={() => router.push(`/diary/${resultLatest?.id}`)}>
      <View className="bg-white rounded-3xl shadow-md flex items-center justify-center w-[350px] h-[246px]">
        <View className="flex-row items-center justify-center ">
          <View className="w-[148px] h-[200.95px]">
            <Image
              source={{ uri: resultLatest?.image }}
              className="w-[148px] h-[200.95px] rounded-2xl object-cover"
            />
          </View>

          <View className="flex flex-col justify-evenly ml-8 ">
            <Text className="text-label2 font-bold mb-1 mt-1">Skin Type:</Text>
            <View className="flex flex-row gap-2">
              {skins
                .filter((item) => item.id === resultLatest?.skin_id)
                .map((item, index) => (
                  <Avatar.Image
                    size={24}
                    key={index}
                    source={{ uri: item.image }}
                  />
                ))}
            </View>

            <Text className="text-label2 font-bold mb-1">Acne Type:</Text>
            <View className="flex flex-row gap-2">
              {acnes
                .filter((item) =>
                  resultLatest?.acne_type.some((acne) => acne.id === item.id)
                )
                .map((item, index) => (
                  <Avatar.Image
                    size={24}
                    key={index}
                    source={{ uri: item.image }}
                  />
                ))}
            </View>

            <Text className="text-label2 font-bold mb-1 ">Skin Problems:</Text>
            <View className="flex flex-row gap-2">
              {facials
                .filter((item) =>
                  resultLatest?.facial_type.some((facial) => facial.id === item.id)
                )
                .map((item, index) => (
                  <Avatar.Image
                    size={24}
                    key={index}
                    source={{ uri: item.image }}
                  />
                ))}
            </View>
          </View>
        </View>
      </View>

      <View className="flex-row justify-end mt-4 mr-16 w-full">
        <Text className="text-gray-500 text-label7">update {updatedDate}</Text>
      </View>
    </TouchableOpacity>
  );
};
