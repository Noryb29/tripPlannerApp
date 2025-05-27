JUST RUN NPM INSTALL AND AUTOMATICALY CONFIGURES FOR U

CHECK .ENV.EXAMPLE FOR CONFIG SETTINGS

DONT FORGET TO INCLUDE METRO CONFIG.JS

const {getDefaultConfig} = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("cjs");
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
    
IN ORDER FOR EXPORTS TO PROPERLY BE CALLED


OR U CAN USE

import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEU",
  authDomain: "YOUR_AUTH_DOM",
  projectId: "PROJ_ID",
  storageBucket: "STORAGE_BUCK",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR APP ID",
  databaseURL:"YOUR URL"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const realtimeDb = getDatabase(app);

export { auth, db, realtimeDb };


