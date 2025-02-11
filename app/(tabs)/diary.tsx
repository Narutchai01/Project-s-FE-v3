import React from "react";
import {
  ScrollView,
  SafeAreaView,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useHome } from "@/context/HomeContext";
import { CardDiary } from "@/components/Card";


export default function DiaryScreen() {
  const { results } = useHome();


  // const [searchQuery, setSearchQuery] = useState("");
  // const [isSearchOpen, setIsSearchOpen] = useState(false);
  // const [isCompareMode, setIsCompareMode] = useState(false);
  // const [selectedDiaries, setSelectedDiaries] = useState<string[]>([]);

  // const searchBarWidth = useRef(new Animated.Value(40)).current;
  // const fadeOpacity = useRef(new Animated.Value(1)).current;

  // const fadeOutText = () => {
  //   Animated.timing(fadeOpacity, {
  //     toValue: 0,
  //     duration: 400, 
  //     easing: Easing.out(Easing.exp),
  //     useNativeDriver: false,
  //   }).start();
  // };

  // const fadeInText = () => {
  //   Animated.timing(fadeOpacity, {
  //     toValue: 1,
  //     duration: 50,
  //     easing: Easing.in(Easing.exp),
  //     useNativeDriver: false,
  //   }).start();
  // };

  // const expandSearchBar = () => {
  //   setIsSearchOpen(true);
  //   fadeOutText();
  //   Animated.timing(searchBarWidth, {
  //     toValue: 300,
  //     duration: 500,
  //     easing: Easing.out(Easing.exp),
  //     useNativeDriver: false,
  //   }).start();
  // };

  // const collapseSearchBar = () => {
  //   Animated.timing(searchBarWidth, {
  //     toValue: 40,
  //     duration: 500,
  //     easing: Easing.out(Easing.exp),
  //     useNativeDriver: false,
  //   }).start(() => {
  //     setTimeout(() => {
  //       setIsSearchOpen(false);
  //       fadeInText(); 
  //     }, 0); 
  //   });
  // };

  // const toggleSelection = (id: string | number) => {
  //   if (!isCompareMode) return;
  //   const idStr = id.toString();
  //   setSelectedDiaries((prevSelected) =>
  //     prevSelected.includes(idStr)
  //       ? prevSelected.filter((diaryId) => diaryId !== idStr)
  //       : prevSelected.length < 3
  //       ? [...prevSelected, idStr]
  //       : prevSelected
  //   );
  // };
  
  // const handleCompareOrConfirm = () => {
  //   if (isCompareMode) {
  //     const selectedData = mockData.filter((data) =>
  //       selectedDiaries.includes(data.id.toString())
  //     );
  
  //     if (selectedData.length === 0) {
  //       console.error("No selected diaries found!");
  //       return;
  //     }
  
  //     router.push({
  //       pathname: "/compare",
  //       params: { selectedDiaries: JSON.stringify(selectedData) }, 
  //     });
  
  //     setIsCompareMode(false);
  //     setSelectedDiaries([]);
  //   } else {
  //     setIsCompareMode(true);
  //   }
  // };

  // const filteredData = mockData.filter(
  //   (data) =>
  //     data.date.includes(searchQuery) ||
  //     data.skinProblems.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     data.skinType.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-Snow p-8">
        {/* <View className="flex-row items-center justify-between mb-4"> */}
          
          {/* <Animated.View style={{ opacity: fadeOpacity }}>
            {!isSearchOpen && isCompareMode ? (
              <TouchableOpacity onPress={() => setIsCompareMode(false)}>
                <Text className="text-Heading3 text-Quartz">Cancel</Text>
              </TouchableOpacity>
            ) : !isSearchOpen ? (
              <Text className="text-Heading3 flex-1">Diary</Text>
            ) : (
              <View className="flex-1"></View> 
            )}
          </Animated.View> */}

          {/* <View className="flex-row items-center gap-2">
            <Animated.View
              style={{ width: searchBarWidth }}
              className="h-10 rounded-full overflow-hidden bg-Bittersweet flex-row items-center"
            >
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
              title={isCompareMode ? "Confirm" : "Compare"}
              className="rounded-full bg-Bittersweet px-4 py-2"
              textSize="text-white text-lg font-semibold"
              onPress={handleCompareOrConfirm}
            />
          </View>
        </View> */}

        {/* {isCompareMode && (
          <View className="flex items-center mb-4">
            <Text className="text-Heading3 font-semibold text-center">
              Select diary to compare ({selectedDiaries.length}/3)
            </Text>
          </View>
        )} */}

        <ScrollView>
          {results?.map((result) => {
            return (
              <CardDiary key={result.id} data={result} />
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
