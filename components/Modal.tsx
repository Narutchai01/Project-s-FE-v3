import { FC, useEffect } from "react";
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { RadioComponents } from "./Radio";
import { ButtonComponents } from "./Buntton";
import { SquareArrowLeft, Image as ImageIcon } from "lucide-react-native";
import { Image } from "expo-image";
import * as DocumentPicker from "expo-document-picker";
import { axiosInstance } from "@/lib/axios_instance";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import LoadingIndicator from "@/components/Loading";
import useLoading from "@/hook/useLoading";
import { ReviewCard } from "./Card";
import Loading from "@/components/Loading";
import { useCompare } from "@/context/CompareContext";
import { ISkincare } from "@/interface/skincare";
import { CardPopularSkincare } from "./Card";
import { useSkincareStore } from "@/store/skincare"; 
import { ICommentThread } from "@/interface/comment";
import { CommentCard } from "./Card";
import { CircleArrowUp } from "lucide-react-native";

interface PropsModalSensitiveSkin {
  isOpen: boolean;
  setSensitiveSkin: (sensitiveSkin: boolean) => void;
  onPres: () => void;
}


export const ModalSensitiveSkin: FC<PropsModalSensitiveSkin> = (props) => {
  const { isOpen, setSensitiveSkin, onPres } = props;
  return (
    <Modal visible={isOpen} animationType="slide">
      <View className="w-full h-full p-5 flex items-center justify-center gap-y-10">
        <Text className=" text-Heading3">
          Do you have sensitive facial skin?
        </Text>
        <RadioComponents setValue={setSensitiveSkin} />
        <ButtonComponents
          title="Save"
          onPress={onPres}
          className="bg-Bittersweet px-10 py-4 rounded-full"
          textSize="text-lg font-semibold text-White"
        />
      </View>
    </Modal>
  );
};

export const ModalCreateThread: FC<any> = (props) => {
  const router = useRouter();
  const { isOpen } = props;
  const { isLoading, startLoading, stopLoading } = useLoading();

  const [image, setImage] = useState<string[] | null>(null);
  const [thread, setThread] = useState({
    title: "",
    caption: "",
  });

  const handleChange = (key: string, value: string) => {
    setThread({ ...thread, [key]: value });
  };

  const handleChooseImage = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      copyToCacheDirectory: true,
      multiple: true,
    });

    if (result.canceled === false) {
      for (let i = 0; i < result.assets.length; i++) {
        setImage((prev) => {
          if (prev) {
            return [...prev, result.assets[i].uri];
          }
          return [result.assets[i].uri];
        });
      }
    }
  };

  const handleCreateThread = async () => {
    startLoading();
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const formData = new FormData();
      formData.append("title", thread.title);
      formData.append("caption", thread.caption);
      if (image) {
        image.forEach((img) => {
          const file = {
            uri: img,
            name: "image.jpg",
            type: "image/jpeg",
          };
          formData.append("files", file as unknown as Blob);
        });
      }
      await axiosInstance
        .post("/thread", formData, {
          headers: {
            token: token,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.status) {
            router.push(`/thread/${res.data.data.id}`);
          }
        });
    } catch (error) {
      console.log(error);
    } finally {
      stopLoading();
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide">
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ScrollView>
          <View className="h-16 bg-White">
            {/* header zone  */}
            <View className=" h-full flex-row items-center justify-between px-3">
              <TouchableOpacity className="flex flex-row gap-x-3 items-center">
                <SquareArrowLeft size={28} color="#4A4A4A" />
                <Text className="text-2xl font-semibold text-Quartz">
                  New Thread
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* header zone  */}

          <View className="flex justify-center items-center">
            <FlatList
              data={image}
              keyExtractor={(_, index: number) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              ListHeaderComponent={() => {
                return (
                  <TouchableOpacity
                    onPress={handleChooseImage}
                    style={{
                      height: 350,
                      width: 250,
                      borderRadius: 10,
                      borderColor: "black",
                      borderWidth: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 10, // Add gap between elements
                    }}
                  >
                    <View>
                      <ImageIcon size={100} color="#4A4A4A" />
                      <Text>Tap a photo</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              renderItem={({ item }: { item: string }) => (
                <Image
                  source={{ uri: item }}
                  style={{
                    width: 250,
                    height: 350,
                    borderRadius: 10,
                    marginTop: 10,
                    marginRight: 10, // Add gap between elements
                  }}
                />
              )}
            />
            <View className="w-full container mx-auto px-10 py-10 gap-y-4">
              <TextInput
                placeholder="Title"
                className=" border-2  w-full rounded-full p-6 border-BrightGray"
                onChangeText={(title) => handleChange("title", title)}
              />
              <TextInput
                placeholder="Add Caption"
                multiline
                style={{
                  minHeight: 100,
                  borderRadius: 30,
                }}
                className=" border-2  w-full  p-6 border-BrightGray"
                onChangeText={(caption) => handleChange("caption", caption)}
              />
            </View>
            <ButtonComponents
              title="Create Thread"
              onPress={handleCreateThread}
              className="bg-Bittersweet px-10 py-4 rounded-full"
              textSize="text-lg font-semibold text-White"
            />
          </View>
        </ScrollView>
      )}
    </Modal>
  );
};

export function ModalSkincare({ isOpen, onClose, setSkincare, skincare }: any) {
  const { skincares } = useCompare();
  const { isLoading } = useLoading();

  const handleSelectItem = (item: ISkincare) => {
    if (skincare.includes(item) || skincare.length >= 10) {
      setSkincare((prev: ISkincare[]) =>
        prev.filter((prevItem: ISkincare) => prevItem.id !== item.id)
      );
    } else {
      setSkincare((prev: ISkincare[]) => [...prev, item]);
    }
  };

  const handleConfirm = () => {
    onClose();
  };

  const handleCancel = () => {
    setSkincare([]);
    onClose();
  };

  return (
    <Modal visible={isOpen} animationType="slide" onRequestClose={handleCancel}>
      <SafeAreaView className="flex-1 bg-Snow p-8">
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <ButtonComponents
            title="cancel"
            textSize="text-md font-semibold"
            onPress={handleCancel}
          />
          <ButtonComponents
            title="Confirm"
            className="bg-Bittersweet px-2 py-2 rounded-full"
            textSize="text-md font-semibold"
            onPress={handleConfirm}
          />
        </View>

        <View className="flex items-center mb-4">
          <Text className="text-Heading3 font-semibold text-center">
            Select skincares to review ({skincare?.length}/10)
          </Text>
        </View>

        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={skincares}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ReviewCard
                data={item}
                selectArray={skincare}
                setItem={() => handleSelectItem(item)}
              />
            )}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

interface ModalSkincareDetailProps {
  isOpen: boolean;
  onClose: () => void;
}
export const ModalSkincareDetail: FC<ModalSkincareDetailProps> = (props) => {
  const { isOpen, onClose } = props;
  const { skincare } = useSkincareStore();
  const { isLoading } = useLoading();
  const { width, height } = Dimensions.get("window");

  return (
    <Modal visible={isOpen} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView>
        <View className="h-16 bg-Snow mb-4">
          <View className="h-full flex-row items-center justify-between px-3">
            <TouchableOpacity className="flex flex-row gap-x-3 items-center" onPress={onClose}>
              <SquareArrowLeft size={28} color="#4A4A4A" />
              <Text className="text-Heading3 font-semibold text-Quartz">
                {skincare?.name || "Skincare Detail"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#4A4A4A" />
          </View>
        ) : skincare ? (
          <ScrollView>
            <Image 
              source={{ uri: skincare.image }} 
              style={{ 
                width: width - 20, 
                height: height * 0.5, 
                borderRadius: 10, 
                alignSelf: "center" 
              }} 
            />
            
            <Text className="text-label4 font-semibold mt-4 text-start px-4">
              {skincare.name}
            </Text>
            <Text className="text-slabel4 mt-2 text-start px-4">
              {skincare.description}
            </Text>
          </ScrollView>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-gray-600">Skincare not found</Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};
interface IModalComment {
  isCommentOpen: boolean;
  comments: ICommentThread[];
  handleFavoriteComment: (comment_id: number) => void;
  isCommentCloase: () => void;
  handleComment: () => void;
  setComment: (content: string) => void;
}

export const ModalComment: FC<IModalComment> = (props) => {
  const {
    isCommentOpen,
    comments,
    handleFavoriteComment,
    isCommentCloase,
    handleComment,
    setComment,
  } = props;

  return (
    <Modal visible={isCommentOpen} animationType="slide" transparent={true}>
      <View className="bg-white h-full rounded-t-3xl container mx-auto px-4 py-10">
        <View className="flex gap-y-4">
          <TouchableOpacity onPress={isCommentCloase}>
            <View className="bg-black h-1 container mx-auto w-4/12"></View>
          </TouchableOpacity>
          <Text className="text-center text-3xl font-bold mb-8">Comments</Text>
        </View>
        <FlatList
          data={comments}
          numColumns={1}
          contentContainerStyle={{ gap: 25 }} // Add gap between columns
          renderItem={({ item }) => (
            <CommentCard
              id={item.id}
              image={item?.user?.image}
              username={item?.user?.full_name}
              content={item?.text}
              count_favorite={item.favorite_count}
              favorite={item.favorite}
              handleFavoriteComment={() => handleFavoriteComment(item.id)}
            />
          )}
        />

        <View className="flex flex-row justify-center container mx-auto px-5 gap-x-2 items-center py-2">
          <TextInput
            className=" border-Quartz border-2 w-full rounded-full py-4"
            placeholder="share your thoughts"
            onChangeText={(content) => setComment(content)}
          />
          <TouchableOpacity onPress={handleComment}>
            <CircleArrowUp size={36} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
