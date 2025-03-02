import React, { useState } from "react";
import {
  SafeAreaView,
  TextInput,
  View,
  Text,
} from "react-native";
import { AddPhoto } from "@/components/Card";
import { BackButtonComponents, ButtonComponents } from "@/components/Buntton";

export default function CreateReviewPost() {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [skincare, setSkincare] = useState("No skincare");

  const handlePostReview = () => {
    console.log("Post Review", { title, caption, skincare, image });
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
          />
        </View>
        <View className="mb-4 flex flex-row items-center justify-center w-[100px] h-[120px] bg-red-500 rounded-lg"></View>
      </View>

      <View className="mb-4">
        {/* <Text className="text-Heading4">Add a title</Text> */}
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Add a title"
          className="border-2  w-full rounded-full p-6 border-BrightGray"
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#000000",
          }}
        />
      </View>

      <View className="mb-4">
        {/* <Text className="text-Heading4 font-light">Add captions</Text> */}
        <TextInput
          value={caption}
          onChangeText={setCaption}
          placeholder="Add captions"
          multiline
          numberOfLines={4}
          className="border-2  w-full rounded-full p-6 border-BrightGray"
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
