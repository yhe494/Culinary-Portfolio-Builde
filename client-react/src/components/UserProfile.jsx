import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";

const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch user profile data
        const userResponse = await axios.get(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Fetch user's recipes
        const recipesResponse = await axios.get(`/api/templates/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setUserData(userResponse.data);
        setUserRecipes(recipesResponse.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError('Failed to load user profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading profile...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">User not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card className="mb-4 p-4 shadow-sm">
        <Row>
          <Col md={3} className="text-center">
            {userData.profileImage ? (
              <img 
                src={userData.profileImage} 
                alt={`${userData.firstName} ${userData.lastName}`} 
                className="rounded-circle"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
              />
            ) : (
              <div 
                className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white"
                style={{ width: '150px', height: '150px', margin: '0 auto' }}
              >
                <h2>{userData.firstName?.charAt(0)}{userData.lastName?.charAt(0)}</h2>
              </div>
            )}
          </Col>
          <Col md={9}>
            <h2>{userData.firstName} {userData.lastName}</h2>
            
            {userData.profile?.bios && (
              <div className="mb-3">
                <h5>About</h5>
                <p>{userData.profile.bios}</p>
              </div>
            )}
            
            {userData.profile?.website && (
              <div className="mb-3">
                <h5>Website</h5>
                <a href={userData.profile.website} target="_blank" rel="noopener noreferrer">
                  {userData.profile.website}
                </a>
              </div>
            )}
            
          </Col>
        </Row>
      </Card>

      <h3 className="mb-3">Recipes by {userData.firstName}</h3>
      
      {userRecipes.length === 0 ? (
        <Alert variant="info">No recipes found for this user.</Alert>
      ) : (
        <div className="recipe-list">
          {userRecipes.map((post) => (
            <div key={post._id} className="recipe-card">
              <h2 className="recipe-card-title">{post.title}</h2>

              <div className="image-container">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="recipe-image"
                    onClick={() => handleImageClick(post.image)} 
                  />
                ) : (
                  <div className="image-placeholder">No Image Available</div>
                )}
              </div>

              <div className="recipe-details">
                <p>
                  <span className="label">Description:</span> {post.description || "N/A"}
                </p>
                <p>
                  <span className="label">Categories:</span>{" "}
                  {Array.isArray(post.categories) && post.categories.length > 0
                    ? post.categories.map((cat, idx) => (
                        <Badge key={idx} bg="info" className="me-1">{cat}</Badge>
                      ))
                    : "N/A"}
                </p>
                <Link to={`/recipes/${post._id}`} className="btn btn-primary mt-2">
                  View Recipe
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Selected" className="modal-image" />
            <button className="close-btn" onClick={handleCloseModal}>✖️</button>
          </div>
        </div>
      )}

      <style>
        {`
          .recipe-list {
            display: flex;
            flex-direction: column;
            gap: 2.5rem;
            margin-top: 2rem;
          }

          .recipe-card {
            width: 100%;
            position: relative;
            background-color: #fff;
            border: 1px solid #e2e2e2;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
          }

          .recipe-card-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #222;
            margin-bottom: 1rem;
          }

          .image-container {
            width: 100%;
            height: 300px;
            overflow: hidden;
            position: relative;
            margin-bottom: 1rem;
          }

          .recipe-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            cursor: pointer;
            border-radius: 8px;
          }

          .image-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f0f0f0;
            text-align: center;
            border-radius: 8px;
          }

          .recipe-details {
            font-size: 1rem;
            color: #444;
            line-height: 1.6;
          }

          .label {
            font-weight: 600;
          }

          .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1050;
          }

          .modal-content {
            position: relative;
            max-width: 90%;
            max-height: 80%;
            background-color: #fff;
            padding: 10px;
            overflow: hidden;
            border-radius: 8px;
          }

          .modal-image {
            width: 100%;
            height: auto;
            display: block;
          }

          .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 2rem;
            color: white;
            background: none;
            border: none;
            cursor: pointer;
          }
        `}
      </style>
    </Container>
  );
};

export default UserProfile;