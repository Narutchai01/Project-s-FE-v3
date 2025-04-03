import { View, Text, FlatList, Dimensions } from "react-native";
import React, { useCallback } from "react";
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
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const fecThread = useCallback(async () => {
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
        setIsFollowing(data.data.user?.follow || false);
        stopLoading();
      }
    } catch (error) {
      console.log(error);
      stopLoading();
    } finally {
      stopLoading();
    }
  }, [id, startLoading, stopLoading]);

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
        setComment(data.data ?? []); 
        setCommentCount(data.data?.length ?? 0);
      }
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
        console.error(error);
      } finally {
        stopLoading();
      }
    };

    fetchUserFromToken();
  }, []);

  const handleFollowStatusChange = (status: boolean) => {
    if (thread) {
      setThread({
        ...thread,
        user: {
          ...thread.user,
          follow: status,
        },
      });
      setIsFollowing(status);
    }
  };

  return (
    <SafeAreaProvider style={{ backgroundColor: "#fff" }}>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <View className="h-16 bg-Snow ml-1">
              <View className=" h-full flex-row items-center justify-between px-3">
                <BackButtonComponents
                  title={"Threads"}
                  textSize="text-Heading3 text-Quartz"
                  onPress={() => router.back()}
                />
              </View>
            </View>
          ),
        }}
      />
      <SafeAreaView className="flex-1 bg-Snow">
        {isLoading && thread === null ? (
          <LoadingIndicator />
        ) : (
          <View>
            {thread && (
              <UserBar
              userImage={thread.user.image}
              username={thread.user.full_name}
              userId={thread.user.id}
              currentUserId={currentUserId}
              isFollowed={isFollowing}
              onFollowStatusChange={handleFollowStatusChange}
              threadId={thread.id}
            />
            
            )}

            <View style={{ padding: 10 }}>
              {thread?.images && thread?.images.length > 0 && (
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
                    style={{ color: "white", fontSize: 14, fontWeight: "bold" }}
                  >
                    {currImage + 1} / {thread?.images?.length}
                  </Text>
                </View>
              )}

              <FlatList
                data={thread?.images}
                renderItem={({ item, index }) => (
                  <Image
                    source={{ uri: item.image }}
                    style={{
                      width: width - 20,
                      height: height * 0.5,
                      borderRadius: 10,
                    }}
                    key={index}
                  />
                )}
                keyExtractor={(item) => item.id.toString()}
                pagingEnabled
                bounces={false}
                horizontal
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => {
                  const { contentOffset } = e.nativeEvent;
                  const index = Math.round(contentOffset.x / (width - 20));
                  if (index !== currImage) {
                    setCurrImage(index);
                  }
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
        comments={comment || []}
        isCommentOpen={isCommentOpen}
        handleFavoriteComment={handleFavoriteComment}
        handleComment={handleComment}
        setComment={setCommentContent}
        commentContent={commentContent}
      />
    </SafeAreaProvider>
  );
}
