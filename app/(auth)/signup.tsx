import { Text, View, SafeAreaView, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { ButtonComponents } from "@/components/Buntton";
import { RadioComponents } from "@/components/Radio";
import { Link } from "expo-router";
import { ISignUp } from "@/interface/user";
import { axiosInstance } from "@/lib/axios_instance";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function SignUP() {
    const [data, setData] = useState<ISignUp>({ 
        full_name: "", birthday: "", email: "", password: "", sensitive_skin: false 
    });

    const handleChange = (name: string, value: string) => {
        setData({
            ...data,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        await axiosInstance
            .post("/api/user/signup", data)
            .then(async (res) => {
                await AsyncStorage.setItem("token", res.data.data.token);
            })
            .catch((err) => {
                console.log(err);
            });
    };

  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-y-4">
      <Text className="text-6xl font-bold">Create Your Account</Text>
      <View className="container mx-auto px-16">
        <View className="flex flex-col gap-y-8">
          <TextInput
            placeholder="Full name"
            className=" border-2  w-full rounded-full p-6 border-BrightGray"
            onChangeText={(full_name) => handleChange("full_name", full_name)}
          />
          <TextInput
            placeholder="Birthday"
            className=" border-2  w-full rounded-full p-6 border-BrightGray"
            onChangeText={(birthday) => handleChange("birthday", birthday)}
          />
          <TextInput
            placeholder="Email"
            className=" border-2  w-full rounded-full p-6 border-BrightGray"
            onChangeText={(email) => handleChange("email", email)}
          />
          <TextInput
            placeholder="Password"
            className=" border-2  w-full rounded-full p-6 border-BrightGray"
            onChangeText={(password) => handleChange("password", password)}
          />
          <TextInput
            placeholder="Confirm Password"
            className=" border-2  w-full rounded-full p-6 border-BrightGray"
          />
          <View className="flex flex-col gap-y-4">
            <Text>Do you have sensitive facial skin?</Text>
            <RadioComponents />
          </View>
          <ButtonComponents
            onPress={handleSubmit}
            title="Register"
            className="flex flex-row items-center justify-center rounded-full border-4 border-BrightGray p-6 bg-Bittersweet"
            textSize="text-white text-xl font-bold"
          />
        </View>
      </View>
      <Link href="/login" className=" text-center text-Quartz font-bold ">
        Already Have an account ?<Text className="text-black"> Login</Text>
      </Link>
    </SafeAreaView>
  );
}
