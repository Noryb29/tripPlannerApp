import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { TripProvider } from "../context/TripContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <TripProvider>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </TripProvider>
    </AuthProvider>
  );
}
