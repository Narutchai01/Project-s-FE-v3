import React from "react";
import { Tabs } from "expo-router";
import {
  SquareArrowLeftIcon,
  House,
  BookAIcon,
  CameraIcon,
  MessageCircleMore,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { ButtonComponents } from "@/components/Buntton";
import { useCompare } from "@/context/CompareContext";

export default function _layout() {
  const router = useRouter();
  const { isCompare, setIsCompare, setCompare } = useCompare();

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
          headerTitle: isCompare ? "" : "Diary",
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <BookAIcon size={size} color={color} />
          ),
          headerRight: () =>
            isCompare ? <ConfirmButton /> : <CompareButton />,
          headerLeft: () =>
            isCompare ? (
              <ButtonComponents
                title="Cancel"
                textSize="text-label8 font-semibold"
                onPress={() => {
                  setIsCompare(!isCompare);
                  setCompare([]);
                }}
                className="px-2 py-2"
              />
            ) : null,
          headerStyle: {
            backgroundColor: "#FCFAFD",
          },
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
  );
}

const CompareButton = () => {
  const { setIsCompare, isCompare } = useCompare();
  return (
    <ButtonComponents
      title="Compare"
      className="bg-Bittersweet px-2 py-2 rounded-full"
      textSize="text-label8 font-semibold text-white"
      onPress={() => setIsCompare(!isCompare)}
    />
  );
};

const ConfirmButton = () => {
  const { setIsCompare, isCompare } = useCompare();
  const router = useRouter();
  return (
    <ButtonComponents
      title="Confirm"
      className="bg-Bittersweet px-2 py-2 rounded-full"
      textSize="text-label8 font-semibold text-white"
      onPress={() => {
        setIsCompare(!isCompare);
        router.push("/compare");
      }}
    />
  );
};
