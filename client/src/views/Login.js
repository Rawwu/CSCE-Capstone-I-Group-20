import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from 'aws-amplify/auth';
import "../styles/login.css"

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signIn({ username: email, password });
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      setError('Failed to login: ' + err.message);
    }
  };

  return (
    <div className='login-wrapper'>
      <div className='login-card'>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-div">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-div">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-login">Login</button>
        {/* Add Forgot Password Link */}
        <p>
          <a href="#" onClick={() => navigate('/forgot-password')}>
            Forgot password?
          </a>
        </p>
      </form>
      </div>
    </div>
  );
}

export default Login;