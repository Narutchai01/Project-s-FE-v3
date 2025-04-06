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
import { IReview } from "@/interface/review";
import { IThread } from "@/interface/threads";
import useLoading from "@/hook/useLoading";
import LoadingIndicator from "@/components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";
import { IUser } from "@/interface/user";
import { PostByUser } from "@/components/Card";
import { AxiosError } from "axios";
import { ConfirmAlert } from "@/components/Alert";

export default function ProfileScreen() {
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
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const activeColor = "#FF6F61";
  const inactiveColor = "#848484";


  const handleError = (error: unknown) => {
    const axiosError = error as AxiosError;
  
    if (!alertVisible) {
      if (axiosError?.response?.status === 404) {
        setAlertMessage("Your session has expired or account not found.");
        setAlertVisible(true);
      } else if (axiosError?.response?.status === 401) {
        setAlertMessage("Unauthorized. Please log in again.");
        setAlertVisible(true);
      }
    }
  };

  const fetchUser = async () => {
    startLoading();
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.get("/user/me", {
        headers: {
          token: token,
        },
      });
      setProfileUser(res.data.data);
    } catch (error) {
      handleError(error);
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
      const res = await axiosInstance.get(`/thread/user/${profileUser?.id}`, {
        headers: {
          token: token,
        },
      });

      const data = res.data;
      if (data.status) {
        setThreads(res.data.data);
      }
    } catch (error) {
      handleError(error);
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
      const res = await axiosInstance.get(`/reviews/user/${profileUser?.id}`, {
        headers: {
          token: token,
        },
      });

      const data = res.data;
      if (data.status) {
        setReviews(data.data);
      }
    } catch (error) {
      handleError(error);
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
      const res = await axiosInstance.get(`/bookmark/get/${profileUser?.id}`, {
        headers: {
          token: token,
        },
      });

      const data = res.data;
      if (data.status) {
        setBookmarks(data.data);
      }
    } catch (error) {
      handleError(error);
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  const handleFavorite = async (id: number, type: "review" | "thread") => {
    try {
      const token = await AsyncStorage.getItem("token");
      const endpoint =
        type === "review"
          ? `/favorite/review/skincare/${id}`
          : `/favorite/thread/${id}`;

      await axiosInstance.post(endpoint, null, { headers: { token } });

      if (type === "review") {
        fetchReviews();
      } else {
        fetchThreads();
      }
    } catch (error) {
      handleError(error);
      console.error("Toggle favorite error:", error);
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
      <View className="flex flex-row justify-end items-center">
        <TouchableOpacity
          onPress={() => router.push("/setting")}
          className="mr-4 mt-2"
        >
          <AlignJustify size={24} />
        </TouchableOpacity>
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
            <CopyPlus size={30}  color={mode === "reviews" ? activeColor : inactiveColor} />
            {mode === "reviews" && (
              <View className="absolute bottom-[-16px] w-full border-b-2 border-Bittersweet" />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode("threads")}>
          <View className="flex items-center relative">
            <MessageCircleQuestion size={30}   color={mode === "threads" ? activeColor : inactiveColor} />
            {mode === "threads" && (
              <View className="absolute bottom-[-16px] w-full border-b-2 border-Bittersweet" />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode("bookmark")}>
          <View className="flex items-center relative">
            <Bookmark size={30}   color={mode === "bookmark" ? activeColor : inactiveColor} />
            {mode === "bookmark" && (
              <View className="absolute bottom-[-16px] w-full border-b-2 border-Bittersweet" />
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
      <SafeAreaView className="flex-1 bg-Snow p-4 ">
        <View className="ml-1 mt-2">
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <>
              {mode === "reviews" &&
                (reviews && reviews.length > 0 ? (
                  <FlatList
                    data={reviews}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    columnWrapperStyle={{ marginBottom: 12 }}
                    renderItem={({ item }) => (
                      <PostByUser
                        image={item.image}
                        title={item.title}
                        user={item.user.full_name}
                        userAvatar={item.user.image}
                        isFavorited={item.favorite}
                        onFavorite={() => handleFavorite(item.id, "review")}
                        onPress={() => router.push(`/review/${item.id}`)}
                      />
                    )}
                  />
                ) : (
                  <View className="items-center mt-10">
                    <Text className="text-label7 text-OldSilver">
                      No reviews available.
                    </Text>
                  </View>
                ))}

              {mode === "threads" &&
                (threads && threads.length > 0 ? (
                  <FlatList
                    data={threads}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    renderItem={({ item }) => (
                      <PostByUser
                        image={item.images[0]?.image}
                        title={item.title}
                        user={item.user.full_name}
                        userAvatar={item.user.image}
                        isFavorited={item.favorite}
                        onFavorite={() => handleFavorite(item.id, "thread")}
                        onPress={() => router.push(`/thread/${item.id}`)}
                      />
                    )}
                  />
                ) : (
                  <View className="items-center mt-10">
                    <Text className="text-label7 text-OldSilver">
                      No threads available.
                    </Text>
                  </View>
                ))}

              {mode === "bookmark" &&
                (bookmarks && bookmarks.length > 0 ? (
                  <FlatList
                    data={bookmarks}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    renderItem={({ item }) => {
                      const isThread = item.type === 1;
                      const contentId = item.community_id;
                      const type = isThread ? "thread" : "review";

                      return (
                        <PostByUser
                          image={item.image}
                          title={item.title}
                          user={item.user?.full_name}
                          userAvatar={item.user?.image}
                          isFavorited={item.favorite}
                          onFavorite={() => handleFavorite(contentId, type)}
                          onPress={() => router.push(`/${type}/${contentId}`)}
                        />
                      );
                    }}
                  />
                ) : (
                  <View className="items-center mt-10">
                    <Text className="text-label7 text-OldSilver">
                      No bookmarks available.
                    </Text>
                  </View>
                ))}
            </>
          )}
        </View>

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
    </SafeAreaProvider>
  );
}
