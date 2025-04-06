import { FC, useCallback, useEffect } from "react";
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
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { RadioComponents } from "./Radio";
import { BackButtonComponents, ButtonComponents } from "./Buntton";
import { Image as ImageIcon, SquareArrowLeft } from "lucide-react-native";
import { Image } from "expo-image";
import * as DocumentPicker from "expo-document-picker";
import { axiosInstance } from "@/lib/axios_instance";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useRouter } from "expo-router";
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
import { ConfirmAlert } from "./Alert";
import { AxiosError } from "axios";

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
        <RadioComponents setValue={setSensitiveSkin} value={null} />
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

interface IModalCreateThreadProps {
  isOpen: boolean;
  onClose: () => void;
  isMode: boolean;
}

export const ModalCreateThread: FC<IModalCreateThreadProps> = (props) => {
  const router = useRouter();
  const { isOpen, onClose, isMode } = props;
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [image, setImage] = useState<string[] | null>(null);
  const [thread, setThread] = useState({
    title: "",
    caption: "",
  });

  const handle404Error = (error: unknown) => {
    const axiosError = error as AxiosError;
    if (axiosError?.response?.status === 404 && !alertVisible) {
      setAlertMessage("Your session has expired or account not found.");
      setAlertVisible(true);
    }
  };

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
    if (!thread.title || !thread.caption || !image) {
      setIsAlertVisible(true);
      return;
    }

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
      handle404Error(error);
      console.log(error);
    } finally {
      stopLoading();
      handleCancel();
    }
  };

  return (
    <>
      <Modal visible={isOpen && isMode} animationType="slide">
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <SafeAreaView className="flex-1 bg-Snow p-6">
            <ScrollView>
              {/* header zone  */}
              <BackButtonComponents
                title={"New Thread"}
                textSize="text-Heading3 text-Quartz"
                onPress={handleCancel}
              />

              {/* header zone  */}
              <View className="flex justify-center items-center">
                {!image ? (
                  <TouchableOpacity
                    onPress={handleChooseImage}
                    style={{
                      height: 300,
                      width: 200,
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
                      <ImageIcon size={35} color="#4A4A4A" />
                      <Text className="text-label1 mt-2">Tap a photo</Text>
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
                            height: 300,
                            width: 200,
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
                            <ImageIcon size={35} color="#4A4A4A" />
                            <Text className="text-label1 mt-2">
                              Tap a photo
                            </Text>
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
                            width: 200,
                            height: 300,
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
                    className=" border-2  w-full rounded-full p-4 border-BrightGray"
                    onChangeText={(title) => handleChange("title", title)}
                  />
                  <TextInput
                    placeholder="Add Caption"
                    multiline
                    style={{
                      minHeight: 100,
                      borderRadius: 30,
                    }}
                    className=" border-2  w-full  p-4 border-BrightGray"
                    onChangeText={(caption) => handleChange("caption", caption)}
                  />
                </View>
                <ButtonComponents
                  title="Create Thread"
                  onPress={handleCreateThread}
                  className="bg-Bittersweet px-6 py-3 rounded-full"
                  textSize="text-lg font-semibold text-White"
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>

      <ConfirmAlert
        visible={isAlertVisible}
        onClose={() => setIsAlertVisible(false)}
        title="Please complete all fields before submitting."
        confirm="OK"
      />
      <ConfirmAlert
        visible={alertVisible}
        title={alertMessage}
        confirm="Back to login"
        onClose={() => {
          setAlertVisible(false);
          router.replace("/login");
        }}
      />
    </>
  );
};
interface IModalSkincare {
  isOpen: boolean;
  onClose: () => void;
  setSkincare: (
    skincare: ISkincare[] | ((prev: ISkincare[]) => ISkincare[])
  ) => void;
  skincare: ISkincare[];
}

export const ModalSkincare: FC<IModalSkincare> = (props) => {
  const { isOpen, onClose, setSkincare, skincare } = props;
  const { skincares } = useCompare();
  const { isLoading } = useLoading();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [selectSkincare, setSelectSkincare] = useState<ISkincare[]>([]);

  const filteredSkincares = skincares?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectItem = (item: ISkincare) => {
    const isSelected = skincare.some((selected) => selected.id === item.id);

    if (isSelected) {
      setSkincare((prev) => prev.filter((prevItem) => prevItem.id !== item.id));
    } else if (skincare.length >= 10) {
      setIsAlertVisible(true);
    } else {
      setSkincare((prev) => [...prev, item]);
    }
  };

  const handleConfirm = () => {
    setSearchQuery("");
    setIsSearchOpen(false);
    onClose();
  };

  const handleCancel = () => {
    setSkincare(selectSkincare);
    setSearchQuery("");
    setIsSearchOpen(false);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setSelectSkincare(skincare);
    }
  }, [isOpen]);

  return (
    <>
      <Modal
        visible={isOpen}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <SafeAreaView className="bg-Snow p-4 flex-1">
          <View className="flex flex-row items-center justify-between">
            <ButtonComponents
              title="Cancel"
              textSize="text-label4 font-semibold text-Bittersweet ml-3"
              onPress={handleCancel}
            />
            <View className="flex flex-row items-center justify-between">
            <Search   searchQuery={searchQuery}
            isSearchOpen={isSearchOpen}
            setSearchQuery={setSearchQuery}
            setIsSearchOpen={setIsSearchOpen} />
              <ButtonComponents
                title="Confirm"
                className="bg-Bittersweet px-2 rounded-full h-8 flex items-center justify-center"
                textSize="text-label4 text-white font-semibold"
                onPress={handleConfirm}
              />
            </View>
          </View>
          <View className="flex items-center mb-6 mt-6">
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

      <ConfirmAlert
        visible={isAlertVisible}
        onClose={() => setIsAlertVisible(false)}
        title="You can only select up to 10 items."
        confirm="OK"
      />
    </>
  );
};
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
        <View className="h-16 bg-Snow mb-1">
          <View className="h-full flex-row items-center justify-between px-1">
            <TouchableOpacity
              onPress={onClose}
              className="mb-4 flex-row items-center gap-x-1"
            >
              <SquareArrowLeft size={28} color="#4A4A4A" />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ width: 275 }}
                className="text-Heading3 text-Quartz "
              >
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
                width: width - 30,
                height: height * 0.5,
                borderRadius: 15,
                alignSelf: "center",
              }}
            />

            <Text className="text-Heading4 font-semibold mt-4 text-start ">
              {skincare.name}
            </Text>
            <Text className="text-slabel4 mt-2 text-start px-1 mb-4">
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
      <TouchableWithoutFeedback onPress={isCommentClose}>
        <View className="flex-1  bg-black/30 justify-end">
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{
                height: "75%",
                backgroundColor: "white",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
              }}
            >
              <View className="px-4 py-6 h-full">
                <TouchableOpacity onPress={isCommentClose}>
                  <View className="bg-Quartz h-1 w-1/5 self-center rounded-lg mb-4"></View>
                </TouchableOpacity>

                <Text className="text-center text-2xl font-bold mb-4">
                  Comments
                </Text>

                <FlatList
                  data={comments ?? []}
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
                      handleFavoriteComment={() =>
                        handleFavoriteComment(item.id)
                      }
                    />
                  )}
                />

                <View className="flex flex-row justify-center container mx-auto px-8 gap-x-2 items-center py-2">
                  <TextInput
                    className="border-Quartz border-2 w-full rounded-full py-4 px-4 mx-1"
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
                    <CircleArrowUp size={34} color="#4A4A4A" />
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

interface IModalCreateReviewPostProps {
  isOpen: boolean;
  onClose: () => void;
  isMode: boolean;
}

export const ModalCreateReviewPost: FC<IModalCreateReviewPostProps> = (
  props
) => {
  const router = useRouter();
  const { isOpen, onClose, isMode } = props;
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [skincare, setSkincare] = useState<ISkincare[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [review, setReview] = useState({
    title: "",
    content: "",
  });

  const handle404Error = (error: unknown) => {
    const axiosError = error as AxiosError;
    if (axiosError?.response?.status === 404 && !alertVisible) {
      setAlertMessage("Your session has expired or account not found.");
      setAlertVisible(true);
    }
  };

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
    }
  };

  const handlePostReview = async () => {
    if (!review.title || !review.content || skincare.length === 0 || !image) {
      setIsAlertVisible(true);
      return;
    }

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
      handle404Error(error);
      console.error(error);
    } finally {
      stopLoading();
      handleCancel();
    }
  };

  return (
    <>
      <Modal visible={!isMode && isOpen} animationType="slide">
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <SafeAreaView className="flex-1 bg-Snow p-6">
            <ScrollView>
              <BackButtonComponents
                title="New Review"
                textSize="text-Heading3 text-Quartz"
                onPress={handleCancel}
              />

              <View className="mb-4">
                <Text className="text-Heading4">Thumbnail</Text>
              </View>

              <View className="mb-6 flex items-center justify-center">
                <TouchableOpacity
                  onPress={pickImageAsync}
                  style={{
                    height: 300,
                    width: 200,
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
                      style={{ width: 200, height: 300, borderRadius: 10 }}
                    />
                  ) : (
                    <View className="flex items-center justify-center">
                      <ImageIcon size={35} color="#4A4A4A" />
                      <Text className="text-label1 mt-2">Tap a photo</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <View className="mb-4">
                <View className="border-b-2 border-gray-300 mb-4 w-full"></View>
                <View className="flex flex-row items-center justify-between mb-2">
                  <Text className="text-Heading4">Select skincare</Text>
                  <ButtonComponents
                    title="Select"
                    className="bg-Bittersweet px-3 py-1.5 rounded-full flex items-center justify-center"
                    textSize="text-label4 text-white font-semibold"
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
                  className="border-2 w-full rounded-full p-4 border-BrightGray"
                />
              </View>

              <View className="mb-6">
                <TextInput
                  placeholder="Add Content"
                  multiline
                  style={{
                    minHeight: 100,
                    borderRadius: 30,
                  }}
                  className=" border-2  w-full  p-4 border-BrightGray"
                  onChangeText={(content) => handleChange("content", content)}
                />
              </View>

              <View className="flex flex-row items-center justify-center mb-2">
                <ButtonComponents
                  title="Create Review"
                  className="bg-Bittersweet px-6 py-3 rounded-full"
                  textSize="text-lg font-semibold text-White"
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
          </SafeAreaView>
        )}
      </Modal>

      <ConfirmAlert
        visible={isAlertVisible}
        onClose={() => setIsAlertVisible(false)}
        title="Please complete all fields before submitting."
        confirm="OK"
      />
      <ConfirmAlert
        visible={alertVisible}
        title={alertMessage}
        confirm="Back to login"
        onClose={() => {
          setAlertVisible(false);
          router.replace("/login");
        }}
      />
    </>
  );
};

interface ModalChangePassworkSuccessProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalChangePassworkSuccess: FC<ModalChangePassworkSuccessProps> = (
  props
) => {
  const { isOpen, onClose } = props;
  

  const handleBackToLogin = async () => {
    onClose();
    router.push("/login");
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      onRequestClose={onClose}
      transparent
    >
      <SafeAreaView className="flex-1 bg-Snow justify-center items-center">
        <View className="flex flex-col w-full container mx-auto px-10">
          <Text className="text-Heading3 mb-8 text-center">
            Password changed !
          </Text>

          <ButtonComponents
            onPress={handleBackToLogin}
            title="Back to login"
            className="flex flex-row items-center justify-center rounded-full border-2 border-BrightGray p-6 bg-Bittersweet"
            textSize="text-white text-xl font-bold"
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};
