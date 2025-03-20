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
import { BackButtonComponents, ButtonComponents } from "./Buntton";
import { Image as ImageIcon } from "lucide-react-native";
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
import { useSkincareStore } from "@/store/skincare";
import { ICommentReview, ICommentThread } from "@/interface/comment";
import { CommentCard } from "./Card";
import { CircleArrowUp } from "lucide-react-native";
import { Search } from "@/components/Search";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

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
  const { isOpen, onClose, isMode } = props;
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [image, setImage] = useState<string[] | null>(null);
  const [thread, setThread] = useState({
    title: "",
    caption: "",
  });

  const handleRemoveImage = (index: number) => {
    setImage((prev) => {
      if (!prev) return null;
      const updatedImages = [...prev];
      updatedImages.splice(index, 1);
      return updatedImages.length > 0 ? updatedImages : null;
    });
  };

  const handleCancel = () => {
    setThread({ title: "", caption: "" });
    setImage(null);
    onClose();
  };

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
      handleCancel();
    }
  };

  return (
    <Modal visible={isOpen && isMode} animationType="slide">
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ScrollView>
          <View className="h-16 bg-White">
            {/* header zone  */}
            <View className=" h-full flex-row items-center justify-between px-3">
              <BackButtonComponents
                title={"New Thread"}
                textSize="text-Heading3 text-Quartz"
                onPress={handleCancel}
              />
            </View>
          </View>
          {/* header zone  */}

          <View className="flex justify-center items-center">
            {!image ? (
              <TouchableOpacity
                onPress={handleChooseImage}
                style={{
                  height: 350,
                  width: 250,
                  borderRadius: 10,
                  backgroundColor: "#FCECEC",
                  borderColor: "#FF6F61",
                  borderWidth: 2,
                  display: "flex",
                  marginTop: 11,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View className="flex items-center justify-center">
                  <ImageIcon size={50} color="#4A4A4A" />
                  <Text className="text-label8 mt-2">Tap a photo</Text>
                </View>
              </TouchableOpacity>
            ) : (
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
                        backgroundColor: "#FCECEC",
                        borderColor: "#FF6F61",
                        borderWidth: 2,
                        display: "flex",
                        marginTop: 11,
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 10,
                      }}
                    >
                      <View className="flex items-center justify-center">
                        <ImageIcon size={50} color="#4A4A4A" />
                        <Text className="text-label8 mt-2">Tap a photo</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                renderItem={({
                  item,
                  index,
                }: {
                  item: string;
                  index: number;
                }) => (
                  <View
                    style={{
                      position: "relative",
                      marginRight: 10,
                      marginTop: 10,
                    }}
                  >
                    <Image
                      source={{ uri: item }}
                      style={{
                        width: 250,
                        height: 350,
                        borderRadius: 10,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => handleRemoveImage(index)}
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                      }}
                    >
                      <Ionicons
                        name="close-circle"
                        size={30}
                        color="#4A4A4ACC"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}

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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSkincares = skincares?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <SafeAreaView className="bg-Snow p-4 flex-1">
        <View className="flex flex-row items-center justify-between">
          <ButtonComponents
            title="Cancel"
            textSize="text-label1 font-semibold"
            onPress={handleCancel}
          />
          <View className="flex flex-row items-center justify-between">
            <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <ButtonComponents
              title="Confirm"
              className="bg-Bittersweet px-2 py-2 rounded-full"
              textSize="text-label1 font-semibold text-White"
              onPress={handleConfirm}
            />
          </View>
        </View>

        <View className="flex items-center mb-4 mt-4">
          <Text className="text-Heading3 font-semibold text-center">
            Select skincares to review ({skincare?.length}/10)
          </Text>
        </View>

        {isLoading ? (
          <Loading />
        ) : filteredSkincares.length > 0 ? (
          <FlatList
            data={filteredSkincares}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ReviewCard
                data={item}
                selectArray={skincare}
                setItem={() => handleSelectItem(item)}
              />
            )}
          />
        ) : (
          <View className="flex items-center justify-center h-40">
            <Text className="text-label8">No results found</Text>
          </View>
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
      <SafeAreaView className="flex-1 bg-Snow p-4">
        <View className="h-16 bg-Snow mb-4">
          <View className="h-full flex-row items-center justify-between px-3">
            <BackButtonComponents
              title={skincare?.name || "Skincare Detail"}
              textSize="text-Heading3"
              onPress={onClose}
            />
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
                alignSelf: "center",
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
  isCommentClose: () => void;
  comments: (ICommentReview | ICommentThread)[];
  handleFavoriteComment: (comment_id: number) => void;
  handleComment: () => void;
  setComment: (content: string) => void;
  commentContent: string;
}

export const ModalComment: React.FC<IModalComment> = ({
  isCommentOpen,
  isCommentClose,
  comments,
  handleFavoriteComment,
  handleComment,
  setComment,
  commentContent,
}) => {
  return (
    <Modal
      visible={isCommentOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={isCommentClose}
    >
      <View className="bg-white h-full rounded-t-3xl container mx-auto px-4 py-10">
        <View className="flex gap-y-4">
          <TouchableOpacity onPress={isCommentClose}>
            <View className="bg-black h-1 container mx-auto w-2/12 rounded-lg"></View>
          </TouchableOpacity>
          <Text className="text-center text-3xl font-bold mb-8">Comments</Text>
        </View>

        <FlatList
          data={comments}
          numColumns={1}
          contentContainerStyle={{ gap: 25 }}
          renderItem={({ item }) => (
            <CommentCard
              id={item.id}
              image={item?.user?.image}
              username={item?.user?.full_name}
              content={item?.content}
              count_favorite={item.favorite_count}
              favorite={item.favorite}
              handleFavoriteComment={() => handleFavoriteComment(item.id)}
            />
          )}
        />

        <View className="flex flex-row justify-center container mx-auto px-5 gap-x-2 items-center py-2">
          <TextInput
            className="border-Quartz border-2 w-full rounded-full py-4 px-4 mx-2"
            placeholder="Share your thoughts..."
            value={commentContent}
            onChangeText={setComment}
          />
          <TouchableOpacity
            onPress={() => {
              handleComment();
              setComment("");
            }}
          >
            <CircleArrowUp size={36} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export const ModalCreateReviewPost: FC<any> = (props) => {
  const router = useRouter();
  const { isOpen, onClose, isMode } = props;
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skincare, setSkincare] = useState<ISkincare[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [review, setReview] = useState({
    title: "",
    content: "",
  });

  const handleCancel = () => {
    setReview({ title: "", content: "" });
    setSkincare([]);
    setImage(null);
    onClose();
  };

  const handleChange = (key: string, value: string) => {
    setReview({ ...review, [key]: value });
  };

  const handleSelectSkincare = () => {
    setIsModalOpen(true);
  };

  const pickImageAsync = async () => {
    const result: ImagePicker.ImagePickerResult =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setImage(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  const handlePostReview = async () => {
    startLoading();
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const formData = new FormData();
      formData.append("title", review.title);
      formData.append("content", review.content);
      formData.append(
        "skincare_id",
        JSON.stringify(skincare.map((item) => item.id))
      );
      if (image) {
        const file = {
          uri: image,
          name: "image.jpg",
          type: "image/jpeg",
        };
        formData.append("file", file as unknown as Blob);
      }
      await axiosInstance
        .post("/reviews", formData, {
          headers: {
            token: token,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.status) {
            router.push(`/review/${res.data.data.id}`);
          }
        });
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
      handleCancel();
    }
  };

  return (
    <Modal visible={!isMode && isOpen} animationType="slide">
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ScrollView className="p-4">
          <BackButtonComponents
            title="New Review"
            textSize="text-Heading3 text-Quartz"
            onPress={handleCancel}
          />

          <View className="mb-4">
            <Text className="text-Heading4">Thumbnail</Text>
          </View>

          <View className="mb-4 flex items-center justify-center">
            <TouchableOpacity
              onPress={pickImageAsync}
              style={{
                height: 350,
                width: 250,
                borderRadius: 10,
                backgroundColor: "#FCECEC",
                borderColor: "#FF6F61",
                borderWidth: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: 250, height: 350, borderRadius: 10 }}
                />
              ) : (
                <View className="flex items-center justify-center">
                  <ImageIcon size={50} color="#4A4A4A" />
                  <Text className="text-label8 mt-2">Tap a photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <View className="border-b-2 border-gray-300 mb-4"></View>
            <View className="flex flex-row items-center justify-between mb-2">
              <Text className="text-Heading4">Select skincare</Text>
              <ButtonComponents
                title="Select"
                className="bg-Bittersweet px-2 py-2 rounded-full w-[80px] flex items-center justify-center"
                textSize="text-md font-semibold text-white"
                onPress={handleSelectSkincare}
              />
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {skincare.length > 0 ? (
                skincare.map((item: ISkincare) => (
                  <View key={item.id} className="mb-4 mr-2">
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: 100, height: 120, borderRadius: 10 }}
                    />
                    <View className="flex items-center justify-center mt-2">
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{ width: 100, textAlign: "center" }}
                      >
                        {item.name}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text>No skincare selected</Text>
              )}
            </ScrollView>
          </View>

          <View className="mb-4">
            <TextInput
              placeholder="Title"
              onChangeText={(title) => handleChange("title", title)}
              className="border-2 w-full rounded-full p-6 border-BrightGray"
            />
          </View>

          <View className="mb-4">
            <TextInput
              placeholder="Add Content"
              multiline
              style={{
                minHeight: 100,
                borderRadius: 30,
              }}
              className=" border-2  w-full  p-6 border-BrightGray"
              onChangeText={(content) => handleChange("content", content)}
            />
          </View>

          <View className="flex flex-row items-center justify-center mb-2">
            <ButtonComponents
              title="Post"
              className="bg-Bittersweet px-2 py-2 rounded-full w-[80px] flex items-center justify-center"
              textSize="text-md font-semibold text-white"
              onPress={handlePostReview}
            />
          </View>

          <ModalSkincare
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            skincare={skincare}
            setSkincare={setSkincare}
          />
        </ScrollView>
      )}
    </Modal>
  );
};
