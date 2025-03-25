import React, { useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { BackButtonComponents } from "@/components/Buntton";
import { router } from "expo-router";
import { PencilLine, Lock, LogOut } from "lucide-react-native";
import { LogoutConfirmAlert } from "@/components/Alert";

export default function SettingScreen() {
  const [showAlert, setShowAlert] = useState(false);

  const handleLogout = () => {
    setShowAlert(false);
    router.push("/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-Snow p-4">
      <View className="h-14 bg-Snow">
        <BackButtonComponents
          title={"Settings"}
          textSize="text-Heading3 text-Quartz"
          onPress={() => router.back()}
        />
      </View>
      <View className="px-2">
        <TouchableOpacity
          onPress={() => router.push("/editProfile")}
          className="flex-row items-start gap-x-4 py-4 border-b border-gray-300"
        >
          <PencilLine size={24} color="#4A4A4A" />
          <Text className="text-card1 text-Quartz mb-2">Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/changePassword")}
          className="flex-row items-start gap-x-4 py-4 border-b border-gray-300"
        >
          <Lock size={24} color="#4A4A4A" />
          <Text className="text-card1 text-Quartz mb-2">Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-start gap-x-4 py-4 border-b border-gray-300"
          onPress={() => setShowAlert(true)}
        >
          <LogOut size={24} color="#4A4A4A" />
          <Text className="text-card1 text-Quartz mb-2">Logout</Text>
        </TouchableOpacity>
      </View>

      <LogoutConfirmAlert
        visible={showAlert}
        onClose={() => setShowAlert(false)}
        onConfirm={handleLogout}
        title="Are you sure you want to logout?"
        confirm="Logout"
        cancel="Cancel"
      />
    </SafeAreaView>
  );
}
