import { Text, View } from "react-native";
import "@/global.css";
import { Link } from "expo-router";
import { api_url } from "@/config/config";

export default function Index() {
  return (
    <View className="flex flex-col items-center justify-center h-screen">
      <Link href="/login">Login {api_url}</Link>
    </View>
  );
}
