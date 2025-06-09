import React, { useState, useEffect } from 'react';
import '../styles/CustomerForm.css';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

function CustomerForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    photo: ''
  });

  // Fetch user data on load
  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.warn("User not logged in.");
        return;
      }

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
          photo: data.photo || ''
        });
      } else {
        console.warn("No user data found.");
      }
    };

    fetchUserData();
  }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
  e.preventDefault();

  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    alert("User not logged in.");
    return;
  }

  const userRef = doc(db, "users", currentUser.uid);
  const updatedData = {
    name: formData.name,
    phone: formData.phone,
    address: formData.address,
    photo: formData.photo
  };

  console.log("Attempting to update user:", currentUser.uid);
  console.log("With data:", updatedData);

  try {
    await updateDoc(userRef, updatedData);
    alert("User info updated successfully!");
  } catch (err) {
    console.error("Error updating user:", err.message);
    alert("Failed to update user.");
  }
}

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <input
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        required
      />
      <input
        name="photo"
        placeholder="Photo URL"
        value={formData.photo}
        onChange={handleChange}
        required
      />
      <button type="submit">Save User Info</button>
    </form>
  );
}

export default CustomerForm;