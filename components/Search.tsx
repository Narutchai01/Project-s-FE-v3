import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Search: React.FC<SearchProps> = ({ searchQuery, setSearchQuery }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchBarWidth = useRef(new Animated.Value(40)).current;
  const inputRef = useRef<TextInput>(null);
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    if (searchQuery) {
      if (!isSearchOpen) {
        expandSearchBar();
      }
      setInputValue(searchQuery);
    }
  }, [searchQuery]);

  const expandSearchBar = () => {
    setIsSearchOpen(true);
    Animated.timing(searchBarWidth, {
      toValue: 290,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    });
  };

  const collapseSearchBar = () => {
    setSearchQuery("");
    setInputValue("");
    Keyboard.dismiss();
    
    Animated.timing(searchBarWidth, {
      toValue: 40,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start(() => {
      setIsSearchOpen(false);
    });
  };

  const handleTextChange = (text: string) => {
    setInputValue(text);
    setSearchQuery(text);
  };

  return (
    <View className="mr-2">
      <Animated.View style={{ width: searchBarWidth }}>
        {!isSearchOpen ? (
          <TouchableOpacity
            className="bg-Bittersweet w-15 h-10 rounded-full flex items-center justify-center"
            onPress={expandSearchBar}
          >
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
        ) : (
          <View className="flex-row items-center bg-Bittersweet rounded-full px-4 w-full h-10">
            <Ionicons name="search" size={20} color="white" className="mr-2" />
            <TextInput
              ref={inputRef}
              className="flex-1 text-white text-label1 h-6 p-0"
              placeholder="Search"
              placeholderTextColor="white"
              value={inputValue}
              onChangeText={handleTextChange}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              onPress={collapseSearchBar}
              className="p-1"
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Ionicons name="close-circle" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
};
