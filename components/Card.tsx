import { FC } from "react";
import { View, Text, Image, Pressable, TouchableOpacity } from "react-native";
import {
  CardSkincareProps,
  DiaryCardProps,
  CardReviewProps,
  ThreadCardProps,
  AddPhotoProps,
  ICommentCardProps,
} from "@/interface/Card";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { Heart } from "lucide-react-native";
import { LucideImage } from "lucide-react-native";
import { MediaType, launchImageLibrary } from "react-native-image-picker";

export const CardSkincare: FC<CardSkincareProps> = (props) => {
  const { image, name } = props;

  return (
    <View className="bg-white rounded-2xl shadow w-[115px] h-[130px] mx-2 mb-2 relative overflow-hidden">
      <View className="w-[115px] h-[115px] relative overflow-hidden">
        <Image
          source={{ uri: image || undefined }}
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

export const ReviewCard: FC<CardReviewProps> = (props) => {
  const { data, selectArray = [], setItem } = props;
  const check = selectArray.includes(data);

  return (
    <Pressable onPress={() => setItem(data)}>
      <View
        className={`flex-row items-center rounded-lg shadow p-4 mb-4 ${
          check ? "bg-[#CAC9C9]" : "bg-white"
        }`}
      >
        <Image
          source={{ uri: data.image }}
          className="w-[88px] h-[118px] rounded-lg ml-4 mr-6"
        />
        <View className="flex-1">
          <Text className={`text-label4 font-semibold `}>{data.name}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export const AddPhoto: FC<AddPhotoProps> = (props) => {
  const { image, setImage } = props;

  const openImagePicker = async () => {
    try {
      const options = {
        mediaType: "photo" as MediaType,
        maxHeight: 400,
        maxWidth: 400,
      };

      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.log("Image picker error: ", response.errorMessage);
        } else {
          setImage(response?.assets?.[0]?.uri || null);
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View className="mb-6">
      <TouchableOpacity
        onPress={openImagePicker}
        className={`border-2 p-4 ${
          !image ? "border-Bittersweet" : "border-Bittersweet"
        } rounded-lg flex items-center justify-center ${
          image ? "bg-gray-100" : "bg-[rgba(255,111,97,0.1)]"
        } w-[190px] h-[260px]`}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            className="w-[190px] h-[260px] rounded-lg object-cover"
          />
        ) : (
          <View className="flex items-center">
            <LucideImage size={24} className="text-red-500" />
            <Text className="text-black text-label1">Add a photo</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export const CommentCard: FC<ICommentCardProps> = (props) => {
  const { image, username, content, count_favorite = 1, favorite, handleFavoriteComment } = props;

  return (
    <View className="flex flex-row justify-between">
      <View className="flex flex-row gap-x-4">
        <Image
          source={{ uri: image || undefined }}
          style={{ width: 50, height: 50, borderRadius: 50 }}
        />
        <View className="flex justify-center gap-y-4">
          <Text className="text-xl">{username}</Text>
          <Text className=" text-lg">{content}</Text>
        </View>
      </View>
      <View className="flex justify-center items-center">
        <TouchableOpacity onPress={handleFavoriteComment}>
              <Heart size={24} color={favorite ? "red" : "gray"} />
        </TouchableOpacity>
        <Text>{count_favorite > 0 ? count_favorite : ""}</Text>
      </View>
    </View>
  );
};
