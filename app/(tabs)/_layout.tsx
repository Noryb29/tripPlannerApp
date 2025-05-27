import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";
import React from "react";


export default function TabsLayout() {
  return <Tabs>
    <Tabs.Screen name="index" options={{
      title: "Home",
      headerShown: false,
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="home-outline" size={size} color={color} />
        
      ),
    }}/>
    <Tabs.Screen name="trips" options={{
            title: "Trips",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
        <Ionicons name="airplane-outline" size={size} color={color} />
            ),
        }
    }/>
    
    <Tabs.Screen name="profile" options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
        <Ionicons name="person-outline" size={size} color={color} />
            ),
        }
    }/>
  </Tabs>
}
