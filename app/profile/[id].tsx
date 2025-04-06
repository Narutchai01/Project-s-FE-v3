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
} from "lucide-react-native";
import LoadingIndicator from "@/components/Loading";
import { Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BackButtonComponents, ButtonComponents } from "@/components/Buntton";
import { ConfirmAlert } from "@/components/Alert";
import { AxiosError } from "axios";

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
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const activeColor = "#FF6F61";
  const inactiveColor = "#848484";

  const checkFollowStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.get(`/user/${userId}`, {
        headers: { token },
      });

      if (res.data.status) {
        setIsFollowing(res.data.data.follow);
      }
    } catch (error) {
      console.log("Follow status check error:", error);
    }
  };

  const handleFollow = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.post(`/user/follower/${userId}`, null, {
        headers: { token },
      });

      const newFollowStatus = res.data?.followed ?? !isFollowing;
      setIsFollowing(newFollowStatus);
    } catch (error) {
      console.log("Follow toggle error:", error);
    }
  };

  const handle404Error = (error: unknown) => {
    const axiosError = error as AxiosError;
    if (axiosError?.response?.status === 404 && !alertVisible) {
      setAlertMessage("Your session has expired or account not found.");
      setAlertVisible(true);
    }
  };

  const fetchUser = async () => {
    startLoading();
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.get(`/user/${userId}`, {
        headers: { token },
      });
      setProfileUser(res.data.data);
    } catch (error) {
      handle404Error(error);
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
      handle404Error(error);
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
      handle404Error(error);
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
      handle404Error(error);
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
      handle404Error(error);
      console.error("Toggle favorite error:", error);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await axiosInstance.get("/user/me", {
          headers: { token },
        });

        if (res.data.status) {
          setCurrentUserId(res.data.data.id);
        }
      } catch (err) {
        console.log("Error fetching current user:", err);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (profileUser?.id && currentUserId !== null) {
      checkFollowStatus();
    }
  }, [profileUser, currentUserId]);

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

        <Text className="text-Heading3 mt-2 mb-2">
          {profileUser?.full_name || "User"}
        </Text>
        <View>
          <TouchableOpacity>
            <ButtonComponents
              onPress={handleFollow}
              title={isFollowing ? "following" : "follow"}
              className={`px-3 py-1 rounded-full ${
                isFollowing ? "bg-Bittersweet" : "bg-Bittersweet"
              }`}
              textSize="text-l font-semibold text-white"
            />
          </TouchableOpacity>
        </View>

        <View className="flex flex-row justify-between w-1/2 mt-2">
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
              <View className="absolute bottom-[-15px] w-full border-b-2 border-Bittersweet" />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode("threads")}>
          <View className="flex items-center relative">
            <MessageCircleQuestion size={30}  color={mode === "threads" ? activeColor : inactiveColor} />
            {mode === "threads" && (
              <View className="absolute bottom-[-15px] w-full border-b-2 border-Bittersweet" />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode("bookmark")}>
          <View className="flex items-center relative">
            <Bookmark size={30}  color={mode === "bookmark" ? activeColor : inactiveColor} />
            {mode === "bookmark" && (
              <View className="absolute bottom-[-15px] w-full border-b-2 border-Bittersweet" />
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
