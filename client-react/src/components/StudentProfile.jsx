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
  const [isEditing, setIsEditing] = useState(true); // Start in editing mode
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    console.log('StudentProfile user context:', user);
    
    if (user && (user.id || user._id)) { // Check for either id or _id
      const fetchUserData = async () => {
        // ... rest of your code
      };
      
      fetchUserData();
    } else {
      console.log('Missing user data:', user);
      setError('User authentication failed. Please log in again.');
    }
  }, [user]);
  
  const getUserData = async () => {
    if (!user || !user.token) {
      console.log('Missing user or token in getUserData:', user);
      throw new Error('User authentication failed. Please log in again.');
    }
  
    const userId = user.id || user._id;
    if (!userId) {
      console.log('Missing user ID in getUserData:', user);
      throw new Error('User authentication failed. Please log in again.');
    }
  
    try {
      const response = await axios.get(`http://localhost:5001/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
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
      console.log('Missing user or token in savePortfolio:', user);
      throw new Error('User authentication failed. Please log in again.');
    }
  
    try {
      const response = await axios.put(`http://localhost:5001/users/${user.id}`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
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

    if (!isEditing) {
      // If not in edit mode, switch to edit mode
      setIsEditing(true);
      return;
    }

    if (!user || !user.token) {
      setError('User authentication failed. Please log in again.');
      return;
    }

    const portfolioData = { firstName, lastName, bio, website };

    setLoading(true);
    try {
      await savePortfolio(portfolioData);
      console.log('Portfolio saved:', portfolioData);
      setSuccess(true);
      setError('');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving portfolio:', error.response?.data || error.message);
      setSuccess(false);
      setError('Failed to save portfolio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    // Revert to view mode without saving
    setIsEditing(false);
    // Reset form data to last saved values
    if (profileLoaded) {
      getUserData().then(userData => {
        setFirstName(userData.firstName || '');
        setLastName(userData.lastName || '');
        setBio(userData.bio || '');
        setWebsite(userData.website || '');
      }).catch(err => {
        console.error('Error fetching user data:', err);
        setError('Error fetching user data');
      });
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h2 className="text-center my-4">
            <img src={chefImage} alt="Chef" style={{ width: '50px', marginRight: '10px' }} />
            {isEditing ? 'Edit Your Culinary Portfolio' : 'Your Culinary Portfolio'}
          </h2>
          {success && <Alert variant="success">Portfolio saved successfully!</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          {loading && <Alert variant="info">Loading...</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFirstName" className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                required
                disabled={!isEditing}
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
                disabled={!isEditing}
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
                disabled={!isEditing}
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
                disabled={!isEditing}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-between">
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 me-2" 
                disabled={loading}
              >
                {isEditing ? 'Save Changes' : 'Edit Portfolio'}
              </Button>
              
              {isEditing && (
                <Button 
                  variant="secondary" 
                  className="w-100 ms-2" 
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentProfile;