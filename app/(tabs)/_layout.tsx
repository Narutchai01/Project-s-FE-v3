import React from "react";
import { Tabs } from "expo-router";
import { HomeProvider } from "@/context/HomeContext";
import { SquareArrowLeftIcon ,House ,BookAIcon,CameraIcon} from "lucide-react-native";
import { useRouter } from "expo-router";

export default function _layout() {

  const router = useRouter();

  return (
    <HomeProvider>
      <Tabs screenOptions={{ headerShown: false
        ,tabBarActiveTintColor: "red",
       }}>
        <Tabs.Screen 
          name="home" 
          options={{
        tabBarIcon: ({ color, size }) => (
          <House size={size} color={color} /> 
        ),
          }} 
        />
        <Tabs.Screen
          name="diary"
          options={{
        title: "Diary",
        tabBarIcon: ({ color, size }) => (
          <BookAIcon size={size} color={color} />
        ),
        headerStyle: {
          backgroundColor: "#FCFAFD",
        },
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
        headerTitle: "Camera",
        headerShown: true,
        headerTransparent: true,
        tabBarIcon: ({ color, size }) => (
          <CameraIcon size={size} color={color} />
        ),
        headerLeft: () => (
          <SquareArrowLeftIcon
            size={28}
            color="#4A4A4A"
            onPress={() => router.back()}
          />
        ),
        // hide the tab bar
        tabBarStyle: { display: "none" },
          }}
        />
      </Tabs>
    </HomeProvider>
  );
}
