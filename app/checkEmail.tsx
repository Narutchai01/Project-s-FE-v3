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
  const { user_id } = useRecoveryStore();

  const handleValidation = async () => {
    if (!otp.trim()) {
      setAlertTitle("Please enter your OTP");
      setShowAlert(true);
      return;
    }

    setShowAlert(false);
    startLoading();
    try {
      const payload = {
        otp: otp,
        user_id: user_id,
      };
      
      await axiosInstance.post("/recovery/validation", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      router.push("/recoverPassword");
    } catch (error: any) {
      console.error("Error validating OTP:", error.response?.data || error.message);
      setAlertTitle("Invalid or expired OTP");
      setShowAlert(true);
    } finally {
      stopLoading();
    }
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
            We’ve sent a code to byeWind@gmail.com
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
