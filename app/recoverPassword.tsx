import React, { useState } from "react";
import { Link } from "expo-router";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { ButtonComponents } from "@/components/Buntton";
import { Eye, EyeOff } from "lucide-react-native";
import { ModalChangePassworkSuccess } from "@/components/Modal";
import { axiosInstance } from "@/lib/axios_instance";
import { useRecoveryStore } from "@/store/recovery";

export default function RecoverPasswordScreen() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { user_id } = useRecoveryStore();

  const handleChangePassword = async () => {
    Keyboard.dismiss(); 
    
    if (!newPassword || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Password does not match.");
      return;
    }

    try {
      const payload = {
        new_password: newPassword,
        user_id: user_id,
      };

      const res = await axiosInstance.post("/recovery/reset-password", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setErrorMessage("");
      Keyboard.dismiss();
      setModalVisible(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error(
        "Error resetting password:",
        error.response?.data || error.message
      );
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-Snow justify-center items-center">
      <View className="w-full container mx-auto px-10">
        <View className="flex flex-col">
          <View className="mb-4">
            <Text className="text-heading leading-snug font-bold">
              Recovery your
            </Text>
            <Text className="text-heading leading-snug font-bold">
              Password
            </Text>
          </View>

          <Text className="text-label8 mb-6">
            Please type something you’ll remember
          </Text>

          <View className="w-full flex gap-4">
            <View className="relative mb-4">
              <TextInput
                placeholder="Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword}
                className="border-2 w-full rounded-full p-4 pr-12 border-BrightGray"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-5"
              >
                {showPassword ? (
                  <Eye size={18} color="#000" />
                ) : (
                  <EyeOff size={18} color="#000" />
                )}
              </TouchableOpacity>
            </View>

            <View className="relative">
              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                className="border-2 w-full rounded-full p-4 pr-12 border-BrightGray"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-5"
              >
                {showConfirmPassword ? (
                  <Eye size={20} color="#000" />
                ) : (
                  <EyeOff size={20} color="#000" />
                )}
              </TouchableOpacity>
            </View>

            {errorMessage ? (
              <Text className="text-label4 text-red-500 text-center mb-4">
                {errorMessage}
              </Text>
            ) : null}

            <ButtonComponents
              onPress={handleChangePassword}
              title="Submit"
              className="flex flex-row items-center justify-center rounded-full border-2 border-BrightGray p-4 bg-Bittersweet"
              textSize="text-white text-xl font-bold"
            />

            <View className="flex flex-col">
              <Link
                href="/login"
                className="text-center text-OldSilver text-label4 font-bold"
              >
                Already have an account?
                <Text className="text-label4 font-bold text-black"> Login</Text>
              </Link>
            </View>
          </View>
        </View>
      </View>

      <ModalChangePassworkSuccess
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}
