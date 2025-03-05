import React, { useState } from "react";
import {
  SafeAreaView,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { BackButtonComponents, ButtonComponents } from "@/components/Buntton";
import { useRouter } from "expo-router";
import { ISkincare } from "@/interface/skincare";
import { axiosInstance } from "@/lib/axios_instance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ModalSkincare} from "@/components/Modal";
import useLoading from "@/hook/useLoading";
import { ImageIcon } from "lucide-react-native";
import * as DocumentPicker from "expo-document-picker";

export default function CreateReviewPost() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [skincare, setSkincare] = useState<ISkincare[]>([]);
  const [image, setImage] = useState<string[] | null>(null);
  const [review, setReview] = useState({
    title: "",
    content: "",
  });

  const handleChange = (key: string, value: string) => {
    setReview({ ...review, [key]: value });
  };

  const handleSelectSkincare = () => {
    setIsModalOpen(true);
  };

  const handleChooseImage = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled === false) {
      setImage([result.assets[0].uri]);
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
      formData.append("skincare_id", JSON.stringify(skincare.map((item) => item.id)));
      if (image) {
        const file = {
          uri: image[0],
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
    }
  };

  console.log(skincare);
  

  return (
    <SafeAreaView className="p-4">
      <BackButtonComponents title="New review" textSize="text-Heading3" />

      <View className="mb-4">
        <Text className="text-Heading4">Thumbnail</Text>
      </View>

      <View className="mb-4 flex flex-row items-center justify-center ">
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
                  marginRight: 10,
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
                marginRight: 10,
              }}
            />
          )}
        />
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
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {skincare.length > 0 ? (
            skincare.map((item: ISkincare) => (
              <View key={item.id} className="mb-4 mr-2">
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 100, height: 120, borderRadius: 10 }}
                />
                <Text>{item.name}</Text>
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
          placeholder="Add Contenton"
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
    </SafeAreaView>
  );
}
