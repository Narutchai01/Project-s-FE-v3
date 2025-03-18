import { View, Text, FlatList, Dimensions } from "react-native";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { IThread } from "@/interface/threads";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";
import useLoading from "@/hook/useLoading";
import { Image } from "expo-image";
import LoadingIndicator from "@/components/Loading";
import { ActivityBar, UserBar } from "@/components/Bar";
import { ICommentThread } from "@/interface/comment";
import { ModalComment } from "@/components/Modal";
import { BackButtonComponents } from "@/components/Buntton";

export default function ThreadDetails() {
  const { id } = useLocalSearchParams();
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [thread, setThread] = useState<IThread | null>(null);
  const { width, height } = Dimensions.get("window");
  const [currImage, setCurrImage] = useState(0);
  const [comment, setComment] = useState<ICommentThread[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");

  const fecThread = async () => {
    startLoading();
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.get(`/thread/${id}`, {
        headers: {
          token,
        },
      });

      const data = res.data;
      if (data.status) {
        setThread(data.data);
        stopLoading();
      }
    } catch (error) {
      console.log(error);
      stopLoading();
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fecThread();
  }, []);

  const handleFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.post(`/favorite/thread/${id}`, null, {
        headers: {
          token: token,
        },
      });

      console.log(res);
      fecThread();
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  const fetchComments = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.get(`/comment/thread/${id}`, {
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

  const handleFavoriteComment = async (comment_id: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.post(
        `/favorite/comment/thread/${comment_id}`,
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
        "/comment/thread",
        {
          thread_id: thread?.id,
          text: commentContent,
        },
        { headers: { token: token } }
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

  useEffect(() => {
    fetchComments();
  }, [comment]);

  const handleBookmark = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.post(`/bookmark/thread/${id}`, null, {
        headers: {
          token: token,
        },
      });

      console.log(res);
      fecThread();
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
                <BackButtonComponents
                  title={"Threads"}
                  textSize="text-Heading3"
                  onPress={() => router.back()}
                />
              </View>
            </View>
          ),
        }}
      />
      <SafeAreaView className="flex-1">
        {isLoading && thread === null ? (
          <LoadingIndicator />
        ) : (
          <View>
            <UserBar
              userImage={thread?.user?.image}
              username={thread?.user?.full_name}
            />
            <View style={{ padding: 10 }}>
              <FlatList
                data={thread?.images}
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
              favorite={thread?.favorite}
              favoriteCount={thread?.favorite_count}
              commnetCount={commentCount}
              dataPaginate={thread?.images}
              currImage={currImage}
              bookmark={thread?.bookmark}
            />
            <View className="container mx-auto px-3">
              <Text
                style={{
                  fontSize: width * 0.05,
                  fontWeight: "bold",
                }}
              >
                {thread?.title ? thread.title : "No title"}
              </Text>
              <Text
                style={{
                  fontSize: width * 0.0375,
                  fontWeight: "medium",
                }}
              >
                {thread?.caption ? thread.caption : "No caption"}
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>

      <ModalComment
        isCommentClose={closeComment}
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
