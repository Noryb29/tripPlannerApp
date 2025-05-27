import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAf9H-FrSMPShskrTIurVU7_p2t8LnYI9I",
  authDomain: "flight-booking-39fc9.firebaseapp.com",
  projectId: "flight-booking-39fc9",
  storageBucket: "flight-booking-39fc9.firebasestorage.app",
  messagingSenderId: "889920253212",
  appId: "1:889920253212:web:98833c12f44ea0b9271ed9",
  databaseURL:"https://flight-booking-39fc9-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const realtimeDb = getDatabase(app);

export { auth, db, realtimeDb };

