'use client';

import React, { useState } from 'react';
// import { useRouter } from 'next/router'; // Uncomment if you want to use useRouter for redirect
// import styles from './page.module.css'; // Ensure this file exists and is properly referenced

const Login = () => {
  // const router = useRouter(); // Uncomment if you want to use useRouter for redirect
  const [username, setUsername] = useState('');
  const [cookie, setCookie] = useState('no cookies');
  const [password, setPassword] = useState('');
  const [submit, setSubmit] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiURL = '/api/proxy'; // Use the proxy API route

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, submit }),
    };

    try {
      const response = await fetch(apiURL, options);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Network response was not ok: ${response.statusText} - ${errorData}`);
      }

      const result = await response.json();
      setCookie(result.cookies);

    } catch (error) {
      console.error('Error during authentication:', error);
      setError(`Authentication failed: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>{cookie}</p>
    </div>
  );
};

export default Login;
