import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import { push, ref, set } from 'firebase/database';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTrip } from '../../context/TripContext';
import { db, realtimeDb } from '../../firebaseConfig';

const ConfirmTrip = () => {
  const { tripData } = useTrip();
  const { user } = useAuth();

  const nav = useNavigation();
  const router = useRouter();

  useEffect(() => {
    nav.setOptions({
      headerShown:false
    });
  }, [nav]);

  const handleConfirm = async () => {
  // Validation
  if (!tripData.tripName.trim()) return Alert.alert('Missing Field', 'Trip Name is required.');
  if (!tripData.destination.trim()) return Alert.alert('Missing Field', 'Destination is required.');
  if (!tripData.departure.trim()) return Alert.alert('Missing Field', 'Departure is required.');
  if (!tripData.adults.trim() || isNaN(Number(tripData.adults))) return Alert.alert('Invalid Field', 'Adults must be a number.');
  if (!tripData.children.trim() || isNaN(Number(tripData.children))) return Alert.alert('Invalid Field', 'Children must be a number.');
  if (!tripData.departureDate) return Alert.alert('Missing Field', 'Departure Date is required.');
  if (!tripData.returnDate) return Alert.alert('Missing Field', 'Return Date is required.');
  if (!tripData.budget) return Alert.alert('Missing Field', 'Budget is required.');
  if (!tripData.itinerary || tripData.itinerary.length === 0) return Alert.alert('Missing Field', 'At least one itinerary event is required.');
  for (const [i, event] of (tripData.itinerary || []).entries()) {
    if (!event.name.trim()) return Alert.alert('Missing Field', `Event #${i + 1} name is required.`);
    if (!event.time) return Alert.alert('Missing Field', `Event #${i + 1} time is required.`);
  }

  if (!user) return Alert.alert('Error', 'You must be logged in to save a trip.');

  try {
    // Create a new reference and get the key
    const newTripRef = push(ref(realtimeDb, `users/${user.uid}/trips`));
    const tripId = newTripRef.key;

    const tripPayload = normalizeTripForSaving(tripData,user.uid);

    // Save to Realtime Database at users/{uid}/trips/{tripId}
    await set(newTripRef, tripPayload);

    // Save to Firestore at users/{uid}/trips/{tripId}
    await setDoc(doc(db, `users/${user.uid}/trips/${tripId}`), tripPayload);

    Alert.alert('Success', 'Trip confirmed and saved!');
    router.push('/(tabs)/trips');
  } catch (e) {
    Alert.alert('Error', 'Could not save trip.');
  }
  
};

const normalizeTripForSaving = (trip: typeof tripData, userId: string) => {
  return {
    tripName: trip.tripName,
    destination: trip.destination,
    departure: trip.departure,
    adults: Number(trip.adults),
    children: Number(trip.children),
    budget: trip.budget.charAt(0).toUpperCase() + trip.budget.slice(1).toLowerCase(),
    departureDate: trip.departureDate ? new Date(trip.departureDate).toISOString() : null,
    returnDate: trip.returnDate ? new Date(trip.returnDate).toISOString() : null,
    itinerary: trip.itinerary || [],
    created_at: new Date().toISOString(),
    status: 'upcoming',
    userId: userId,
  };
};

  return (
    <LinearGradient
      colors={["#E0F2F1", "#B2EBF2", "#FFECB3"]}
      style={styles.gradientBg}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Review Your Trip</Text>
        <View style={styles.card}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={24} color="#00796B" />
              <Text style={styles.sectionTitle}>Trip Details</Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Trip Name</Text>
              <Text style={styles.value}>{tripData.tripName}</Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Destination</Text>
              <Text style={styles.value}>{tripData.destination}</Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Departure From</Text>
              <Text style={styles.value}>{tripData.departure}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="people" size={24} color="#00796B" />
              <Text style={styles.sectionTitle}>Travelers</Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Adults</Text>
              <Text style={styles.value}>{tripData.adults}</Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Children</Text>
              <Text style={styles.value}>{tripData.children}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar" size={24} color="#00796B" />
              <Text style={styles.sectionTitle}>Dates</Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Departure</Text>
              <Text style={styles.value}>
                {tripData.departureDate ? new Date(tripData.departureDate).toLocaleDateString() : ''}
              </Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Return</Text>
              <Text style={styles.value}>
                {tripData.returnDate ? new Date(tripData.returnDate).toLocaleDateString() : ''}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="wallet" size={24} color="#00796B" />
              <Text style={styles.sectionTitle}>Budget</Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.value}>
                {tripData.budget.charAt(0).toUpperCase() + tripData.budget.slice(1)}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list" size={24} color="#00796B" />
              <Text style={styles.sectionTitle}>Itinerary</Text>
            </View>
            {tripData.itinerary && tripData.itinerary.length > 0 ? (
              tripData.itinerary.map((event, idx) => (
                <View key={idx} style={styles.eventRow}>
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventName}>{event.name}</Text>
                    <Text style={styles.eventTime}>
                      {event.time ? new Date(event.time).toLocaleTimeString() : ''}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noEvents}>No events set.</Text>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <LinearGradient
              colors={['#26A69A', '#00796B']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.confirmButtonText}>Confirm Trip</Text>
              <Ionicons name="checkmark" size={24} color="#fff" style={{ marginLeft: 8 }} />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => nav.goBack()}>
            <Text style={styles.cancelButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ConfirmTrip;

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
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
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  section: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00796B',
    letterSpacing: 0.5,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#78909C',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: '#00796B',
    fontWeight: '500',
  },
  eventRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  eventInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventName: {
    fontSize: 16,
    color: '#00796B',
    fontWeight: '500',
  },
  eventTime: {
    fontSize: 14,
    color: '#78909C',
  },
  noEvents: {
    fontSize: 16,
    color: '#78909C',
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    marginTop: 24,
    gap: 12,
  },
  confirmButton: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  cancelButtonText: {
    color: '#00796B',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
