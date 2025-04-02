import { Heart, MessageCircle, Bookmark } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { ImagePagination } from "./paginate";
import { FC, useEffect, useState } from "react";
import { Image } from "expo-image";
import { ThreeDotMenu } from "@/components/ThreeDotMenu";
import { ButtonComponents } from "./Buntton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";
import useLoading from "@/hook/useLoading";

interface IActivityBar {
  favorite: boolean | undefined;
  favoriteCount: number | undefined;
  commnetCount: number;
  dataPaginate: any;
  currImage: number;
  bookmark: boolean | undefined;
  hadleFavorite: () => void;
  handleBookmark: () => void;
  isOpenComment: () => void;
}

export const ActivityBar: FC<IActivityBar> = (props) => {
  const {
    favorite,
    favoriteCount,
    commnetCount,
    dataPaginate,
    currImage,
    bookmark,
    hadleFavorite,
    handleBookmark,
    isOpenComment,
  } = props;

  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        marginLeft: 10,
        marginTop: -15,
        marginBottom: -10,
      }}
    >
      <View>
        <View style={{ flexDirection: "row", gap: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <TouchableOpacity onPress={hadleFavorite}>
              <Heart
                size={24}
                color={favorite ? "#FF6F61" : "#4A4A4A"}
                fill={favorite ? "#FF6F61" : "none"}
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 20 }}>{favoriteCount}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <TouchableOpacity onPress={isOpenComment}>
              <MessageCircle size={24} color="#4A4A4A" />
            </TouchableOpacity>
            <Text style={{ fontSize: 20 }}>{commnetCount}</Text>
          </View>
        </View>
      </View>
      <View>
        <ImagePagination data={dataPaginate} currImage={currImage} />
      </View>
      <View className="px-10">
        <TouchableOpacity onPress={handleBookmark}>
          <Bookmark
            size={24}
            color={bookmark ? "#FFD700" : "#4A4A4A"}
            fill={bookmark ? "#FFD700" : "none"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface UserBarProps {
  userImage?: string;
  username?: string;
  userId?: number;
  currentUserId: number | null;
  isFollowed?: boolean;
  onFollowStatusChange?: (isFollowing: boolean) => void;
}

export const UserBar: FC<UserBarProps> = (props) => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { userImage, username, currentUserId, userId, onFollowStatusChange } =
    props;
  const [isFollowing, setIsFollowing] = useState<boolean>(
    props.isFollowed || false
  );
  const isOwner =
    currentUserId != null && userId != null && currentUserId === userId;

  useEffect(() => {
    setIsFollowing(props.isFollowed || false);
  }, [props.isFollowed]);

  const handleFollow = async () => {
    if (!userId) {
      console.log("userId missing");
      return;
    }

    try {
      startLoading();

      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.post(`/user/follower/${userId}`, null, {
        headers: { token },
      });

      const newFollowStatus = res.data?.followed ?? !isFollowing;

      setIsFollowing(newFollowStatus);
      if (onFollowStatusChange) {
        onFollowStatusChange(newFollowStatus);
      }
    } catch (error: any) {
      console.log(
        "Follow toggle error:",
        error.response?.data || error.message
      );
    } finally {
      stopLoading();
    }
  };

  return (
    <View className="flex flex-row justify-between items-center px-3 py-2 ml-2">
      <View className="flex flex-row items-center gap-x-2 ">
        <Image
          source={{ uri: userImage }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
          }}
        />
        <Text>{username}</Text>
      </View>

      <View>
        {isOwner ? (
          <ThreeDotMenu />
        ) : (
          <TouchableOpacity
            onPress={handleFollow}
            disabled={isFollowing || isLoading}
          >
            <ButtonComponents
              onPress={handleFollow}
              title={isFollowing ? "following" : "follow"}
              className={`px-3 py-1 rounded-full ${
                isFollowing ? "bg-Bittersweet" : "bg-Bittersweet"
              }`}
              textSize="text-l font-semibold text-white"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
