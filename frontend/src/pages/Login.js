import React, { useState } from "react";
import "../css/login.css";
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {

    const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'Admin' && password === '123') {
      setError(''); // Clear the error message
      alert('Login successful');
      navigate('/faultalarm');

      // Redirect or show a different page
    } else {
      setError('Invalid credentials');
    }
  };

  
  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
    setError(''); // Clear the error message when user types
  };

  return (
    <div className="background">
      <div className="login-container">
      <h2><b>Fault Alarm Visualization System</b></h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;