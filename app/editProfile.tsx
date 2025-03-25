import React from "react";
import { View, SafeAreaView} from "react-native";
import { BackButtonComponents } from "@/components/Buntton";
import { router } from "expo-router";

export default function EditProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-Snow p-4">
     <View className="h-16 bg-Snow">
             <BackButtonComponents
               title={"Edit Profile"}
               textSize="text-Heading3 text-Quartz"
               onPress={() => router.back()}
             />
           </View>
    </SafeAreaView>
  );
}