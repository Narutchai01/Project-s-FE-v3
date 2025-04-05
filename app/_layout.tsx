import { Stack, useRouter } from "expo-router";
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
                  headerShadowVisible: false,
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="diary/[id]"
                options={{
                  headerTitle: "Result Analysis",
                  headerShadowVisible: false,
                  headerShown: false,
                }}
              />
              <Stack.Screen name="thread/[id]" />
              <Stack.Screen name="review/[id]" />
              <Stack.Screen name="ListPopularSkincare" />
              <Stack.Screen name="setting" />
              <Stack.Screen name="editProfile" />
              <Stack.Screen name="changePassword" />
              <Stack.Screen name="forgotPassword" />
              <Stack.Screen name="checkEmail" />
              <Stack.Screen name="recoverPassword" />
              <Stack.Screen name="profile/[id]" />
              <Stack.Screen name="editReview/[id]" />
              <Stack.Screen name="editThread/[id]" />
            </Stack>
          </ReviewProvider>
        </CompareProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(expo.name, () => RootLayout);
