import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import DiaryCard from "@/components/DiaryCard";
import mockData from "@/components/mockData";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ButtonComponents } from "@/components/Buntton";
import { Ionicons } from "@expo/vector-icons";

export default function DiaryScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchBarWidth = useRef(new Animated.Value(40)).current;

  const expandSearchBar = () => {
    setIsSearchOpen(true);
    Animated.timing(searchBarWidth, {
      toValue: 300,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const collapseSearchBar = () => {
    Animated.timing(searchBarWidth, {
      toValue: 40,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start(() => setIsSearchOpen(false));
  };

  const filteredData = mockData.filter(
    (data) =>
      data.date.includes(searchQuery) ||
      data.skinProblems.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.skinType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white p-4">
        <View className="flex-row justify-between items-center mb-4">
          {!isSearchOpen && <Text className="text-Heading3">Diary</Text>}

          <View className="flex-row items-center gap-2">
            <Animated.View style={{ width: searchBarWidth }}>
              {!isSearchOpen ? (
                <TouchableOpacity
                  className="bg-Bittersweet w-10 h-10 rounded-full flex items-center justify-center"
                  onPress={expandSearchBar}
                >
                  <Ionicons name="search" size={20} color="white" />
                </TouchableOpacity>
              ) : (
                <View className="flex-row items-center bg-Bittersweet rounded-full px-4 py-2 w-full">
                  <Ionicons name="search" size={20} color="white" className="mr-2" />
                  <TextInput
                    className="flex-1 text-white text-lg"
                    placeholder="Search"
                    placeholderTextColor="white"
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                  />
                  <TouchableOpacity onPress={collapseSearchBar} className="ml-2">
                    <Ionicons name="close-circle" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>

            <ButtonComponents
              title="Compare"
              className="rounded-full bg-Bittersweet px-4 py-2"
              textSize="text-white text-lg font-semibold"
              onPress={() => console.log("Compare button pressed")}
            />
          </View>
        </View>

        <ScrollView>
          {filteredData.map((data) => (
            <DiaryCard
              key={data.id}
              image={data.image}
              date={data.date}
              skinProblems={data.skinProblems}
              numberOfSpots={data.numberOfSpots}
              skinType={data.skinType}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
