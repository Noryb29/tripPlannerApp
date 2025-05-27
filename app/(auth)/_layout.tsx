import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function AuthLayout() {
  return <Tabs>
    <Tabs.Screen name="index" options={{
      title: "Login",
      headerShown: false,
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="log-in-outline" size={size} color={color} />
      ),
    }}/>
    <Tabs.Screen name="register" options={{
      title: "Register",
      headerShown: false,
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="person-add-outline" size={size} color={color} />
      ),
    }}/>
  </Tabs>
}
