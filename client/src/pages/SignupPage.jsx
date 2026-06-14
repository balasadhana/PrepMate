import React, { useState } from 'react';
import '../styles/SignupPage.css';
import axios from 'axios';
import { Link } from 'react-router-dom'; // 👉 for routing

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' 
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;
    if (!username || !email || !password || !confirmPassword) {
      setMessage('All fields are required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage('Enter a valid email');
      return false;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      if (response.status === 201) {
        setMessage('Signup Successful!');
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        setMessage(response.data.message || 'Signup failed');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Server error. Try again later.');
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="left-panel">
        <h1>Welcome to PrepMate</h1>
        <p>Your journey begins here. Join us today!</p>
      </div>

      <div className="right-panel">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Create Account</h2>

          <div className="input-group">
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
            <label>Username</label>
          </div>

          <div className="input-group">
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            <label>Email</label>
          </div>

          <div className="input-group">
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            <label>Password</label>
          </div>

          <div className="input-group">
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            <label>Confirm Password</label>
          </div>
          <div className="input-group">
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="user">User</option>
              <option value="admin">Admin</option>
           </select>
           <label>User Type</label>
          </div>
          <button type="submit" className="signup-btn">Sign Up</button>

          {message && <p className="message">{message}</p>}

          <p className="switch-auth">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
