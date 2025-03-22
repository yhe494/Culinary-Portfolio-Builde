import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import chefImage from '../assets/chef.png'; // Import the image

const StudentProfile = () => {
  const { user } = useContext(AuthContext); // Access user from context
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for API calls

  useEffect(() => {
    if (user && user.id) { // Ensure 'user' and 'user.id' are available before proceeding
      const fetchUserData = async () => {
        try {
          const userData = await getUserData();
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setBio(userData.bio);
          setWebsite(userData.website);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError('Error fetching user data');
        }
      };
  
      fetchUserData();
    }
  }, [user]);
  

  const getUserData = async () => {
    if (!user || !user.token) {
      setError('User authentication failed. Please log in again.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5001/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,  // Include JWT token
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data || error.message);
      throw error;
    }
  };

  const savePortfolio = async (data) => {
    if (!user || !user.token) {
      setError('User authentication failed. Please log in again.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5001/users/${user.id}`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,  // Include JWT token
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error saving portfolio:', error.response?.data || error.message);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.token) {
      setError('User authentication failed. Please log in again.');
      return;
    }

    const portfolioData = { firstName, lastName, bio, website };

    setLoading(true); // Set loading true during save operation
    try {
      await savePortfolio(portfolioData);
      console.log('Portfolio Created:', portfolioData);
      setSuccess(true);
      setError('');
      setIsEditing(false);
    } catch (error) {
      console.error('Error creating portfolio:', error.response?.data || error.message);
      setSuccess(false);
      setError('Failed to save portfolio. Please try again.');
    } finally {
      setLoading(false); // Set loading false after operation completes
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSuccess(false);
  };

  const handleDelete = () => {
    setFirstName('');
    setLastName('');
    setBio('');
    setWebsite('');
    setSuccess(false);
    setIsEditing(false);
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h2 className="text-center my-4">
            <img src={chefImage} alt="Chef" style={{ width: '50px', marginRight: '10px' }} />
            Create a Culinary Portfolio
          </h2>
          {success && <Alert variant="success">Portfolio created successfully!</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFirstName" className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                required
                disabled={success && !isEditing}
              />
            </Form.Group>
            <Form.Group controlId="formLastName" className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                required
                disabled={success && !isEditing}
              />
            </Form.Group>
            <Form.Group controlId="formBio" className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                required
                disabled={success && !isEditing}
              />
            </Form.Group>
            <Form.Group controlId="formWebsite" className="mb-3">
              <Form.Label>Website Link</Form.Label>
              <Form.Control
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Enter your website link"
                required
                disabled={success && !isEditing}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={loading || (success && !isEditing)}>
              {isEditing ? 'Save Changes' : 'Edit Portfolio'}
            </Button>
          </Form>
          {success && !isEditing && (
            <>
              {/* Optional section: You can add any success message or details you want to show after saving */}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StudentProfile;