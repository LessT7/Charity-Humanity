// Import the functions you need from the SDKs you need
import { getApps,initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { createUserWithEmailAndPassword, sendPasswordResetEmail as resetEmail } from "firebase/auth";
// import { auth } from './firebaseConfig';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_FIREBASE_APP_ID,
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
};
console.log("API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];


export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
    
  } catch (error) {
    throw new Error(error.message);
  }
};

export const registerWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const sendPasswordResetEmail = async (email) => {
  try {
    await resetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("Sign-out successful");
  } catch (error) {
    console.error("Error signing out: ", error.message);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

