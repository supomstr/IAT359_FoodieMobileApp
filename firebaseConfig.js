// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjX_Tn-Xfepa7LdUEMD9PzG5h9K0ifSOw",
  authDomain: "iat359-finalprojecttesting.firebaseapp.com",
  projectId: "iat359-finalprojecttesting",
  storageBucket: "iat359-finalprojecttesting.firebasestorage.app",
  messagingSenderId: "605542330105",
  appId: "1:605542330105:web:7bf2ce5fbe4c52edec3c28"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

export { auth, db };