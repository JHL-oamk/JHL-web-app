// Firebase core
import { initializeApp } from "firebase/app";

// ✅ ADD THIS
import { getAuth } from "firebase/auth";

// (optional) analytics
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCaIOtFk94o6leJMcDAk36AwyxJSgh7tSw",
  authDomain: "jhl-project-4ff62.firebaseapp.com",
  projectId: "jhl-project-4ff62",
  storageBucket: "jhl-project-4ff62.firebasestorage.app",
  messagingSenderId: "10884597170",
  appId: "1:10884597170:web:b8f2b3a077e67ea9ee50ab",
  measurementId: "G-QZGFL6J8D2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ THIS LINE FIXES YOUR ERROR
export const auth = getAuth(app);

// (optional)
export const analytics = getAnalytics(app);