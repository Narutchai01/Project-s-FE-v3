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
const defaultImage = require("@/assets/images/defaultImage.png");

export const CardSkincare: FC<CardSkincareProps> = (props) => {
  const { image, name } = props;

  return (
    <View className="bg-white rounded-2xl shadow w-[115px] h-[130px] mx-2 mb-2 relative overflow-hidden">
      <View className="w-[115px] h-[115px] relative overflow-hidden">
        <Image
          source={image ? { uri: image } : defaultImage}
          className="w-full h-full rounded-t-2xl object-cover"
        />
      </View>

      <View
        className="absolute -bottom-2 left-0 w-[100%] h-[35px] bg-white"
        style={{ borderTopLeftRadius: 13 }}
      >
        <View
          style={{
            position: "absolute",
            top: -12,
            right: 0,
            width: 0,
            height: 0,
            backgroundColor: "transparent",
            borderStyle: "solid",
            borderLeftWidth: 12,
            borderRightWidth: 0,
            borderBottomWidth: 20,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: "white",
          }}
        />
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
          : router.push(`/diary/${result_id}`)
      }
    >
       <View style={{ alignItems: 'center' }}>
      <View
        className={`flex-row items-center rounded-lg p-2 mb-4 mt-2 ${
          check && compareMode ? "bg-[#CAC9C9]" : "bg-white"
        }`}
        style={{
          width: '90%',
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Image
          source={data.image ? { uri: data.image } : defaultImage}
          className="w-[70px] h-[100px] rounded-lg ml-4 mr-6 mt-2 mb-2"
        />
        <View className="flex-1">
          <Text className={`text-label4 font-semibold `}>Date: {date}</Text>
          <Text className={`text-label6`}>Skin Type: {skinType}</Text>
          <Text className={`text-label6 `}>Acnes: {countAcne}</Text>
          <Text className={`text-label6`}>Skin Problems: {skinProblems}</Text>
        </View>
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
          source={image ? { uri: image } : defaultImage}
          className="w-full h-full rounded-t-2xl object-cover"
        />
      </View>

      <View
        className="absolute bottom-0 left-0 w-[120px] bg-white"
        style={{ borderTopLeftRadius: 13 }}
      >
        <View
          style={{
            position: "absolute",
            top: -12,
            right: 0,
            width: 0,
            height: 0,
            backgroundColor: "transparent",
            borderStyle: "solid",
            borderLeftWidth: 12,
            borderRightWidth: 0,
            borderBottomWidth: 20,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: "white",
          }}
        />
        <View className="p-2">
          <Text
            className="text-label12 font-medium mb-1 " 
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ width: 100 }}
          >
            {title?.trim() ? title : "No title"}
          </Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Image
                source={userAvatar ? { uri: userAvatar } : defaultImage}
                className="w-5 h-5 rounded-full mr-2"
              />
              <Text 
              className="text-label13 text-gray-600"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ width: 60 }}
              >{user}</Text>
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

export const CommunityCard: FC<ThreadCardProps> = (props) => {
  const { image, title, user, userAvatar } = props;

  return (
    <View
      className="bg-white rounded-2xl shadow mb-6 relative overflow-hidden"
      style={{ width: 140, height: 185, marginHorizontal: 8 }}
    >
      <View className="w-[160px] h-[135px] relative overflow-hidden">
        <Image
          source={image ? { uri: image } : defaultImage}
          className="w-full h-full rounded-t-2xl object-cover"
        />
      </View>

      <View
        className="absolute -bottom-2 left-0 w-[100%] bg-white p-3"
        style={{ borderTopLeftRadius: 13 }}
      >
        <View
          style={{
            position: "absolute",
            top: -12,
            right: 0,
            width: 0,
            height: 0,
            backgroundColor: "transparent",
            borderStyle: "solid",
            borderLeftWidth: 12,
            borderRightWidth: 0,
            borderBottomWidth: 20,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: "white",
          }}
        />
        <Text
          className="text-label2 font-medium"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title?.trim() ? title : "No title"}
        </Text>
        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            <Image
              source={{ uri: userAvatar }}
              className="w-5 h-5 rounded-full mr-2"
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="text-label6 text-gray-600"
              style={{ width: 75 }}
            >
              {user}
            </Text>
          </View>

          <TouchableOpacity className="w-7 h-7 bg-White rounded-full flex items-center justify-center">
            <Heart size={12} color="gray" />
          </TouchableOpacity>
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
          source={data.image ? { uri: data.image } : defaultImage}
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
            source={image ? { uri: image } : defaultImage}
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

export const CardListPopularSkincare: FC<CardSkincareProps> = (props) => {
  const { image, name } = props;

  return (
    <View
      className="bg-white rounded-2xl shadow mb-6 relative overflow-hidden"
      style={{ width: 140, height: 185, marginHorizontal: 8 }}
    >
      <View className="w-[165px] h-[160px] relative overflow-hidden">
        <Image
          source={image ? { uri: image } : defaultImage}
          className="w-full h-full rounded-t-2xl object-cover"
        />
      </View>

      <View
        className="absolute -bottom-2 left-0 w-[100%] h-[50px] p-3 bg-white"
        style={{ borderTopLeftRadius: 13 }}
      >
        <View
          style={{
            position: "absolute",
            top: -12,
            right: 0,
            width: 0,
            height: 0,
            backgroundColor: "transparent",
            borderStyle: "solid",
            borderLeftWidth: 12,
            borderRightWidth: 0,
            borderBottomWidth: 20,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: "white",
          }}
        />

        <Text
          className="text-label2 font-medium w-full"
          numberOfLines={1}
              ellipsizeMode="tail"
              style={{ width: 120 }}
        >
          {name?.trim() ? name : "Not found"}
        </Text>
      </View>
    </View>
  );
};

export const CommentCard: FC<ICommentCardProps> = (props) => {
  const {
    image,
    username,
    content,
    count_favorite = 1,
    favorite,
    handleFavoriteComment,
  } = props;

  return (
    <View className="flex flex-row justify-between ml-3 mr-3">
      <View className="flex flex-row gap-x-4">
        <Image
          source={image ? { uri: image } : defaultImage}
          style={{ width: 40, height: 40, borderRadius: 50 }}
        />
        <View className="flex justify-center gap-y-3">
          <Text className="text-lg">{username}</Text>
          <Text className="text-base -mt-2">{content}</Text>
        </View>
      </View>
      <View className="flex justify-center items-center">
        <TouchableOpacity onPress={handleFavoriteComment}>
        <Heart
                size={24}
                color={favorite ? "#FF6F61" : "#4A4A4A"}
                fill={favorite ? "#FF6F61" : "none"}
              />
        </TouchableOpacity>
        <Text>{count_favorite > 0 ? count_favorite : ""}</Text>
      </View>
    </View>
  );
};

interface CompareDiaryProps {
  image: string;
  date: Date;
}

export const CompareDiary: FC<CompareDiaryProps> = (props) => {
  const { image, date } = props;
  const formattedDate = dayjs(date).format("DD/MM/YYYY");

  return (
    <View className="items-center bg-white shadow-md p-3 rounded-lg mx-2 w-[30%] h-[160px]">
      <View className="w-[95%] h-[100px] rounded-md ">
        <Image
          source={{ uri: image }}
          className="w-full h-full rounded-md object-cover "
        />
      </View>
      <Text className="text-label2 mt-2 self-start">Date</Text>
      <Text className="text-label2 mb-2 self-start">{formattedDate}</Text>
    </View>
  );
};

export const CardSkincareReccommemded: FC<CardSkincareProps> = (props) => {
  const { image, name } = props;

  return (
    <View className="bg-white rounded-2xl shadow w-[90%] h-[105px] relative overflow-hidden">
      <View
        style={{
          position: "absolute",
          top: 65,
          right: 0,
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderLeftWidth: 12,
          borderRightWidth: 0,
          borderBottomWidth: 20,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: "white",
          zIndex: 10,
        }}
      />
      <View className="w-[100px] h-[100px] relative overflow-hidden rounded-2xl">
        <Image
          source={image ? { uri: image } : defaultImage}
          className="w-full h-full object-cover"
        />
      </View>

      <View
        className="absolute bottom-0 left-0 w-[120px] h-[30px] bg-white"
        style={{ borderTopLeftRadius: 13 }}
      >
        <View className="p-2">
          <Text
            className="text-label12 font-medium w-full"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ width: 60 }}
          >
            {name}
          </Text>
        </View>
      </View>
    </View>
  );
};
