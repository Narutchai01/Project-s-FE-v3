import React, { useRef, useEffect, useCallback, memo } from "react";
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
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  setSearchQuery: (query: string) => void;
}

const SearchComponent: React.FC<SearchProps> = ({
  searchQuery,
  isSearchOpen,
  setSearchQuery,
  setIsSearchOpen,
}) => {
  const searchBarWidth = useRef(new Animated.Value(40)).current;
  const inputRef = useRef<TextInput>(null);

  const collapseSearchBar = () => {
    setSearchQuery("");
    Keyboard.dismiss();
    setIsSearchOpen(false);
  };

  const handleTextChange = useCallback(
    (text: string) => {
      setSearchQuery(text);
    },
    [setSearchQuery]
  );

  useEffect(() => {
    if (isSearchOpen) {
        Animated.timing(searchBarWidth, {
          toValue: 180,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start(() => {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 50);
        });
      
    } else {
      Animated.timing(searchBarWidth, {
        toValue: 40,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  }, [isSearchOpen, searchBarWidth, searchQuery.length]);

  return (
    <View className="mr-2">
      <Animated.View style={{ width: searchBarWidth }}>
        {!isSearchOpen ? (
          <TouchableOpacity
            className="bg-Bittersweet w-15 h-8 rounded-full flex items-center justify-center"
            onPress={() => setIsSearchOpen(true)}
          >
            <Ionicons name="search" size={18} color="white" />
          </TouchableOpacity>
        ) : (
          <View className="flex-row items-center bg-Bittersweet rounded-full px-4 w-full h-8">
            <Ionicons name="search" size={18} color="white" className="mr-2" />
            <TextInput
              ref={inputRef}
              className="flex-1 text-white text-label1 h-6 p-0"
              placeholder="Search"
              placeholderTextColor="white"
              value={searchQuery}
              onChangeText={handleTextChange}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={collapseSearchBar}
              className="p-1 -mr-2"
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

export const Search = memo(SearchComponent);
