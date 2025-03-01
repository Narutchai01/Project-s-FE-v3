import React from "react";
import { Stack } from "expo-router";

export default function CommonLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
  );
}
