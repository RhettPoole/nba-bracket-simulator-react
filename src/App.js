import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import CustomerForm from './CustomerForm';
import CustomerList from './CustomerList';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="App">
        <h1>Customer Portal</h1>

        {!user ? (
          <>
            <Routes>
              <Route path="/" element={<Login onLogin={setUser} />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </>
***REMOVED*** : (
          <>
            <p>Welcome, {user.email}</p>
            <CustomerForm onAdd={() => {}} />
            <CustomerList customers={[]} />
          </>
***REMOVED***}
      </div>
    </Router>
  );
}

export default App;
