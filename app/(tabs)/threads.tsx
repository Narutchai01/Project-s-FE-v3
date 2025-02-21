import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Plus } from "lucide-react-native";
import { ThreadCard } from "@/components/Card";
import { axiosInstance } from "@/lib/axios_instance";
import { IThread } from "@/interface/threads";
import LoadingIndicator from "@/components/Loading";

export default function ThreadsScreen() {
  const [threads, setThreads] = useState<IThread[]>([]); 
  const [loading, setLoading] = useState(true);

  const fetchThreads = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/thread/");
      if (response.data.status) {
        setThreads(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching threads:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchThreads();
  }, []);
  

  return (
    <View className="flex-1 bg-Snow p-4">
      <View className="flex-row items-center justify-between mt-6 mb-8">
        <Text className="text-Heading3 font-semibold">Threads</Text>
        <TouchableOpacity className="bg-Bittersweet w-10 h-10 rounded-lg flex items-center justify-center">
          <Plus size={25} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <LoadingIndicator />
      ) : (
        <FlatList
          data={threads}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <ThreadCard
              image={item.thread_detail[0]?.skincare?.image}
              title={item.thread_detail[0]?.skincare?.name}
              user={item.user.full_name}
              userAvatar={item.user.userAvatar}
            />
          )}
        />
      )}
    </View>
  );
}
