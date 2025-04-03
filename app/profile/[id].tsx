import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";
import useLoading from "@/hook/useLoading";
import { IUser } from "@/interface/user";
import { IReview } from "@/interface/review";
import { IThread } from "@/interface/threads";
import { PostByUser } from "@/components/Card";
import {
  CopyPlus,
  MessageCircleQuestion,
  Bookmark,
  AlignJustify,
} from "lucide-react-native";
import LoadingIndicator from "@/components/Loading";
import { Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BackButtonComponents } from "@/components/Buntton";

export default function OtherProfileScreen() {
  const { id } = useLocalSearchParams();
  const userId = Number(id);
  const [mode, setMode] = useState<"reviews" | "threads" | "bookmark">(
    "reviews"
  );
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [threads, setThreads] = useState<IThread[] | null>(null);
  const [reviews, setReviews] = useState<IReview[] | null>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [profileUser, setProfileUser] = useState<IUser | null>(null);
  const defaultImage = require("@/assets/images/userDefault.jpg");
  const [refreshing, setRefreshing] = useState(false);

  const fetchUser = async () => {
    startLoading();
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.get(`/user/${userId}`, {
        headers: { token },
      });
      setProfileUser(res.data.data);
    } catch (error) {
      console.log("Error fetching user:", error);
    } finally {
      stopLoading();
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUser();
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchThreads = async () => {
    startLoading();
    try {
      if (profileUser?.id === undefined) return;
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.get(`/thread/user/${profileUser.id}`, {
        headers: { token },
      });
      if (res.data.status) {
        setThreads(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  const fetchReviews = async () => {
    startLoading();
    try {
      if (profileUser?.id === undefined) return;
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.get(`/reviews/user/${profileUser.id}`, {
        headers: { token },
      });
      if (res.data.status) {
        setReviews(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  const fetchBookmarks = async () => {
    startLoading();
    try {
      if (profileUser?.id === undefined) return;
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.get(`/bookmark/get/${profileUser.id}`, {
        headers: { token },
      });
      if (res.data.status) {
        setBookmarks(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!profileUser?.id) return;
    fetchReviews();
    fetchThreads();
    fetchBookmarks();
  }, [profileUser]);

  const CustomHeader = () => (
    <View className="bg-Snow p-4 border-b-2 border-gray-300 relative">
      <View className="h-16 flex-row items-center justify-between px-3">
        <BackButtonComponents
          title={profileUser?.full_name || "User"}
          textSize="text-Heading3 text-Quartz"
          onPress={() => router.back()}
        />
      </View>

      <View className="items-center mt-6 mb-4">
        <Image
          className="w-24 h-24 rounded-full bg-gray-300"
          source={
            profileUser?.image ? { uri: profileUser.image } : defaultImage
          }
        />

        <Text className="text-Heading3 mt-2">
          {profileUser?.full_name || "User"}
        </Text>

        <View className="flex flex-row justify-between w-1/2 mt-4">
          <View className="items-center">
            <Text className="text-label8 text-OldSilver">followers</Text>
            <Text className="text-label8 text-OldSilver">
              {profileUser?.follower ?? "-"}
            </Text>
          </View>

          <View className="items-center">
            <Text className="text-label8 text-OldSilver">following</Text>
            <Text className="text-label8 text-OldSilver">
              {profileUser?.following ?? "-"}
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
        <View className="ml-1 mt-2">
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <>
              {mode === "reviews" &&
                (reviews?.length === 0 ? (
                  <Text className="text-center mt-4 text-gray-500">
                    No reviews available
                  </Text>
                ) : (
                  <FlatList
                    data={reviews}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    columnWrapperStyle={{ marginBottom: 12 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => router.push(`/review/${item.id}`)}
                      >
                        <PostByUser
                          image={item.image}
                          title={item.title}
                          user={item.user.full_name}
                          userAvatar={item.user.image}
                        />
                      </TouchableOpacity>
                    )}
                  />
                ))}
              {mode === "threads" &&
                (threads?.length === 0 ? (
                  <Text className="text-center mt-4 text-gray-500">
                    No threads found
                  </Text>
                ) : (
                  <FlatList
                    data={threads}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => router.push(`/thread/${item.id}`)}
                      >
                        <PostByUser
                          image={item.images[0]?.image}
                          title={item.title}
                          user={item.user.full_name}
                          userAvatar={item.user.image}
                        />
                      </TouchableOpacity>
                    )}
                  />
                ))}

              {mode === "bookmark" &&
                (bookmarks?.length === 0 ? (
                  <Text className="text-center mt-4 text-gray-500">
                    No bookmarks yet
                  </Text>
                ) : (
                  <FlatList
                    data={bookmarks}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    renderItem={({ item }) => (
                      <PostByUser
                        image={item.image}
                        title={item.title}
                        user={item.user?.full_name}
                        userAvatar={item.user?.image}
                      />
                    )}
                  />
                ))}
            </>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
