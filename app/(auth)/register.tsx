import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

const PRIMARY = "#007AFF";

const Register = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const { register, loading } = useAuth();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await register(firstname, lastname, username, email, password);
      alert("Registration successful!");
      router.replace("/(auth)");
    } catch (error: unknown) {
      console.log("Registration error:", error);
      const message = error instanceof Error ? error.message : JSON.stringify(error);
      alert(message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: "https://img.icons8.com/ios-filled/100/007AFF/add-user-group-man-man.png" }}
            style={styles.logo}
          />
        </View>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput, { marginRight: 6 }]}
            placeholder="First Name"
            value={firstname}
            onChangeText={setFirstname}
            autoCapitalize="words"
            placeholderTextColor="#888"
          />
          <TextInput
            style={[styles.input, styles.halfInput, { marginLeft: 6 }]}
            placeholder="Last Name"
            value={lastname}
            onChangeText={setLastname}
            autoCapitalize="words"
            placeholderTextColor="#888"
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
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
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#888"
        />
        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: "#a0c4ff" }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
        </TouchableOpacity>
        <View style={styles.switchContainer}>
          <Text style={{ color: "#555" }}>Already have an account? </Text>
          <Link href="/(auth)" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );

}

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6fb",
    marginTop: 50,
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
  row: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 14,
  },
  halfInput: {
    flex: 1,
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
