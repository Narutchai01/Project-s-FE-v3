import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function CreatePost() {
  const [image, setImage] = useState<string | null>(null); 

  const pickImageAsync = async () => {
    const result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setImage(result.assets[0].uri); 
    } else {
      alert('You did not select any image.');
    }
  };

  return (
    <View className="mb-6">
      <TouchableOpacity
        onPress={pickImageAsync}
        className={`border-2 p-4 ${!image ? 'border-Bittersweet' : 'border-Bittersweet'} rounded-lg flex items-center justify-center ${image ? 'bg-gray-100' : 'bg-[rgba(255,111,97,0.1)]'} w-[190px] h-[260px]`} // Set size of the box
      >
        {image ? (
          <Image 
            source={{ uri: image }}
            className="w-[190px] h-[260px] rounded-lg object-cover" 
          />
        ) : (
          <View className="flex items-center">
            {/* <LucideImage size={40} className="text-red-500" />  */}
            <Text className="text-black text-label1">Add a photo</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
