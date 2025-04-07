import {
  View,
  Text,
  FlatList,
  Dimensions,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { router, Stack, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";
import useLoading from "@/hook/useLoading";
import { Image } from "expo-image";
import LoadingIndicator from "@/components/Loading";
import { ActivityBar, UserBar } from "@/components/Bar";
import { ICommentReview } from "@/interface/comment";
import { ModalComment } from "@/components/Modal";
import { IReview } from "@/interface/review";
import { BackButtonComponents } from "@/components/Buntton";
import { AxiosError } from "axios";
import { ConfirmAlert } from "@/components/Alert";
import { Animated, Pressable } from "react-native";
import { Heart } from "lucide-react-native";

export default function ReviewDetails() {
  const { id } = useLocalSearchParams();
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [review, setReview] = useState<IReview | null>(null);
  const { width, height } = Dimensions.get("window");
  const [currImage, setCurrImage] = useState(0);
  const [comment, setComment] = useState<ICommentReview[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [lastTap, setLastTap] = useState<number | null>(null);
  const [showHeart, setShowHeart] = useState(false);
  const heartScale = useState(new Animated.Value(0))[0];
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });

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

  const handleDoubleTap = (event: any) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 500;

    const { locationX, locationY } = event.nativeEvent;
    setTapPosition({ x: locationX, y: locationY });

    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
      triggerHeartAnimation();
      handleFavorite();
    } else {
      setLastTap(now);
    }
  };

  const triggerHeartAnimation = () => {
    setShowHeart(true);
    heartScale.setValue(0);

    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1.5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 0,
        duration: 300,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowHeart(false);
    });
  };

  const fetchUserFollowStatus = async (userId: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.get(`/user/${userId}`, {
        headers: { token },
      });

      if (res.data.status) {
        setIsFollowing(res.data.data.follow);
      }
    } catch (error) {
      handleError(error);
      console.error("Error fetching user follow status:", error);
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
        setReview(data.data);
        fetchUserFollowStatus(data.data.user.id);
        stopLoading();
      }
    } catch (error) {
      handleError(error);
      console.error(error);
    } finally {
      stopLoading();
    }
  }, [id, startLoading, stopLoading]);

  useEffect(() => {
    fetchReview();
  }, []);

  const imagesList = useMemo(() => {
    if (!review) return [];
    const skincareImages = review.skincares?.map((item) => item.image) || [];
    return review.image ? [review.image, ...skincareImages] : skincareImages;
  }, [review]);

  const fetchComments = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.get(`/comment/reviews/skincare/${id}`, {
        headers: {
          token: token,
        },
      });

      const data = res.data;
      if (data.status) {
        setComment(data.data ?? []);
        setCommentCount(data.data?.length ?? 0);
      }
    } catch (error: any) {
      handleError(error);
      console.log(error);
    }
  };

  const handleFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axiosInstance.post(`/favorite/review/skincare/${id}`, null, {
        headers: {
          token: token,
        },
      });

      fetchReview();
    } catch (error: any) {
      handleError(error);
      console.log(error.response.data);
    }
  };

  const handleFavoriteComment = async (comment_id: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.post(
        `/favorite/comment/review/skincare/${comment_id}`,
        null,
        {
          headers: { token },
        }
      );

      if (res.data) {
        fetchComments();
      }
    } catch (error: any) {
      handleError(error);
      console.log(error.response.data);
    }
  };

  const handleComment = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.post(
        "/comment/reviews/skincare",
        {
          review_skincare_id: review?.id,
          content: commentContent,
        },
        { headers: { token } }
      );

      const data = res.data;
      if (!data.status) {
        return;
      }
      fetchComments();
      setCommentContent("");
    } catch (error) {
      handleError(error);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [comment]);

  const handleBookmark = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axiosInstance.post(`/bookmark/review/${id}`, null, {
        headers: { token },
      });

      fetchReview();
    } catch (error: any) {
      handleError(error);
      console.log(error.response.data);
    }
  };

  const isOpenComment = () => {
    setIsCommentOpen(true);
  };

  const closeComment = () => {
    setIsCommentOpen(false);
  };

  useEffect(() => {
    const fetchUserFromToken = async () => {
      startLoading();
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await axiosInstance.get("/user/me", {
          headers: { token },
        });
        const data = res.data;
        if (data.status) {
          setCurrentUserId(data.data.id);
          stopLoading();
        }
      } catch (error) {
        handleError(error);
        console.error(error);
      } finally {
        stopLoading();
      }
    };

    fetchUserFromToken();
  }, []);

  const handleFollowStatusChange = (status: boolean) => {
    fetchReview();
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchReview().then(() => setRefreshing(false));
  }, [fetchReview]);

  return (
    <SafeAreaProvider style={{ backgroundColor: "#fff" }}>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <View className="h-16 bg-Snow">
              <View className=" h-full flex-row items-center justify-between px-4 mt-4">
                <BackButtonComponents
                  title={"Reviews"}
                  textSize="text-Heading3 text-Quartz"
                  onPress={() => router.back()}
                />
              </View>
            </View>
          ),
        }}
      />
      <SafeAreaView className="flex-1 bg-Snow">
        {isLoading && review === null ? (
          <LoadingIndicator />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 25 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View>
              {review && (
                <UserBar
                  userImage={review?.user?.image}
                  username={review?.user?.full_name}
                  userId={review?.user?.id}
                  currentUserId={currentUserId}
                  isFollowed={isFollowing}
                  onFollowStatusChange={handleFollowStatusChange}
                  reviewId={review?.id}
                />
              )}

              <View style={{ padding: 10 }}>
                {imagesList.length > 1 && (
                  <View
                    style={{
                      position: "absolute",
                      top: 20,
                      right: 20,
                      backgroundColor: "#4A4A4ACC",
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderRadius: 20,
                      zIndex: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      {currImage + 1} / {imagesList.length}
                    </Text>
                  </View>
                )}

                <FlatList
                  data={imagesList}
                  renderItem={({ item, index }) => (
                    <Pressable onPress={(e) => handleDoubleTap(e)}>
                      <View>
                        <Image
                          source={{ uri: item }}
                          style={{
                            width: width - 20,
                            height: height * 0.5,
                            borderRadius: 10,
                          }}
                          key={index}
                        />

                        {showHeart && (
                          <Animated.View
                            style={{
                              position: "absolute",
                              top: tapPosition.y,
                              left: tapPosition.x,
                              transform: [
                                { translateX: -25 },
                                { translateY: -25 },
                                { scale: heartScale },
                              ],
                              opacity: heartScale,
                              zIndex: 5,
                            }}
                          >
                            <Heart size={45} color="#FF6F61" fill="#FF6F61" />
                          </Animated.View>
                        )}
                      </View>
                    </Pressable>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  pagingEnabled
                  bounces={false}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  onScroll={(e) => {
                    const { contentOffset } = e.nativeEvent;
                    const index = Math.round(contentOffset.x / (width - 20));
                    setCurrImage(index);
                  }}
                  ListEmptyComponent={() => (
                    <Image
                      source={require("@/assets/images/defaultImage.png")}
                      style={{
                        width: width - 20,
                        height: height * 0.5,
                        borderRadius: 10,
                      }}
                      contentFit="cover"
                    />
                  )}
                />
              </View>

              <ActivityBar
                isOpenComment={isOpenComment}
                hadleFavorite={handleFavorite}
                handleBookmark={handleBookmark}
                favorite={review?.favorite}
                favoriteCount={review?.favorite_count}
                commnetCount={commentCount}
                dataPaginate={imagesList}
                currImage={currImage}
                bookmark={review?.bookmark}
              />
              <View className="container mx-auto px-4 mt-2 ">
                <Text style={{ fontSize: width * 0.05, fontWeight: "bold" }}>
                  {review?.title ? review?.title : "No title"}
                </Text>
                <Text
                  style={{ fontSize: width * 0.0375, fontWeight: "medium" }}
                >
                  {review?.content ? review?.content : "No content"}
                </Text>
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>

      <ModalComment
        isCommentClose={closeComment}
        comments={comment || []}
        isCommentOpen={isCommentOpen}
        handleFavoriteComment={handleFavoriteComment}
        handleComment={handleComment}
        setComment={setCommentContent}
        commentContent={commentContent}
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
    </SafeAreaProvider>
  );
}
