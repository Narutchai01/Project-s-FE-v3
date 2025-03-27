import { ButtonComponents } from "@/components/Buntton";
import { Link, router } from "expo-router";
import React from "react";
import { View, Text, SafeAreaView, TextInput } from "react-native";

export default function ForgotPasswordScreen() {
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
              className=" border-2  w-full rounded-full p-6 border-BrightGray"
            />

            <ButtonComponents
              onPress={() => {router.push("/checkEmail")}}
              title="Submit"
              className="flex flex-row items-center justify-center rounded-full border-2 border-BrightGray p-6 bg-Bittersweet"
              textSize="text-white text-xl font-bold"
            />

            <View className="flex flex-col">
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
