import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

const PRIMARY = "#007AFF";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.push("./(tabs)");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : JSON.stringify(error);
      alert(message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        {/* Logo/Icon Placeholder */}
        <View style={styles.logoContainer}>
          <Image source={{ uri: "https://img.icons8.com/ios-filled/100/007AFF/user-male-circle.png" }} style={styles.logo} />
        </View>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account</Text>
        <TextInput
          style={styles.input}
          placeholder="testx@gmail.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Loading..." : "Login"}</Text>
        </TouchableOpacity>
        <View style={styles.switchContainer}>
          <Text style={{ color: "#555" }}>Don't have an account? </Text>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6fb",
  },
  card: {
    width: 320,
    padding: 28,
    borderRadius: 18,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 18,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#888",
    marginBottom: 22,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: "#222",
  },
  button: {
    width: "100%",
    backgroundColor: PRIMARY,
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
  },
  link: {
    color: PRIMARY,
    fontWeight: "bold",
  },
});
