import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);  // Pass the user object to parent
    } catch (error) {
      setError('Invalid login credentials.');
    }
  };

  return (
    <div className="login-form">
      <h2>Log In</h2>
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Log In</button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}

export default Login;
