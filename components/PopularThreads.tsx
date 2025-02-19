import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity ,FlatList} from "react-native";
import { ChevronRight, Heart } from "lucide-react-native";
import threadData from "./../components/threadData";

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
        renderItem={({ item: thread }) => (
          <View
        className="bg-white rounded-2xl shadow w-[120px] h-[155px] mx-2 mb-2 relative overflow-hidden"
          >
        <View className="w-[120px] h-[120px] relative overflow-hidden">
          <Image
            source={{ uri: thread.image }}
            className="w-full h-full rounded-t-2xl object-cover"
            style={{ borderBottomRightRadius: 32.5 }}
          />
        </View>

        <View
          className="absolute bottom-0 left-0 w-[120px] bg-white "
          style={{ borderTopLeftRadius: 13, borderTopRightRadius: 5 }}
        >
          <View className="p-2">
            <Text
          className="text-label12 font-medium mb-1"
          numberOfLines={1}
          ellipsizeMode="tail"
            >
          {thread.title}
            </Text>
            <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image
              source={{ uri: thread.userAvatar }}
              className="w-5 h-5 rounded-full mr-2"
            />
            <Text className="text-label13 text-gray-600">
              {thread.user}
            </Text>
          </View>

          <TouchableOpacity className="w-7 h-7 bg-[#FFFAF5] rounded-full flex items-center justify-center">
            <Heart size={12} color="gray" />
          </TouchableOpacity>
            </View>
          </View>
        </View>
          </View>
        )}
      />
    </View>
  );
}
