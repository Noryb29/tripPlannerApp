import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTrip } from '../../context/TripContext';

const SetTrip = () => {
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [departure, setDeparture] = useState('');
  const [adults, setAdults] = useState('');
  const [children, setChildren] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [budget, setBudget] = useState('');
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);

  const nav = useNavigation();
  const router = useRouter();
  const { setTripData } = useTrip();

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString();
  };

  useEffect(() => {
    nav.setOptions({
      headerShown: false
    });
  }, [nav]);

  const handleNext = () => {
    // Validation
    if (!tripName.trim()) return Alert.alert('Missing Field', 'Trip Name is required.');
    if (!destination.trim()) return Alert.alert('Missing Field', 'Destination is required.');
    if (!departure.trim()) return Alert.alert('Missing Field', 'Departure is required.');
    if (!adults.trim() || isNaN(Number(adults))) return Alert.alert('Invalid Field', 'Adults must be a number.');
    if (!children.trim() || isNaN(Number(children))) return Alert.alert('Invalid Field', 'Children must be a number.');
    if (!departureDate) return Alert.alert('Missing Field', 'Departure Date is required.');
    if (!returnDate) return Alert.alert('Missing Field', 'Return Date is required.');
    if (!budget) return Alert.alert('Missing Field', 'Budget is required.');
    setTripData({
      tripName,
      destination,
      departure,
      adults,
      children,
      departureDate,
      returnDate,
      budget,
    });
    router.push('/create-trip/setItinerary');
  };

  return (
    <LinearGradient
      colors={["#E0F2F1", "#B2EBF2", "#FFECB3"]}
      style={styles.gradientBg}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create a Trip</Text>
        <View style={styles.card}>
          <View style={styles.inputWrapper}>
            <Ionicons name="pricetag-outline" size={20} color="#00796B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Trip Name"
              value={tripName}
              onChangeText={setTripName}
              placeholderTextColor="#90A4AE"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons name="location-outline" size={20} color="#00796B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Destination"
              value={destination}
              onChangeText={setDestination}
              placeholderTextColor="#90A4AE"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons name="airplane-outline" size={20} color="#00796B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Departure"
              value={departure}
              onChangeText={setDeparture}
              placeholderTextColor="#90A4AE"
            />
          </View>
          <View style={styles.row}>
            <View style={[styles.inputWrapper, styles.halfInput]}>
              <Ionicons name="person-outline" size={20} color="#00796B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Adults"
                value={adults}
                onChangeText={setAdults}
                keyboardType="numeric"
                placeholderTextColor="#90A4AE"
              />
            </View>
            <View style={[styles.inputWrapper, styles.halfInput]}>
              <Ionicons name="people-outline" size={20} color="#00796B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Children"
                value={children}
                onChangeText={setChildren}
                keyboardType="numeric"
                placeholderTextColor="#90A4AE"
              />
            </View>
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons name="calendar-outline" size={20} color="#00796B" style={styles.inputIcon} />
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDeparturePicker(true)}>
              <Text style={[styles.dateButtonText, !departureDate && styles.placeholderText]}>
                {departureDate ? formatDate(departureDate) : 'Select Departure Date'}
              </Text>
            </TouchableOpacity>
          </View>
          {showDeparturePicker && (
            <DateTimePicker
              value={departureDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, date) => {
                setShowDeparturePicker(false);
                if (date) setDepartureDate(date);
              }}
            />
          )}
          <View style={styles.inputWrapper}>
            <Ionicons name="calendar-outline" size={20} color="#00796B" style={styles.inputIcon} />
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowReturnPicker(true)}>
              <Text style={[styles.dateButtonText, !returnDate && styles.placeholderText]}>
                {returnDate ? formatDate(returnDate) : 'Select Return Date'}
              </Text>
            </TouchableOpacity>
          </View>
          {showReturnPicker && (
            <DateTimePicker
              value={returnDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, date) => {
                setShowReturnPicker(false);
                if (date) setReturnDate(date);
              }}
            />
          )}
          <View style={styles.inputWrapper}>
            <Ionicons name="wallet-outline" size={20} color="#00796B" style={styles.inputIcon} />
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={budget}
                onValueChange={(value) => setBudget(value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Budget" value="" color="#90A4AE" />
                <Picker.Item label="Low" value="low" color="#00796B" />
                <Picker.Item label="Medium" value="medium" color="#00796B" />
                <Picker.Item label="High" value="high" color="#00796B" />
              </Picker>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <LinearGradient
              colors={['#26A69A', '#00796B']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.nextButtonText}>Next</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => nav.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SetTrip;

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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  inputWrapper: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
  dateButton: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#00796B',
  },
  placeholderText: {
    color: '#90A4AE',
  },
  pickerWrapper: {
    flex: 1,
  },
  picker: {
    color: '#00796B',
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