import React, { useCallback, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { BackButtonComponents, ButtonComponents } from "@/components/Buntton";
import { Image as ImageIcon } from "lucide-react-native";
import { Image } from "expo-image";
import { axiosInstance } from "@/lib/axios_instance";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingIndicator from "@/components/Loading";
import useLoading from "@/hook/useLoading";
import { ISkincare } from "@/interface/skincare";
import * as ImagePicker from "expo-image-picker";
import { ConfirmAlert } from "@/components/Alert";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { ModalSkincare } from "@/components/Modal";
import { useLocalSearchParams } from "expo-router";

export default function EditReviewScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [skincare, setSkincare] = useState<ISkincare[]>([]);
  const [originalSkincare, setOriginalSkincare] = useState<ISkincare[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [originalImageId, setOriginalImageId] = useState<number | null>(null);
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

  const fetchReview = useCallback(async () => {
    startLoading();
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.get(`/reviews/${id}`, {
        headers: { token },
      });
      const data = res.data;

      if (data.status) {
        const reviewData = data.data;
        setReview({
          title: reviewData.title,
          content: reviewData.content,
        });

        if (reviewData.image) {
          setImage(reviewData.image);
        }

        if (reviewData.image_id) {
          setOriginalImageId(reviewData.image_id);
        }

        if (reviewData.skincares) {
          setSkincare(reviewData.skincares);
          setOriginalSkincare(reviewData.skincares);
        }
      }
    } catch (error) {
      handle404Error(error);
      console.error(error);
    } finally {
      stopLoading();
    }
  }, [id]);

  const handleUpdateReview = async () => {
    if (!review.title || !review.content || skincare.length === 0) {
      setIsAlertVisible(true);
      return;
    }

    startLoading();
    try {
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();

      formData.append("title", review.title);
      formData.append("content", review.content);
      formData.append(
        "skincare_id",
        JSON.stringify(skincare.map((item) => item.id))
      );

      const currentIds = Array.from(new Set(skincare.map((s) => s.id)));
      const originalIds = Array.from(
        new Set(originalSkincare.map((s) => s.id))
      );
      const deletedSkincares = originalIds.filter(
        (id) => !currentIds.includes(id)
      );
      if (deletedSkincares.length > 0) {
        formData.append("delete_skincares", JSON.stringify(deletedSkincares));
      }

      if (originalImageId && image && !image.startsWith("http")) {
        formData.append("delete_images", JSON.stringify([originalImageId]));
      }

      if (image && !image.startsWith("http")) {
        const file = {
          uri: image,
          name: "review_image.jpg",
          type: "image/jpeg",
        };
        formData.append("file", file as any);
      }

      const res = await axiosInstance.put(`/reviews/${id}`, formData, {
        headers: {
          token: token || "",
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.status) {
        router.replace("/(tabs)/community?mode=review");
        setTimeout(() => {
          router.push(`/review/${res.data.data.id}`);
        }, 50);
      }
      
    } catch (error: any) {
      handle404Error(error);
      console.error("Update Error:", error.response?.data || error.message);
    } finally {
      stopLoading();
    }
  };

  const handleCancel = () => {
    setReview({ title: "", content: "" });
    setSkincare([]);
    setImage(null);
    router.back();
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

  const handleSelectSkincare = () => {
    setIsModalOpen(true);
  };

  const handleChange = (key: string, value: string) => {
    setReview((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (id) {
      fetchReview();
    }
  }, [fetchReview]);

  return (
    <SafeAreaView className="flex-1 bg-Snow p-6">
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ScrollView>
          <BackButtonComponents
            title="Edit Review"
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
                skincare.map((item) => (
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
              value={review.title}
              onChangeText={(title) => handleChange("title", title)}
              className="border-2 w-full rounded-full p-4 border-BrightGray"
            />
          </View>

          <View className="mb-6">
            <TextInput
              placeholder="Add Content"
              value={review.content}
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
              title="Save"
              className="bg-Bittersweet px-6 py-3 rounded-full"
              textSize="text-lg font-semibold text-White"
              onPress={handleUpdateReview}
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
