import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { AppRegistry } from "react-native";
import { PaperProvider } from "react-native-paper";
import { expo } from "@/app.json";
import { HomeProvider } from "@/context/HomeContext";


export default function RootLayout() {

  return (
    <PaperProvider>
      <AuthProvider>
        <HomeProvider>
          <Stack
            screenOptions={{ headerShadowVisible: false, headerShown: false }}
          >
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="compare" />
            <Stack.Screen
              name="diary/[id]"
              options={{
                headerTitle: "Result Analysis",
                headerShadowVisible: false,
                headerShown: true,
               
              }}
            />
          </Stack>
        </HomeProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(expo.name, () => RootLayout);
