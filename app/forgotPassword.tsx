import { ButtonComponents } from "@/components/Buntton";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { View, Text, SafeAreaView, TextInput } from "react-native";
import useLoading from "@/hook/useLoading";
import { axiosInstance } from "@/lib/axios_instance";
import { useRecoveryStore } from "@/store/recovery";

export default function ForgotPasswordScreen() {
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [email, setEmail] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");

  const handleEmail = async () => {
    if (!email.trim()) {
      setAlertTitle("Please enter your email");
      setShowAlert(true);
      return;
    }

    setShowAlert(false);
    startLoading();
    try {
      const formData = new FormData();
      formData.append("email", email);

      const res = await axiosInstance.post("/recovery", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const user_id = res?.data?.data?.user_id;
      useRecoveryStore.getState().setUserId(user_id);

      setEmail("");
      router.push("/checkEmail");
    } catch (error) {
      console.error("Error sending forgot password email:", error);
    } finally {
      stopLoading();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-Snow justify-center items-center">
      <View className="w-full container mx-auto px-10">
        <View className="flex flex-col ">
          <View className="mb-4">
            <Text className="text-heading leading-snug font-bold">Forget</Text>
            <Text className="text-heading leading-snug font-bold">
              Password ?
            </Text>
          </View>

          <Text className="text-label8 mb-10">
            Don’t worry! It happens. Please enter the email associated with your
            account.
          </Text>
          <View className="w-full flex gap-10">
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              className=" border-2  w-full rounded-full p-4 border-BrightGray"
            />

            {showAlert && (
              <View className="flex flex-row items-center justify-center -mb-6 -mt-2">
              <Text className="text-red-500 text-sm">
                {alertTitle}
              </Text>
              </View>
            )}

            <ButtonComponents
              onPress={handleEmail}
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
