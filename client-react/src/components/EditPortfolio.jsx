import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function EditPortfolioForm({ onSubmit, initialData }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [bio, setBio] = useState(user?.profile?.bios || "");
  const [website, setWebsite] = useState(user?.profile?.website || "");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token= localStorage.getItem('token');

        const response = await axios.get(`http://localhost:5001/templates/user/${user?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        console.log(response);
        setPosts(response.data);

      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchPosts();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedPortfolio = {
      firstName,
      lastName,
      profile: {
        bios: bio,
        website,
      },
    };
  
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5001/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPortfolio),
      });
  
      if (response.ok) {
        alert("Portfolio updated successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to update portfolio: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating portfolio:", error);
      alert("An error occurred while updating the portfolio.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-post/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const token= localStorage.getItem('token');

      await axios.delete(`http://localhost:5001/templates/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
      
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="portfolio-container">
      {/* Profile Edit Section */}
      <div className="profile-edit-section">
        <h2 className="section-title">📝 Edit Profile</h2>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              className="form-control"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              className="form-control"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          
          <div className="form-group form-full-width">
            <label className="form-label">Biography</label>
            <textarea
              className="form-control"
              placeholder="Tell us about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          
          <div className="form-group form-full-width">
            <label className="form-label">Website URL</label>
            <input
              className="form-control"
              placeholder="https://yourwebsite.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          
          <div className="button-container">
            <button type="submit" className="btn btn-success">
              ✅ Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Recipes Section */}
      <div className="recipes-section">
        <div className="recipe-header">
          <h2 className="recipe-title">My Recipes</h2>
          <button className="add-recipe-btn" onClick={() => navigate('/creator/create')}>
            ➕ Add New Recipe
          </button>
        </div>

        {loading ? (
          <div className="loading-text">Loading your recipes...</div>
        ) : posts.length === 0 ? (
          <div className="no-posts-text">No recipes found. Create your first recipe!</div>
        ) : (
          <div className="recipe-list">
            {posts.map((post) => (
              <div key={post._id} className="recipe-card">
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

                <div className="recipe-card-content">
                  <h3 className="recipe-card-title">{post.title}</h3>
                  
                  <div className="recipe-details">
                    <p>{post.description || "No description available"}</p>
                  </div>
                  
                  {Array.isArray(post.categories) && post.categories.length > 0 && (
                    <div className="recipe-categories">
                      {post.categories.map((category, index) => (
                        <span key={index} className="recipe-category">{category}</span>
                      ))}
                    </div>
                  )}
                  
                  <div className="button-group">
                    <button onClick={() => handleEdit(post._id)} className="edit-btn">
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDelete(post._id)} className="delete-btn">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Recipe" className="modal-image" />
            <button className="close-btn" onClick={handleCloseModal}>✖️</button>
          </div>
        </div>
      )}
    </div>
  );
}