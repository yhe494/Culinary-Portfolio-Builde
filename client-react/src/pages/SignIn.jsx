import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import './SignIn.css';

const AuthPage = () => {
  const [registerData, setRegisterData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    phoneNumber: ''
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('http://localhost:5001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });
      
      const data = await response.json();
      if (response.ok) {
        alert('Registration successful! Please log in.');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration. Please try again.');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('http://localhost:5001/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });
      
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser({ email: data.user.email, isAdmin: data.user.isAdmin });
        navigate(data.user.isAdmin ? '/admin' : '/student');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* Register Form */}
        <div className="register-section">
          <h2 className="text-center">Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleRegisterSubmit}>
            <Form.Group>
              <Form.Control type="email" name="email" placeholder="Email" onChange={handleRegisterChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Control type="text" name="firstName" placeholder="First Name" onChange={handleRegisterChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Control type="text" name="lastName" placeholder="Last Name" onChange={handleRegisterChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Control type="password" name="password" placeholder="Password" onChange={handleRegisterChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Control type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleRegisterChange} required />
            </Form.Group>
            <Button type="submit">Register</Button>
          </Form>
        </div>

        {/* Login Form */}
        <div className="login-section">
          <h2 className="text-center">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group>
              <Form.Control type="email" name="email" placeholder="Email" onChange={handleLoginChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Control type="password" name="password" placeholder="Password" onChange={handleLoginChange} required />
            </Form.Group>
            <Button type="submit">Login</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
