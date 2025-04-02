import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Image,
  Text,
  FlatList,
} from "react-native";
import { router, Stack } from "expo-router";
import {
  AlignJustify,
  Bookmark,
  CopyPlus,
  MessageCircleQuestion,
} from "lucide-react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useLoading from "@/hook/useLoading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";
import { IUser } from "@/interface/user";
import { useAuth } from "@/context/AuthContext";


export default function ProfileScreen() {
  const [mode, setMode] = useState<"reviews" | "threads" | "bookmark">(
    "reviews"
  );
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [profileUser, setProfileUser] = useState<IUser | null>(null);
  const { user } = useAuth();

  const fetchUser = async () => {
    startLoading();
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.get("/user/me", {
        headers: { token },
      });
      setProfileUser(res.data.data);
    } catch (error) {
      console.log("Error fetching user:", error);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const CustomHeader = () => (
    <View className="bg-Snow p-4 border-b-2 border-gray-300 relative">
      <View className="flex flex-row justify-end items-center">
        <TouchableOpacity
          onPress={() => router.push("/setting")}
          className="mr-4 mt-2"
        >
          <AlignJustify size={24} />
        </TouchableOpacity>
      </View>

      <View className="items-center mt-6 mb-4">
        <Image className="w-24 h-24 rounded-full bg-gray-300" />

        <Text className="text-Heading3 mt-2">{user?.full_name || "User"}</Text>

        <View className="flex flex-row justify-between w-1/2 mt-4">
          <View className="items-center">
            <Text className="text-label8 text-OldSilver">followers</Text>
            <Text className="text-label8 text-OldSilver">
              {user?.follower ?? "-"}
            </Text>
          </View>

          <View className="items-center">
            <Text className="text-label8 text-OldSilver">following</Text>
            <Text className="text-label8 text-OldSilver">
              {user?.following ?? "-"}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex flex-row items-center justify-around mt-4">
        <TouchableOpacity onPress={() => setMode("reviews")}>
          <View className="flex items-center relative">
            <CopyPlus size={30} />
            {mode === "reviews" && (
              <View className="absolute bottom-[-15px] w-full border-b-2 border-black" />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode("threads")}>
          <View className="flex items-center relative">
            <MessageCircleQuestion size={30} />
            {mode === "threads" && (
              <View className="absolute bottom-[-15px] w-full border-b-2 border-black" />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode("bookmark")}>
          <View className="flex items-center relative">
            <Bookmark size={30} />
            {mode === "bookmark" && (
              <View className="absolute bottom-[-15px] w-full border-b-2 border-black" />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => <CustomHeader />,
        }}
      />
      <SafeAreaView className="flex-1 bg-Snow p-4">
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

