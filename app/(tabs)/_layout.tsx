import React from "react";
import { Tabs } from "expo-router";
import {
  House,
  BookAIcon,
  CameraIcon,
  MessageCircleMore,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { BackButtonComponents } from "@/components/Buntton";

export default function _layout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF6F61",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => <House size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MessageCircleMore size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          tabBarIcon: ({ color, size }) => (
            <BookAIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          headerTitle: "",
          headerShown: true,
          headerTransparent: true,
          tabBarIcon: ({ color, size }) => (
            <CameraIcon size={size} color={color} />
          ),
          headerLeft: () => (
            <BackButtonComponents
              title="Camera"
              textSize="text-Heading3 text-Quartz"
              onPress={() => router.back()}
            />

          ),
          // hide the tab bar
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
