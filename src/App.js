// Top Level Component, Controls routing and login state as well as ligin/signup pages for rendering
// This file is the main entry point / layout for the app. This is the perfect place to maintain a global state like "user" or who's logged in.

// THINGS THAT NEED TO BE DONE:
// Eventually need to move routing into a Routes.js file, to keep App.js clean and organized.
// Need to add a NavBar or Header for users to logout and navigate.
// Need to use "useEffect" to fetch customer data for the logged in user, currently all you can do is login. Will implement when integrating Firestore further.

//Import React and React Router
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Components that our App is using.
import Signup from './Signup';
import Login from './Login';
import CustomerForm from './CustomerForm';
import CustomerList from './CustomerList';
import './styles/App.css';

// 'user' holds the current authenticated user's object
// 'setUser' is called from Login when login is successful
// Initially set to null, no user is logged in.
function App() {
  const [user, setUser] = useState(null);

  // Wraps everything in a Router component for navigation
  // Displays the header text.
  return (
    <Router>
      <div className="App">
        <h1>Customer Portal</h1>

        // '!user?' (not logged in) shows login and signup components.
        {!user ? (
          <>
            <Routes>
              <Route path="/" element={<Login onLogin={setUser} />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </>
***REMOVED***
        // If user is logged in, shows a welcome message + CustomerFrom and CustomerList
        : (
          <>
          // If user is logged in, shows a welcome message + CustomerFrom and CustomerList
            <p>Welcome, {user.email}</p>
            // 'onAdd' is empty, placeholder for adding customers to Firestore
            <CustomerForm onAdd={() => {}} />
            // 'customers' is empty, placeholder for displaying customers from Firestore
            <CustomerList customers= {[]} />
          </>
***REMOVED***}
      </div>
    </Router>
  );
}

export default App;
