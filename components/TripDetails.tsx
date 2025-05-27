import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EventItem {
  name: string;
  time: Date | string | null;
}

interface TripDetailsProps {
  trip: {
    tripName: string;
    destination: string;
    departure: string;
    adults: string;
    children: string;
    departureDate: string | Date | null;
    returnDate: string | Date | null;
    budget: string;
    itinerary?: EventItem[];
  };
}

const formatDate = (date: string | Date | null) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString();
};

const formatTime = (time: string | Date | null) => {
  if (!time) return '';
  const t = typeof time === 'string' ? new Date(time) : time;
  return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const TripDetails: React.FC<TripDetailsProps> = ({ trip }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Trip Name:</Text>
      <Text style={styles.value}>{trip.tripName}</Text>
      <Text style={styles.label}>Destination:</Text>
      <Text style={styles.value}>{trip.destination}</Text>
      <Text style={styles.label}>Departure:</Text>
      <Text style={styles.value}>{trip.departure}</Text>
      <Text style={styles.label}>Adults:</Text>
      <Text style={styles.value}>{trip.adults}</Text>
      <Text style={styles.label}>Children:</Text>
      <Text style={styles.value}>{trip.children}</Text>
      <Text style={styles.label}>Departure Date:</Text>
      <Text style={styles.value}>{formatDate(trip.departureDate)}</Text>
      <Text style={styles.label}>Return Date:</Text>
      <Text style={styles.value}>{formatDate(trip.returnDate)}</Text>
      <Text style={styles.label}>Budget:</Text>
      <Text style={styles.value}>{trip.budget.charAt(0).toUpperCase() + trip.budget.slice(1)}</Text>
      <Text style={styles.label}>Itinerary:</Text>
      {trip.itinerary && trip.itinerary.length > 0 ? (
        trip.itinerary.map((event, idx) => (
          <View key={idx} style={styles.eventRow}>
            <Ionicons name="calendar-outline" size={18} color="#26c6da" style={{ marginRight: 6 }} />
            <Text style={styles.eventName}>{event.name}</Text>
            <Text style={styles.eventTime}>{formatTime(event.time)}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.value}>No events set.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 250,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 5,
    marginBottom: 24,
    shadowColor: '#26c6da',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  label: {
    fontWeight: 'bold',
    color: '#00897b',
    marginTop: 10,
    marginBottom: 2,
    fontSize: 15,
  },
  value: {
    color: '#222',
    fontSize: 16,
    marginBottom: 2,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    marginLeft: 8,
  },
  eventName: {
    color: '#222',
    fontSize: 15,
    marginRight: 8,
  },
  eventTime: {
    color: '#555',
    fontSize: 15,
  },
});

export default TripDetails; 