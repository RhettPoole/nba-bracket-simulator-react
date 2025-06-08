// Top Level Component, Controls routing and login state as well as ligin/signup pages for rendering
// This file is the main entry point / layout for the app. This is the perfect place to maintain a global state like "user" or who's logged in.

// THINGS THAT NEED TO BE DONE:
// Eventually need to move routing into a Routes.js file, to keep App.js clean and organized.
// Need to add a NavBar or Header for users to logout and navigate.
// Need to use "useEffect" to fetch customer data for the logged in user, currently all you can do is login. Will implement when integrating Firestore further.

//Import React and React Router
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

// Import Components that our App is using.
import { db } from "../firebase";
import Signup from "./Signup";
import Login from "./Login";
import CustomerForm from "./CustomerForm";
import CustomerList from "./CustomerList";
import Bracket from "./Bracket";
import "../styles/App.css";
import Header from "../components/Header";

// 'user' holds the current authenticated user's object
// 'setUser' is called from Login when login is successful
// Initially set to null, no user is logged in.
function App() {
  const [user, setUser] = useState(null); // Authenticated Firebase User Object
  const [userData, setUserData] = useState(null); // Full user profile from Firestore

  // After logging in, it will fetch Firestore profile data using UID
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          // Tells the app where we're getting the data from
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef); // Await the getDoc call
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.error("No such user in Firestore!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Simple logout handler
  const handleLogout = () => {
    setUser(null);
    setUserData(null);
    // Add Firebase signOut here if using Firebase Auth
    // Example: import { getAuth, signOut } from "firebase/auth";
    // signOut(getAuth());
  };

  // Place Header outside of Routes so it always shows
  return (
    <Router>
      <div className="App">
        <Header user={user} onLogout={handleLogout} />

        {!user ? (
          <Routes>
            <Route path="/" element={<Login onLogin={setUser} />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        ) : (
          <>
            <CustomerForm onAdd={() => {}} />
            <CustomerList customers={[]} />
            <div className="App">
              <Bracket />
            </div>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;