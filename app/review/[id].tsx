import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";
import useLoading from "@/hook/useLoading";
import { Image } from "expo-image";
import LoadingIndicator from "@/components/Loading";
import { ActivityBar, UserBar } from "@/components/Bar";
import { SquareArrowLeft } from "lucide-react-native";
import { ICommentReview } from "@/interface/comment";
import { ModalCommentReview } from "@/components/Modal";
import { IReview } from "@/interface/review";

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

  const fetchReview = async () => {
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
  };

  useEffect(() => {
    fetchReview();
  }, []);

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
        setComment(data.data);
        setCommentCount(data.data.length);
      }
      fetchComments();
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.post(`/favorite/review/skincare/${id}`, null, {
        headers: {
          token: token,
        },
      });

      console.log(res);
      fetchReview();
    } catch (error: any) {
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
          headers: {
            token: token,
          },
        }
      );
      if (res.data) {
        fetchComments();
      }
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
        { headers: { token: token } }
      );

      const data = res.data;
      if (!data.status) {
        return;
      }
      fetchComments();
      setCommentContent("")
    } catch (error) {
      console.log(error);
    }
  };

    useEffect(() => {
      fetchComments();
    }, [comment]);

    const handleBookmark = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await axiosInstance.post(`/bookmark/review/${id}`, null, {
          headers: {
            token: token,
          },
        });
  
        console.log(res);
        fetchReview();
      } catch (error: any) {
        console.log(error.response.data);
      }
    };

  const isOpenComment = () => {
    setIsCommentOpen(true);
  };

  const closeComment = () => {
    setIsCommentOpen(false);
  };

  return (
    <SafeAreaProvider style={{ backgroundColor: "#fff" }}>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <View className="h-16 bg-White">
              <View className=" h-full flex-row items-center justify-between px-3">
                <TouchableOpacity className="flex flex-row gap-x-3 items-center">
                  <SquareArrowLeft size={28} color="#4A4A4A" />
                  <Text className="text-2xl font-semibold text-Quartz">
                    Reviews
                  </Text>
                </TouchableOpacity>
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
                data={review?.skincares}
                renderItem={({ item, index }) => {
                  return (
                    <Image
                      source={{ uri: item.image }}
                      style={{
                        width: width - 20,
                        height: height * 0.5,
                        borderRadius: 10,
                      }}
                      key={index}
                    />
                  );
                }}
                keyExtractor={(item) => item.id.toString()}
                pagingEnabled
                bounces={false}
                horizontal
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => {
                  const { contentOffset } = e.nativeEvent;
                  const index = Math.round(contentOffset.x / (width - 20));
                  setCurrImage(index);
                }}
              />
            </View>
            <ActivityBar
              isOpenComment={isOpenComment}
              hadleFavorite={handleFavorite}
              handleBookmark={handleBookmark}
              favorite={review?.favorite}
              favoriteCount={review?.favorite_count}
              commnetCount={commentCount}
              dataPaginate={review?.skincares}
              currImage={currImage}
              bookmark={review?.bookmark}
            />
            <View className="container mx-auto px-3">
              <Text
                style={{
                  fontSize: width * 0.05,
                  fontWeight: "bold",
                }}
              >
                {review?.title}
              </Text>
              <Text
                style={{
                  fontSize: width * 0.0375,
                  fontWeight: "medium",
                }}
              >
                {review?.content}
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>
      
      <ModalCommentReview
        isCommentClose={closeComment}
        comments={comment}
        isCommentOpen={isCommentOpen}
        handleFavoriteComment={handleFavoriteComment}
        handleComment={handleComment}
        setComment={setCommentContent}
      />
    </SafeAreaProvider>
  );
}
