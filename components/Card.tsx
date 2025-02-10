import { FC } from "react";
import { View, Text, Image } from "react-native";

interface CardSkincareProps {
  image: string;
  name: string;
}

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
