import React, { useState } from "react";
import {
  SafeAreaView,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
} from "react-native";
import { AddPhoto } from "@/components/Card";
import { BackButtonComponents, ButtonComponents } from "@/components/Buntton";
import { useRouter } from "expo-router";
import { ISkincare } from "@/interface/skincare";
import { useReview } from "@/context/ReviewContext";
import { axiosInstance } from "@/lib/axios_instance";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function CreateReviewPost() {
  const { image, setImage } = useReview(); 
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { review } = useReview();
  const router = useRouter();

  const handlePostReview = async () => {
    console.log("Post Review", { title, content, review, image });
  };


  return (
    <SafeAreaView className="p-4">
        <BackButtonComponents title="New review" textSize="text-Heading3" />

      <View className="mb-4">
        <Text className="text-Heading4">Thumbnail</Text>
      </View>

      <View className="mb-4 flex flex-row items-center justify-center ">
      <AddPhoto image={image} setImage={setImage} />
      </View>

      <View className="mb-4">
        <View className="border-b-2 border-gray-300 mb-4"></View>
        <View className="flex flex-row items-center justify-between mb-2">
          <Text className="text-Heading4">Select skincare</Text>
          <ButtonComponents
            title="Select"
            className="bg-Bittersweet px-2 py-2 rounded-full w-[80px] flex items-center justify-center"
            textSize="text-md font-semibold text-white"
            onPress={() => router.push("/CreateReview")}
          />
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {review.length > 0 ? (
            review.map((item: ISkincare) => (
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
          value={title}
          onChangeText={setTitle}
          placeholder="Add a title"
          className="border-2 w-full rounded-full p-6 border-BrightGray"
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#000000",
          }}
        />
      </View>

      <View className="mb-4">
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Add captions"
          multiline
          numberOfLines={4}
          className="border-2 w-full rounded-full p-6 border-BrightGray"
          style={{
            fontSize: 18,
            fontWeight: "300",
            color: "#000000",
          }}
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
    </SafeAreaView>
  );
}