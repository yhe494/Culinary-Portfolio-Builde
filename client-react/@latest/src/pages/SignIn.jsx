import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import './SignIn.css';

const SignIn = () => {
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5001/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ studentNumber, password }),
      });

      const data = await response.json();
      console.log('Sign-in response:', data); // Debug log

      if (response.ok) {
        if (!data.student) {
          throw new Error('No student data received');
        }

        localStorage.setItem('token', data.token);

        setUser({
          studentNumber: data.student.studentNumber,
          isAdmin: data.student.isAdmin
        });

        // Navigate based on user role
        if (data.student.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/student');
        }
      } else {
        setError(data.message || 'Sign-in failed');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      setError('An error occurred during sign-in. Please try again.');
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-form">
        <h2 className="text-center signin-title">Sign In to Your Account</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formStudentNumber" className="form-group">
            <Form.Control
              type="text"
              placeholder="Student Number"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              required
              className="form-control"
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="form-group">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </Form.Group>

          <Button type="submit" className="signin-button">
            Sign In
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;