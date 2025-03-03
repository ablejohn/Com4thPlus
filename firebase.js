// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; // Add Storage

const firebaseConfig = {
  apiKey: "AIzaSyA-tCW9EXSE0hxy075uyvutWIhyg12-DzQ",
  authDomain: "propertyapp-d6591.firebaseapp.com",
  projectId: "propertyapp-d6591",
  storageBucket: "propertyapp-d6591.firebasestorage.app",
  messagingSenderId: "130689397634",
  appId: "1:130689397634:web:e82ea42231046d8c79d59b",
  measurementId: "G-6YTB0Q1HFV",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Firestore and Storage
export const db = getFirestore(app);
export const storage = getStorage(app);

export { app, analytics };
