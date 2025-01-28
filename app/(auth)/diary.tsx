import React, { useState, useRef } from "react";
import { View, Text, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Animated } from "react-native";
import DiaryCard from "@/components/DiaryCard";
import mockData from "@/components/mockData";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ButtonComponents } from "@/components/Buntton";
import { Ionicons } from "@expo/vector-icons"; 

export default function DiaryScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchWidth = useRef(new Animated.Value(40)).current; 

  const toggleSearch = () => {
    if (!isSearchOpen) {
      Animated.timing(searchWidth, {
        toValue: 300,  
        duration: 300, 
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(searchWidth, {
        toValue: 40, 
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    setIsSearchOpen(!isSearchOpen);
  };

  const filteredData = mockData.filter((entry) =>
    entry.date.includes(searchQuery) ||
    entry.skinProblems.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.skinType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white p-4">
        
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-Heading3">Diary</Text>
          <View className="flex-row items-center gap-2">
            
            <Animated.View style={{ width: searchWidth, overflow: "hidden" }}>
              <TouchableOpacity 
                className="bg-Bittersweet h-10 rounded-full flex-row items-center px-4"
                onPress={toggleSearch}
              >
                <Ionicons name="search" size={20} color="white" />
                {isSearchOpen && (
                  <TextInput
                    className="flex-1 text-white text-lg ml-2"
                    placeholder="Search"
                    placeholderTextColor="white"
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                    autoFocus
                  />
                )}
                {isSearchOpen && (
                  <TouchableOpacity onPress={toggleSearch} className="ml-2">
                    <Ionicons name="close-circle" size={20} color="white" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
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
          {filteredData.map((entry) => (
            <DiaryCard
              key={entry.id}
              image={entry.image}
              date={entry.date}
              skinProblems={entry.skinProblems}
              numberOfSpots={entry.numberOfSpots}
              skinType={entry.skinType}
            />
          ))}
        </ScrollView>
        
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
