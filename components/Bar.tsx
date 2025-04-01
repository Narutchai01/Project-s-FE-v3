import { Heart, MessageCircle, Bookmark } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { ImagePagination } from "./paginate";
import { FC } from "react";
import { Image } from "expo-image";

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
              <Heart size={24} color={favorite ? "#FF6F61" : "#4A4A4A"} />
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
          <Bookmark size={24} color={bookmark ? "#FF6F61" : "#4A4A4A"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const UserBar: FC<any> = (props) => {
  const { userImage, username } = props;

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
        {/* <ButtonComponents
          title="follow"
          className="bg-Bittersweet px-10 py-2 rounded-full"
          textSize="text-xl font-semibold text-white"
        /> */}

        
      </View>
    </View>
  );
};
