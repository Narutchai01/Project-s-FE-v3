import { View } from "react-native";
import "@/global.css";
import { Link } from "expo-router";
import { api_url } from "@/config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import {useRouter} from "expo-router";

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        router.push("/home");
      }else{
        router.push("/login");
      }
    };
    checkLogin();
  });

  return (
    <View className="flex flex-col items-center justify-center h-screen">
      <Link href="/login">Login {api_url}</Link>
    </View>
  );
}
