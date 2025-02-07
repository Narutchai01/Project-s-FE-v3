import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { ChevronRight, Heart } from "lucide-react-native";
import threadData from "./../components/threadData";

export default function PopularThreads() {
  return (
    <View className="mt-8">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-Heading3">Popular Threads</Text>
        <TouchableOpacity className="flex-row items-center">
          <Text className="text-label2 text-gray-500 mr-1">see more</Text>
          <ChevronRight size={16} color="gray" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {threadData.map((thread, index) => (
          <View key={index} className="bg-white rounded-2xl shadow w-[120px] h-[155px] mx-2 mb-2">
            <Image source={{ uri: thread.image }} className="w-full h-[110px] rounded-t-2xl object-cover" />

            <View className="p-2 ml-2">
              <Text className="text-label12 font-medium">{thread.title}</Text>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Image source={{ uri: thread.userAvatar }} className="w-5 h-5 rounded-full mr-2" />
                  <Text className="text-label13 text-gray-600">{thread.user}</Text>
                </View>

                <TouchableOpacity className="w-7 h-7 bg-[#FFFAF5] rounded-full flex items-center justify-center">
                  <Heart size={12} color="gray" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
