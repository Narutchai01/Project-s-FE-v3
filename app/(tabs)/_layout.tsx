import React from "react";
import { Tabs } from "expo-router";
import {
  House,
  BookAIcon,
  CameraIcon,
  MessageCircleMore,
  User,
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
        name="camera"
        options={{
          tabBarIcon: ({ color, size }) => (
            <CameraIcon size={size} color={color} />
          ),
          // hide the tab bar
          tabBarStyle: { display: "none" },
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
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
