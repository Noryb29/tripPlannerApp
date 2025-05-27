import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user, getUserProfile, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getUserProfile(user.uid)
        .then((data) => {
          setProfile(data);
          setPhotoURL(data?.photoURL || user.photoURL || null);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {  photoURL: photoURL || undefined });
      Alert.alert("Profile updated");
    } catch (e) {
      Alert.alert("Error", "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need media library permissions to upload your photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (user) {
        setUploading(true);
        try {
          const storage = getStorage();
          const fileName = `profile_${user.uid}_${Date.now()}`;
          const imageRef = storageRef(storage, `profileImages/${fileName}`);
          const response = await fetch(asset.uri);
          const blob = await response.blob();
          await uploadBytes(imageRef, blob);
          const downloadURL = await getDownloadURL(imageRef);
          setPhotoURL(downloadURL);
          await updateUserProfile(user.uid, { photoURL: downloadURL });
          Alert.alert("Profile image updated");
        } catch (e) {
          Alert.alert("Error", "Could not upload image");
        } finally {
          setUploading(false);
        }
      }
    }
  };

  if (!user) {
    return (
      <LinearGradient
        colors={["#E0F2F1", "#B2EBF2", "#FFECB3"]}
        style={styles.gradientBg}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Not logged in.</Text>
        </View>
      </LinearGradient>
    );
  }

  if (loading) {
    return (
      <LinearGradient
        colors={["#E0F2F1", "#B2EBF2", "#FFECB3"]}
        style={styles.gradientBg}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      >
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#00796B" />
        </View>
      </LinearGradient>
    );
  }

  const fullName = (profile?.firstname || "") + (profile?.lastname ? " " + profile.lastname : "");

  return (
    <LinearGradient
      colors={["#E0F2F1", "#B2EBF2", "#FFECB3"]}
      style={styles.gradientBg}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.userInfoBox}>
            <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper} disabled={uploading}>
              {uploading ? (
                <ActivityIndicator size="small" color="#00796B" style={styles.avatar} />
              ) : photoURL ? (
                <Image source={{ uri: photoURL }} style={styles.avatar} />
              ) : (
                <Image source={require('../../assets/images/icon.png')} style={styles.avatar} />
              )}
              <LinearGradient
                colors={['#26A69A', '#00796B']}
                style={styles.uploadButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.uploadText}>Change Photo</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.name}>{fullName || user.displayName || "No Name"}</Text>
            <Text style={styles.email}>{user.email}</Text>
            
          </View>
        </View>
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
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    minWidth: 320,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#00796B",
    marginBottom: 24,
    letterSpacing: 0.5,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  userInfoBox: {
    alignItems: 'center',
    width: '100%',
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    backgroundColor: '#e0e0e0',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  uploadButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 8,
  },
  uploadText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00796B',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  email: {
    fontSize: 17,
    color: '#00838F',
    marginBottom: 24,
    opacity: 0.9,
    letterSpacing: 0.3,
  },
  saveButton: {
    width: '100%',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonGradient: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  subtitle: {
    fontSize: 17,
    color: "#00838F",
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
});
