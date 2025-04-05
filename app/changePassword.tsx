import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { BackButtonComponents, ButtonComponents } from "@/components/Buntton";
import { router } from "expo-router";
import { ConfirmAlert } from "@/components/Alert";
import useLoading from "@/hook/useLoading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";
import { Eye, EyeOff } from "lucide-react-native";
import { AxiosError } from "axios";

export default function ChangePasswordScreen() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("Change Password Success");
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handle404Error = (error: unknown) => {
    const axiosError = error as AxiosError;
    if (axiosError?.response?.status === 404 && !alertVisible) {
      setAlertMessage("Your session has expired or account not found.");
      setAlertVisible(true);
    }
  };

  const handleNewPassword = async (password: string) => {
    startLoading();
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const formData = new FormData();
      formData.append("password", password);

      await axiosInstance.put("/user", formData, {
        headers: {
          token,
          "Content-Type": "multipart/form-data",
        },
      });

      setAlertTitle("Change Password Success");
      setShowAlert(true);
    } catch (error) {
      handle404Error(error);
      console.error("Error changing password:", error);
    } finally {
      stopLoading();
    }
  };

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
    handleNewPassword(confirmPassword);
  };

  return (
    <SafeAreaView className="flex-1 bg-Snow p-6">
      <View className="h-14 bg-Snow">
        <BackButtonComponents
          title={"Change Password"}
          textSize="text-Heading3 text-Quartz"
          onPress={() => router.back()}
        />
      </View>
      <View className="px-4">
        <Text className="text-Heading4 text-Quartz mb-2 mt-2">
          New Password
        </Text>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showPassword}
          className="border-2 w-full rounded-full p-4 border-BrightGray mb-4"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="absolute right-8 top-[52px]"
        >
          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
        </TouchableOpacity>

        <Text className="text-Heading4 text-Quartz mb-2 mt-4">
          Confirm Password
        </Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          className="border-2 w-full rounded-full p-4 border-BrightGray mb-8"
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-8 top-[160px]"
        >
          {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
        </TouchableOpacity>

        <ButtonComponents
          onPress={handleChangePassword}
          title="Confirm"
          className="flex flex-row items-center justify-center rounded-full border-2 border-BrightGray p-4 bg-Bittersweet"
          textSize="text-white text-xl font-bold"
        />
      </View>

      <ConfirmAlert
        visible={showAlert}
        onClose={() => {
          setShowAlert(false);
          if (alertTitle === "Change Password Success") {
            router.back();
          }
        }}
        title={alertTitle}
        confirm="Done"
      />

      <ConfirmAlert
        visible={alertVisible}
        title={alertMessage}
        confirm="Back to login"
        onClose={() => {
          setAlertVisible(false);
          router.replace("/login");
        }}
      />
    </SafeAreaView>
  );
}
