import { View, Text, SafeAreaView, Image, TextInput } from "react-native";
import React, { useEffect } from "react";
import { ButtonComponents, GoogleButtonSignIn } from "@/components/Buntton";
import DividerWithText from "@/components/DividerWithText";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Link, useRouter} from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { ModalSensitiveSkin } from "@/components/Modal";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();
  const {
    loginData,
    setLoginData,
    handleLogin,
    googleSignIn,
    isOpen,
    setSensitiveSkin,
    UpdateSenSitiveSkincare,
    user,
  } = useAuth();

useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token && user.sensitive_skin !== null) {
        router.push("/home");
      }
    };
    checkLogin();
});


  const handleChange = (key: string, value: string) => {
    setLoginData({ ...loginData, [key]: value });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 justify-center items-center">
        <View className="w-full container mx-auto px-10">
          <View className="flex flex-col items-center justify-center">
            <Image
              source={require("@/assets/images/ucare-logo.png")}
              width={350}
              height={350}
            />
            <Text className="text-5xl font-bold">UCare</Text>
            <View className="w-full flex gap-10">
              <TextInput
                placeholder="Email"
                className=" border-2  w-full rounded-full p-6 border-BrightGray"
                onChangeText={(email) => handleChange("email", email)}
              />
              <TextInput
                placeholder="Password"
                secureTextEntry={true}
                className=" border-2  w-full rounded-full p-6 border-BrightGray"
                onChangeText={(password) => handleChange("password", password)}
              />
              <ButtonComponents
                onPress={handleLogin}
                title="Login"
                className="flex flex-row items-center justify-center rounded-full border-4 border-BrightGray p-6 bg-Bittersweet"
                textSize="text-white text-xl font-bold"
              />
            </View>
          </View>
          <DividerWithText />
          <View className="flex flex-col gap-10">
            <GoogleButtonSignIn googleSignIn={googleSignIn} />
            <Link
              href="/signup"
              className=" text-center text-OldSilver font-bold "
            >
              Don’t have an account?<Text className="text-black"> Sign Up</Text>
            </Link>
          </View>
        </View>
        <ModalSensitiveSkin
          isOpen={isOpen}
          setSensitiveSkin={setSensitiveSkin}
          onPres={UpdateSenSitiveSkincare}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
