import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { AppRegistry } from "react-native";
import { PaperProvider } from "react-native-paper";
import { expo } from "@/app.json";
import { HomeProvider } from "@/context/HomeContext";
import { CompareProvider } from "@/context/CompareContext";

export default function RootLayout() {
  return (
    <PaperProvider>
      <AuthProvider>
        <HomeProvider>
          <CompareProvider>
            <Stack
              screenOptions={{ headerShadowVisible: false, headerShown: false }}
            >
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="compare"
                options={{
                  headerTitle: "Compare",
                  headerShown: true,
                  
                }}
              />
              <Stack.Screen
                name="diary/[id]"
                options={{
                  headerTitle: "Result Analysis",
                  headerShadowVisible: false,
                  headerShown: true,
                }}
              />
            </Stack>
          </CompareProvider>
        </HomeProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(expo.name, () => RootLayout);
