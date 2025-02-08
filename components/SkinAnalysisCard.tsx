import React from "react";
import { View, Text, Image } from "react-native";

export default function SkinAnalysisCard() {
  const updatedDate = "21/11/2024";

  const groupImagesIntoRows = (images: { uri: string }[]): { uri: string }[][] => {
    return images.reduce<{ uri: string }[][]>((acc, image, index) => {
      if (index % 3 === 0) acc.push([]); 
      acc[acc.length - 1].push(image);
      return acc;
    }, []);
  };

  const skinTypeImages = Array(3).fill({ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf81PydDJjzDIgjSuK3A7ZaOWALBQlG3-_0g&s" });
  const acneImages = Array(6).fill({ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf81PydDJjzDIgjSuK3A7ZaOWALBQlG3-_0g&s" });
  const skinProblemImages = Array(4).fill({ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf81PydDJjzDIgjSuK3A7ZaOWALBQlG3-_0g&s" });

  const skinTypeRows = groupImagesIntoRows(skinTypeImages);
  const acneRows = groupImagesIntoRows(acneImages);
  const skinProblemRows = groupImagesIntoRows(skinProblemImages);

  return (
    <View className="flex justify-center items-center mt-2">
      <View className="bg-white rounded-3xl shadow-md flex items-center justify-center w-[350px] h-[246px]">
        <View className="flex-row items-center justify-center ">
          <View className="w-[148px] h-[200.95px]">
            <Image
              source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf81PydDJjzDIgjSuK3A7ZaOWALBQlG3-_0g&s" }}
              className="w-[148px] h-[200.95px] rounded-2xl object-cover"
            />
          </View>

          <View className="flex flex-col justify-evenly ml-8 ">
            <Text className="text-label2 font-bold mb-1 mt-1">Skin Type:</Text>
            <View >
              {skinTypeRows.map((row, rowIndex) => (
                <View key={rowIndex} className="flex-row gap-2 mb-2">
                  {row.map((image, index) => (
                    <Image key={index} source={image} className="w-8 h-8 rounded-full" />
                  ))}
                </View>
              ))}
            </View>

            <Text className="text-label2 font-bold mb-1">Acne Type:</Text>
            <View >
              {acneRows.map((row, rowIndex) => (
                <View key={rowIndex} className="flex-row gap-2 mb-2">
                  {row.map((image, index) => (
                    <Image key={index} source={image} className="w-8 h-8 rounded-full" />
                  ))}
                </View>
              ))}
            </View>

            <Text className="text-label2 font-bold mb-1 ">Skin Problems:</Text>
            <View>
              {skinProblemRows.map((row, rowIndex) => (
                <View key={rowIndex} className="flex-row gap-2 mb-2">
                  {row.map((image, index) => (
                    <Image key={index} source={image} className="w-8 h-8 rounded-full" />
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View className="flex-row justify-end mt-4 mr-16 w-full">
        <Text className="text-gray-500 text-label7">update {updatedDate}</Text>
      </View>
    </View>
  );
}
