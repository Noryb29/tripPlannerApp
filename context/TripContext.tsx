import React, { createContext, useContext, useState } from 'react';

export interface TripData {
  tripName: string;
  destination: string;
  departure: string;
  adults: string;
  children: string;
  departureDate: Date | null;
  returnDate: Date | null;
  budget: string;
  itinerary?: { name: string; time: Date | null }[];
}

interface TripContextProps {
  tripData: TripData;
  setTripData: (data: Partial<TripData>) => void;
}

const defaultTripData: TripData = {
  tripName: '',
  destination: '',
  departure: '',
  adults: '',
  children: '',
  departureDate: null,
  returnDate: null,
  budget: '',
  itinerary: [],
};

const TripContext = createContext<TripContextProps | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tripData, setTripDataState] = useState<TripData>(defaultTripData);

  const setTripData = (data: Partial<TripData>) => {
    setTripDataState((prev) => ({ ...prev, ...data }));
  };

  return (
    <TripContext.Provider value={{ tripData, setTripData }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) throw new Error('useTrip must be used within a TripProvider');
  return context;
}; 