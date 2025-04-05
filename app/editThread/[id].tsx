import { FC } from "react";
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  FlatList,
} from "react-native";
import { BackButtonComponents, ButtonComponents } from "@/components/Buntton";
import { Image as ImageIcon } from "lucide-react-native";
import { Image } from "expo-image";
import { axiosInstance } from "@/lib/axios_instance";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingIndicator from "@/components/Loading";
import useLoading from "@/hook/useLoading";
import { ConfirmAlert } from "@/components/Alert";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";

export default function EditThradScreen() {
  const router = useRouter();
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
    <SafeAreaView className="flex-1 bg-Snow p-6">
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ScrollView>
          <BackButtonComponents
            title={"New Thread"}
            textSize="text-Heading3 text-Quartz"
            onPress={handleCancel}
          />

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
                        <Text className="text-label1 mt-2">Tap a photo</Text>
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
              title="Save"
              onPress={handleCreateThread}
              className="bg-Bittersweet px-6 py-3 rounded-full"
              textSize="text-lg font-semibold text-White"
            />
          </View>
        </ScrollView>
      )}

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
    </SafeAreaView>
  );
}
