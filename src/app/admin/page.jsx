"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../services/firebase";
import { signOutUser } from "../../../services/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const AdminPage = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({ id: "", email: "", password: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const saveUserToFirestore = async (user) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        uid: user.uid,
      });
      console.log("User saved to Firestore:", user.email);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };
  
  const syncCurrentUserToFirestore = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      await saveUserToFirestore(user);
    } else {
      console.log("No user is currently signed in.");
    }
  };
  
  useEffect(() => {
    syncCurrentUserToFirestore();
  }, []);

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const fetchedData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setData(fetchedData);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    fetchData();

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddData = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "users"), {
        email: formData.email,
        password: formData.password,
      });
      console.log("Document written with ID: ", docRef.id);
      fetchData();
      setFormData({ id: "", email: "", password: "" });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleEditData = (id) => {
    const itemToEdit = data.find((item) => item.id === id);
    setFormData({
      id: itemToEdit.id,
      email: itemToEdit.email || "",
      password: itemToEdit.password || "",
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    try {
      const docRef = doc(db, "users", formData.id);
      await updateDoc(docRef, {
        email: formData.email,
        password: formData.password,
      });
      console.log("Document updated with ID: ", formData.id);
      fetchData();
      setFormData({ id: "", email: "", password: "" });
      setIsEditing(false);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const handleDeleteData = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (confirmed) {
      try {
        const docRef = doc(db, "users", id);
        await deleteDoc(docRef);
        console.log("Document deleted with ID: ", id);
        fetchData();
      } catch (e) {
        console.error("Error deleting document: ", e);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      console.log("User signed out successfully");
      window.location.href = "/";
    } catch (e) {
      console.error("Error signing out: ", e);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Page</h1>

      {currentUser && (
        <div className="mb-4">
          <p>Welcome, <strong>{currentUser.email}</strong></p>
        </div>
      )}

      <button
        onClick={handleSignOut}
        className="bg-red-500 text-white py-2 px-4 rounded mb-4 hover:bg-red-600"
      >
        Sign Out
      </button>

      <form onSubmit={isEditing ? handleSaveEdit : handleAddData} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {isEditing ? "Save Changes" : "Add User"}
        </button>
      </form>

      {data.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Password</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-300 p-2">{item.id}</td>
                <td className="border border-gray-300 p-2">{item.email}</td>
                <td className="border border-gray-300 p-2">{item.password}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleEditData(item.id)}
                    className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteData(item.id)}
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default AdminPage;
