import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
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
import { SquareArrowLeft } from "lucide-react-native";
import { ICommentReview } from "@/interface/comment";
import { ModalComment } from "@/components/Modal";
import { IReview } from "@/interface/review";
import { BackButtonComponents } from "@/components/Buntton";

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

  const fetchReview = useCallback( async () => {
    startLoading();
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.get(`/reviews/${id}`, {
        headers: { token },
      });

      const data = res.data;
      if (data.status) {
        setReview(data.data);
        stopLoading();
      }
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  },[id, startLoading, stopLoading])

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
        headers: { token },
      });

      const data = res.data;
      if (data.status) {
        setComment(data.data);
        setCommentCount(data.data.length);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axiosInstance.post(`/favorite/review/skincare/${id}`, null, {
        headers: { token },
      });

      fetchReview();
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  const handleFavoriteComment = async (comment_id: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axiosInstance.post(
        `/favorite/comment/review/skincare/${comment_id}`,
        null,
        {
          headers: { token },
        }
      );

      fetchComments();
    } catch (error: any) {
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
      console.log(error);
    }
  };

  const handleBookmark = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axiosInstance.post(`/bookmark/review/${id}`, null, {
        headers: { token },
      });

      fetchReview();
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  return (
    <SafeAreaProvider style={{ backgroundColor: "#fff" }}>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <View className="h-16 bg-White">
              <View className=" h-full flex-row items-center justify-between px-3">
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
      <SafeAreaView className="flex-1">
        {isLoading && review === null ? (
          <LoadingIndicator />
        ) : (
          <View>
            <UserBar
              userImage={review?.user?.image}
              username={review?.user?.full_name}
            />
            <View style={{ padding: 10 }}>
              <FlatList
                data={imagesList}
                renderItem={({ item, index }) => (
                  <Image
                    source={{ uri: item }}
                    style={{
                      width: width - 20,
                      height: height * 0.5,
                      borderRadius: 10,
                    }}
                    key={index}
                  />
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
              isOpenComment={() => setIsCommentOpen(true)}
              hadleFavorite={handleFavorite}
              handleBookmark={handleBookmark}
              favorite={review?.favorite}
              favoriteCount={review?.favorite_count}
              commnetCount={commentCount}
              dataPaginate={imagesList}
              currImage={currImage}
              bookmark={review?.bookmark}
            />
            <View className="container mx-auto px-3">
              <Text style={{ fontSize: width * 0.05, fontWeight: "bold" }}>
                {review?.title ? review?.title : "No title"}
              </Text>
              <Text style={{ fontSize: width * 0.0375, fontWeight: "medium" }}>
                {review?.content ? review?.content : "No content"}
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>

      <ModalComment
        isCommentClose={() => setIsCommentOpen(false)}
        comments={comment}
        isCommentOpen={isCommentOpen}
        handleFavoriteComment={handleFavoriteComment}
        handleComment={handleComment}
        setComment={setCommentContent}
        commentContent={commentContent}
      />
    </SafeAreaProvider>
  );
}
