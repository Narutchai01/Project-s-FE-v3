import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { AppRegistry } from "react-native";
import { PaperProvider } from "react-native-paper";
import { expo } from "@/app.json";

export default function RootLayout() {
  return (
    <PaperProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="compare" />
          <Stack.Screen name="analysis" />
        </Stack>
      </AuthProvider>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(expo.name, () => RootLayout);
