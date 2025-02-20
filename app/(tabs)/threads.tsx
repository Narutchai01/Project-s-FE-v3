import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Plus } from "lucide-react-native";
import { ThreadCard } from "@/components/Card";
import threadData from "@/components/threadData";

export default function ThreadsScreen() {
  return (
    <ScrollView className="flex-1 bg-Snow p-4">
      <View className="flex-row items-center justify-between mt-6 mb-8">
        <Text className="text-Heading3 font-semibold">Threads</Text>
        <TouchableOpacity className="bg-Bittersweet w-10 h-10 rounded-lg flex items-center justify-center">
          <Plus size={25} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={threadData}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <ThreadCard
            image={item.image}
            title={item.title}
            user={item.user}
            userAvatar={item.userAvatar}
          />
        )}
      />
    </ScrollView>
  );
}
