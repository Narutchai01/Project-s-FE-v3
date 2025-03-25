import React, { useState } from "react";
import { View, SafeAreaView, Text, TextInput } from "react-native";
import { BackButtonComponents, ButtonComponents } from "@/components/Buntton";
import { router } from "expo-router";
import { ConfirmAlert } from "@/components/Alert";

export default function ChangePasswordScreen() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("Change Password Success");

  const handleChangePassword = () => {
    if (!newPassword || !confirmPassword) {
      setAlertTitle("Please fill in all fields");
      setShowAlert(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlertTitle("Password not match");
      setShowAlert(true);
      return;
    }

    setAlertTitle("Change Password Success");
    setShowAlert(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-Snow p-4">
      <View className="h-14 bg-Snow">
        <BackButtonComponents
          title={"Change Password"}
          textSize="text-Heading3 text-Quartz"
          onPress={() => router.back()}
        />
      </View>
      <View className="px-4">
        <Text className="text-Heading4 text-Quartz mb-4 mt-4">
          New Password
        </Text>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={true}
          className="border-2 w-full rounded-full p-6 border-BrightGray mb-4"
        />
        <Text className="text-Heading4 text-Quartz mb-4 mt-4">
          Confirm Password
        </Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          className="border-2 w-full rounded-full p-6 border-BrightGray mb-8"
        />
        <ButtonComponents
          onPress={handleChangePassword}
          title="Confirm"
          className="flex flex-row items-center justify-center rounded-full border-4 border-BrightGray p-6 bg-Bittersweet"
          textSize="text-white text-xl font-bold"
        />
      </View>

      <ConfirmAlert
        visible={showAlert}
        onClose={() => setShowAlert(false)}
        title={alertTitle}
        confirm="Done"
      />
    </SafeAreaView>
  );
}
