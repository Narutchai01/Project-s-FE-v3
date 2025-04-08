import { View, Image } from "react-native";
import "@/global.css";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        router.push("/home");
      } else {
        router.push("/login");
      }
    };
    checkLogin();
  });

  return (
    <View className="flex flex-col items-center justify-center h-screen">
      <Image
        source={require("../assets/images/ucare-logo.png")}
        className="w-[18%] h-[65px] rounded-lg mr-4"
      />
    </View>
  );
}
