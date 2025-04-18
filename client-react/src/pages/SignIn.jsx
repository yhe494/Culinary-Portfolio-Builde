import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { signin, register } from '../api/api';
import "./Signin.css";
import chefIcon from "../assets/chef.png";

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [registerData, setRegisterData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    phoneNumber: '',
    isAdmin: false,
  });
  
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await signin({ email, password });
      
      localStorage.setItem('token', data.token);
      setUser(data.user);
      //setUser({ email: data.user.email, isAdmin: data.user.isAdmin });
      navigate(data.user.isAdmin ? '/admin' : '/recipes');
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Sign-in failed. Please check your credentials.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await register(registerData);
      alert('Registration successful. Please sign in.');
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-container">
      {/* Title Section */}
      <div className="app-title-container">
        <img src={chefIcon} alt="Chef Icon" className="app-icon" />
        <h1 className="app-title">Culinary Portfolio Builder</h1>
      </div>
      <p className="app-subtitle">Showcase Your Culinary Journey</p>
  
      {/* Forms Aligned in One Row */}
      <div className="auth-forms-container">
        {/* Register Form */}
        <div className="auth-form">
          <h2 className="text-center">Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleRegister}>
            <Form.Group controlId="registerEmail">
              <Form.Control
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="registerFirstName">
              <Form.Control
                type="text"
                placeholder="First Name"
                value={registerData.firstName}
                onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="registerLastName">
              <Form.Control
                type="text"
                placeholder="Last Name"
                value={registerData.lastName}
                onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="registerPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="registerPhone">
              <Form.Control
                type="text"
                placeholder="Phone Number"
                value={registerData.phoneNumber}
                onChange={(e) => setRegisterData({ ...registerData, phoneNumber: e.target.value })}
              />
            </Form.Group>
            <Button type="submit" className="auth-button">Register</Button>
          </Form>
        </div>
  
        {/* Sign In Form */}
        <div className="auth-form">
          <h2 className="text-center">Sign In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSignIn}>
            <Form.Group controlId="signInEmail">
              <Form.Control
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="signInPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" className="auth-button">Sign In</Button>
          </Form>
        </div>
      </div>
    </div>
  );
  
};

export default AuthPage;
