import { ButtonComponents } from "@/components/Buntton";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { View, Text, SafeAreaView, TextInput } from "react-native";
import useLoading from "@/hook/useLoading";
import { axiosInstance } from "@/lib/axios_instance";
import { useRecoveryStore } from "@/store/recovery";

export default function CheckEmailScreen() {
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [otp, setOTP] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const { user_id, email } = useRecoveryStore();


  const handleValidation = async () => {
    if (!otp.trim()) {
      return showError("Please enter your OTP");
    }

    setShowAlert(false);
    startLoading();

    try {
      const payload = { otp, user_id };

      await axiosInstance.post("/recovery/validation", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      router.push("/recoverPassword");
    } catch (error: any) {
      const rawMessage = error?.response?.data?.error || error.message;
      const userFriendlyMessage = getErrorMessage(rawMessage);
      showError(userFriendlyMessage);
    } finally {
      stopLoading();
    }
  };

  const showError = (message: string) => {
    setAlertTitle(message);
    setShowAlert(true);
  };

  const getErrorMessage = (message: string): string => {
    const normalized = message.toLowerCase();

    if (normalized.includes("invalid")) {
      return "The OTP you entered is invalid. Please try again.";
    }

    if (normalized.includes("expire")) {
      return "Your OTP has expired. Please request a new one.";
    }

    if (normalized.includes("network")) {
      return "Network error. Please check your internet connection.";
    }

    return "Something went wrong. Please try again.";
  };


  return (
    <SafeAreaView className="flex-1 bg-Snow justify-center items-center">
      <View className="w-full container mx-auto px-10">
        <View className="flex flex-col ">
          <View className="mb-4">
            <Text className="text-heading leading-snug font-bold">
              Please Check
            </Text>
            <Text className="text-heading leading-snug font-bold">
              your email
            </Text>
          </View>

          <Text className="text-label8 mb-10">
            We’ve sent a code to <Text className="text-label8 font-medium">{email}</Text>
          </Text>

          <View className="w-full flex gap-10">
            <TextInput
              placeholder="otp"
              value={otp}
              onChangeText={setOTP}
              keyboardType="number-pad"
              className="border-2 w-full rounded-full p-4 border-BrightGray"
            />

            {showAlert && (
              <View className="flex flex-row items-center justify-center -mb-6 -mt-2">
                <Text className="text-red-500 text-sm">{alertTitle}</Text>
              </View>
            )}

            <ButtonComponents
              onPress={handleValidation}
              title="Submit"
              className="flex flex-row items-center justify-center rounded-full border-2 border-BrightGray p-4 bg-Bittersweet"
              textSize="text-white text-xl font-bold"
            />

            <View className="flex flex-col -mt-6">
              <Link
                href="/login"
                className=" text-center text-OldSilver text-label4 font-bold"
              >
                Already have an account?
                <Text className="text-label4 font-bold text-black"> Login</Text>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
