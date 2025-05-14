import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // default

  const[name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState('');

  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
       // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: role,
        name: name,
        phone: phone,
        address: address,
        photo: photo,
      });

      setMessage(`Account created as ${role}! You can now log in.`);
      // Clear the form after the customer creates an account
      setEmail('');
      setPassword('');
      setRole('customer');
      setName('');
      setPhone('');
      setAddress('');
      setPhoto('');
    } catch (error) {
      console.error('Signup error:', error);
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" required />
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" required />
        <input value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="Photo URL" required />
        
        <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="manager">Manager</option>
          </select>
        </label>

        <button type="submit">Sign Up</button>
      </form>
      
      {message && <p>{message}</p>}
    </div>
  );
}

export default Signup;
