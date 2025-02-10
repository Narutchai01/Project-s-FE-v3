import React from "react";
import { Tabs } from "expo-router";
import { HomeProvider } from "@/context/HomeContext";

export default function _layout() {
  return (
    <HomeProvider>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="home"/>
        <Tabs.Screen name="diary" />
      </Tabs>
    </HomeProvider>
  );
}
