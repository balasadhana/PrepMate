import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      // ✅ Debugging log to check API response structure
      console.log('Login Response:', res.data);

      // ✅ Store token in localStorage
      localStorage.setItem('token', res.data.token);

      // ✅ Ensure role and user data exist
      if (res.data.role && res.data.user) {
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('username', res.data.user.username);
        localStorage.setItem('email', res.data.user.email || email); // Store email from user data or form
      } else {
        console.error('Role or user info missing in response');
      }

      setMessage('Login successful!');
      setIsSuccess(true);

      // ✅ Redirect user based on role (Corrected URL paths to use hyphens)
      setTimeout(() => {
        if (res.data.role === 'admin') {
          navigate('/admin-dashboard');  // ✅ Changed from '/admin/dashboard' to '/admin-dashboard'
        } else {
          navigate('/user/dashboard');   // ✅ Changed from '/User dashboard' to '/user-dashboard'
        }
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed. Try again.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Left Panel */}
      <div className="left-panel">
        <h1>Welcome Back!</h1>
        <p>Log in to your account and continue your journey.</p>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <form className="signup-form" onSubmit={handleLogin}>
          <h2>Login</h2>

          <div className="input-group">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>

          <button type="submit" className="signup-btn">Login</button>

          {/* ✅ Show success or error message */}
          {message && (
            <div className={`message ${isSuccess ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <p className="redirect-text">
            Don’t have an account? <Link to="/signup">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
