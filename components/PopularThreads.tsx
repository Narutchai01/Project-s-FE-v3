import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { ChevronRight } from "lucide-react-native";
import threadData from "./../components/threadData";
import { PopularThreadCard } from "@/components/Card";

export default function PopularThreads() {
  return (
    <View className="mt-8">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-Heading3">Popular Threads</Text>
        <TouchableOpacity className="flex-row items-center">
          <Text className="text-label2 text-gray-500">see more</Text>
          <ChevronRight size={16} color="gray" />
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={threadData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <PopularThreadCard
            image={item.image}
            title={item.title}
            user={item.user}
            userAvatar={item.userAvatar}
          />
        )}
      />
    </View>
  );
}
