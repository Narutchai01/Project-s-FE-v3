import React from "react";
import { View, SafeAreaView} from "react-native";
import { BackButtonComponents } from "@/components/Buntton";
import { router } from "expo-router";

export default function ChangePasswordScreen() {
  return (
    <SafeAreaView className="flex-1 bg-Snow p-4">
     <View className="h-16 bg-Snow">
             <BackButtonComponents
               title={"Change Password"}
               textSize="text-Heading3 text-Quartz"
               onPress={() => router.back()}
             />
           </View>
    </SafeAreaView>
  );
}