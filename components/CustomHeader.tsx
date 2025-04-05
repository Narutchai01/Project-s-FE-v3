import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CopyPlus, MessageCircleQuestion, Plus } from "lucide-react-native";
import { Search } from "@/components/Search";

interface CustomHeaderProps {
  isMode: boolean;
  searchQuery: string;
  isSearchOpen: boolean;
  setSearchQuery: (q: string) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsThreadModalOpen: (val: boolean) => void;
  setIsReviewModalOpen: (val: boolean) => void;
  setIsMode: (mode: boolean) => void;
}

const CustomHeaderComponent: React.FC<CustomHeaderProps> = ({
  isMode,
  searchQuery,
  isSearchOpen,
  setSearchQuery,
  setIsSearchOpen,
  setIsThreadModalOpen,
  setIsReviewModalOpen,
  setIsMode,
}) => {
  return (
    <View className="bg-Snow p-4 border-b-2 border-gray-300 relative">
      <View className="flex flex-row items-center justify-between ml-2">
        <Text className="text-Heading3 text-Black">
          {isMode ? "Threads" : "Reviews"}
        </Text>

        <View className="flex flex-row items-center justify-between">
          <Search
            searchQuery={searchQuery}
            isSearchOpen={isSearchOpen}
            setSearchQuery={setSearchQuery}
            setIsSearchOpen={setIsSearchOpen}
          />
          <TouchableOpacity
            className="bg-Bittersweet w-8 h-8 rounded-lg flex items-center justify-center mr-2"
            onPress={() =>
              isMode ? setIsThreadModalOpen(true) : setIsReviewModalOpen(true)
            }
          >
            <Plus size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex flex-row items-center justify-around mt-4">
        <TouchableOpacity onPress={() => setIsMode(false)}>
          <View className="flex items-center relative -mb-2">
            <CopyPlus size={30} />
            {!isMode && (
              <View className="absolute bottom-[-9px] w-full border-b-2 border-black" />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsMode(true)}>
          <View className="flex items-center relative -mb-2">
            <MessageCircleQuestion size={30} />
            {isMode && (
              <View className="absolute bottom-[-9px] w-full border-b-2 border-black" />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const CustomHeader = memo(CustomHeaderComponent);
