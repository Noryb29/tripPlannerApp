import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { ref as dbRef, onValue } from "firebase/database";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TripDetails from "../../components/TripDetails";
import { useAuth } from "../../context/AuthContext";
import { realtimeDb } from "../../firebaseConfig";

export default function Trips() {
  const router = useRouter();
  const { user } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!user) return;
    const tripsRef = dbRef(realtimeDb, `users/${user.uid}/trips`);
    const unsubscribe = onValue(tripsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTrips(Object.values(data));
      } else {
        setTrips([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleTripPress = (trip: any) => {
    setSelectedTrip(trip);
    setModalVisible(true);
  };

  return (
    <LinearGradient
      colors={["#E0F2F1", "#B2EBF2", "#FFECB3"]}
      style={styles.gradientBg}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.myTrips}>My Trips</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#00796B" style={{ marginTop: 30 }} />
        ) : trips.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="airplane-outline" size={64} color="#00796B" style={{ marginBottom: 16 }} />
            <Text style={styles.subtitle}>No trips found. Start by adding a new trip!</Text>
          </View>
        ) : (
          <FlatList
            data={trips}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleTripPress(item)}
                style={styles.tripCard}
                activeOpacity={0.7}
              >
                <View style={styles.tripCardContent}>
                  <Text style={styles.tripName}>{item.tripName}</Text>
                  <Text style={styles.tripDestination}>{item.destination}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#00796B" />
              </TouchableOpacity>
            )}
            style={{ width: '100%' }}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('../create-trip/setTrip')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#26A69A', '#00796B']}
            style={styles.fabGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="add" size={32} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)} />
          <View style={styles.modalContentWrapper}>
            <TripDetails trip={selectedTrip} />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
    alignItems: "center",
    padding: 16,
    paddingTop: 60,
  },
  myTrips: {
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
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  listContainer: {
    alignItems: 'stretch',
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 8,
  },
  tripCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tripCardContent: {
    flex: 1,
  },
  tripName: {
    fontSize: 18,
    color: '#00796B',
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  tripDestination: {
    fontSize: 14,
    color: '#00838F',
    fontWeight: '500',
    opacity: 0.8,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContentWrapper: {
    position: 'absolute',
    top: '15%',
    left: '5%',
    right: '5%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  closeButton: {
    backgroundColor: '#00796B',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
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
