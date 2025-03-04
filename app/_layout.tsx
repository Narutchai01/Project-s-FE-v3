import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { AppRegistry } from "react-native";
import { PaperProvider } from "react-native-paper";
import { expo } from "@/app.json";
import { CompareProvider } from "@/context/CompareContext";
import { ReviewProvider } from "@/context/ReviewContext";

export default function RootLayout() {
  return (
    <PaperProvider>
      <AuthProvider>
        <CompareProvider>
          <ReviewProvider>
            <Stack
              screenOptions={{
                headerShadowVisible: false,
                headerShown: false,
              }}
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
              <Stack.Screen
                name="create-review"
                options={{
                  headerTitle: "Review",
                  headerShown: true,
                }}
              />
              <Stack.Screen name="thread/[id]" />
              <Stack.Screen name="reviewSkincare/[id]" />
            </Stack>
          </ReviewProvider>
        </CompareProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(expo.name, () => RootLayout);
