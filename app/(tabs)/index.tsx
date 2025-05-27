import { LinearGradient } from 'expo-linear-gradient';
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <LinearGradient
      colors={["#E0F2F1", "#B2EBF2", "#FFECB3"]}
      style={styles.gradientBg}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={{ 
            width: 100, 
            height: 100, 
            marginBottom: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
          }}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to Travelista!</Text>
        <Text style={styles.subtitle}>Plan your favorite trips with ease.</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#00796B",
    marginBottom: 16,
    letterSpacing: 0.5,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 20,
    color: "#00838F",
    marginBottom: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    textAlign: 'center',
    opacity: 0.9,
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
