import React, { useCallback } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

interface SearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Search: React.FC<SearchProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  const handleClear = () => {
    setSearchQuery("");
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSearchQuery(""); 
      };
    }, [setSearchQuery])
  );
  
  return (
    <View className="flex-row items-center bg-Bittersweet rounded-full px-4 w-full h-8 mb-6">
      <Ionicons name="search" size={18} color="white" />

      <TextInput
        className="flex-1 text-white text-label1 h-6 px-2"
        placeholder="Search"
        placeholderTextColor="white"
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {searchQuery.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          className="p-1 -mr-2"
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons name="close-circle" size={20} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};
