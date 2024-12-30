// Import Firebase SDKs
import { getApps, initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail as resetEmail 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  setDoc 
} from "firebase/firestore";
// import { createJWT } from "./jwt";

// Firebase Config from Environment Variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log("API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

const db = getFirestore(app);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // const token = createJWT({
    //   uid: user.uid,
    //   email: user.email
    // });
    const userRef = doc(db, "users", user.uid); console.log(user);
    await setDoc(
      userRef,
      {
        email: user.email,
        // password: user.password,
        uid: user.uid,
        lastLoginAt: new Date().toISOString(),
      },
      { merge: true }
    );
    // gausah ya bang

    // localStorage.setItem("token", token);
    // alert("Login berhasil!");

    return { user }; // tambahkan token
  } catch (error) {
    throw new Error(error.message);
  }
};

export const registerWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { uid } = userCredential.user;

    await setDoc(doc(db, "users", uid), {
      email: email,
      password: password,
      createdAt: new Date().toISOString(),
    });

    // const token = createJWT({
    //   uid: uid,
    //   email: email
    // });

    return { user: userCredential.user }; // tambahkan token
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

    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        email: user.email,
        uid: user.uid,
        displayName: user.displayName || "",
        lastLoginAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const addData = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getData = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateData = async (collectionName, id, data) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteData = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchEvents = async () => {
  const response = await fetch("/api");
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return response.json();
};


export  { app, db };
