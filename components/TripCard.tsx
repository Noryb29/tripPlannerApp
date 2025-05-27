import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TripCardProps {
  trip: {
    tripName: string;
    destination: string;
    departureDate: string | Date | null;
    returnDate: string | Date | null;
  };
  onPress?: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.card}>
        <Text style={styles.tripName}>{trip.tripName}</Text>
        <Text style={styles.tripDest}>{trip.destination}</Text>
        <Text style={styles.tripDates}>
          {trip.departureDate ? new Date(trip.departureDate).toLocaleDateString() : ''} - {trip.returnDate ? new Date(trip.returnDate).toLocaleDateString() : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '50%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 5,
    marginBottom: 16,
    shadowColor: '#26c6da',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'flex-start',
  },
  tripName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#00897b',
    marginBottom: 4,
  },
  tripDest: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 2,
  },
  tripDates: {
    fontSize: 15,
    color: '#555',
  },
});

export default TripCard;
