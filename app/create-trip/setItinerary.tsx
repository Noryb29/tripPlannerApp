import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTrip } from '../../context/TripContext';

interface EventItem {
  name: string;
  time: Date | null;
}

const SetItinerary = () => {
  const { setTripData } = useTrip();
  const nav = useNavigation();
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([{ name: '', time: null }]);
  const [showPickerIndex, setShowPickerIndex] = useState<number | null>(null);

  const handleEventChange = (index: number, field: 'name' | 'time', value: any) => {
    setEvents((prev) => prev.map((ev, i) => i === index ? { ...ev, [field]: value } : ev));
  };

  const addEvent = () => setEvents((prev) => [...prev, { name: '', time: null }]);
  const removeEvent = (index: number) => setEvents((prev) => prev.filter((_, i) => i !== index));

  const handleNext = () => {
    // Validation
    if (!events.length) return Alert.alert('Missing Field', 'At least one event is required.');
    for (const [i, event] of events.entries()) {
      if (!event.name.trim()) return Alert.alert('Missing Field', `Event #${i + 1} name is required.`);
      if (!event.time) return Alert.alert('Missing Field', `Event #${i + 1} time is required.`);
    }
    setTripData({ itinerary: events });
    router.push('/create-trip/confirmTrip');
  };

  useEffect(() => {
    nav.setOptions({
      headerShown: false
    });
  }, [nav]);

  return (
    <LinearGradient
      colors={["#E0F2F1", "#B2EBF2", "#FFECB3"]}
      style={styles.gradientBg}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Set Your Itinerary</Text>
        <View style={styles.card}>
          {events.map((event, idx) => (
            <View key={idx} style={styles.eventBox}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventNumber}>Event {idx + 1}</Text>
                <TouchableOpacity 
                  style={styles.removeButton} 
                  onPress={() => removeEvent(idx)} 
                  disabled={events.length === 1}
                >
                  <Ionicons 
                    name="remove-circle" 
                    size={24} 
                    color={events.length === 1 ? '#B0BEC5' : '#EF5350'} 
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <Ionicons name="calendar-outline" size={20} color="#00796B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Event Name"
                  value={event.name}
                  onChangeText={text => handleEventChange(idx, 'name', text)}
                  placeholderTextColor="#90A4AE"
                />
              </View>
              <TouchableOpacity 
                style={styles.timeButton} 
                onPress={() => setShowPickerIndex(idx)}
              >
                <Ionicons name="time-outline" size={20} color="#00796B" style={styles.inputIcon} />
                <Text style={[styles.timeButtonText, !event.time && styles.placeholderText]}>
                  {event.time ? event.time.toLocaleTimeString() : 'Set Time'}
                </Text>
              </TouchableOpacity>
              {showPickerIndex === idx && (
                <DateTimePicker
                  value={event.time || new Date()}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(_, date) => {
                    setShowPickerIndex(null);
                    if (date) handleEventChange(idx, 'time', date);
                  }}
                />
              )}
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={addEvent}>
            <LinearGradient
              colors={['#B2EBF2', '#80DEEA']}
              style={styles.addButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="add" size={24} color="#00796B" />
              <Text style={styles.addButtonText}>Add Event</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <LinearGradient
              colors={['#26A69A', '#00796B']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.nextButtonText}>Review Trip</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
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

export default SetItinerary;

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
  eventBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00796B',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    fontSize: 16,
    color: '#00796B',
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  timeButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#00796B',
    paddingVertical: 12,
    paddingRight: 12,
  },
  placeholderText: {
    color: '#90A4AE',
  },
  addButton: {
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#00796B',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    marginTop: 24,
    gap: 12,
  },
  nextButton: {
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
  nextButtonText: {
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
