'use client';

import React, { useState } from 'react';
// import { useRouter } from 'next/router'; // Uncomment if you want to use useRouter for redirect
// import styles from './page.module.css'; // Ensure this file exists and is properly referenced
import axios from 'axios';
const Login = () => {
  // const router = useRouter(); // Uncomment if you want to use useRouter for redirect
  const [username, setUsername] = useState('');
  const [cookie, setCookie] = useState('no cookies');
  const [password, setPassword] = useState('');
  const [submit, setSubmit] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiURL = 'http://serviceease.techser.com/live/index.php/login';

    const options = {
      // method: 'POST',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
      //   'host':'serviceease.techser.com',
        'Origin': 'http://serviceease.techser.com',
        'Referer': 'http://serviceease.techser.com/live/',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
      },
      body: new URLSearchParams({
        'username': username,
        'password': password,
        'submit': submit,
      })
    };
  
    try {
      const response = await axios.post(apiURL, options);
      console.log("respo:"+ response);
      // if (!response.ok) {
      //   const errorData = await response.error();
      //   throw new Error(`Network response was not ok: ${response.statusText} - ${errorData}`);
      // }
  
      const cookies = response.headers.get('set-cookie');
      console.log("cookies: "+ cookies);
      
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
