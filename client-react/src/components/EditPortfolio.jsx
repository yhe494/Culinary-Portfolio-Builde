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
  const [bio, setBio] = useState(user?.bio || "");
  const [website, setWebsite] = useState(user?.website || "");
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
    <>
      <form onSubmit={handleSubmit} className="mt-4">
        <h4>📝 Edit Profile</h4>
        <input
          className="form-control my-2"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          className="form-control my-2"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <textarea
          className="form-control my-2"
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <input
          className="form-control my-2"
          placeholder="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <button type="submit" className="btn btn-success">
          ✅ Save Changes
        </button>
      </form>

      <div className="recipe-container">
        <h1 className="recipe-title">Recipes Page</h1>

        {loading ? (
          <div className="loading-text">Loading...</div>
        ) : posts.length === 0 ? (
          <p className="no-posts-text">No posts found. Create your first recipe!</p>
        ) : (
          <div className="recipe-list">
            {posts.map((post) => (
              <div key={post._id} className="recipe-card">
                <h2 className="recipe-card-title">{post.title}</h2>

                <div className="image-container">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="recipe-image"
                      onClick={() => handleImageClick(post.image)} // Click to open the image in a modal
                    />
                  ) : (
                    <div className="image-placeholder">Image Placeholder</div>
                  )}
                </div>

                <div className="recipe-details">
                  <p>
                    <span className="label">Description:</span> {post.description || "N/A"}
                  </p>
                  <p>
                    <span className="label">Ingredients:</span>{" "}
                    {Array.isArray(post.ingredients) && post.ingredients.length > 0
                      ? post.ingredients.map((ingredient, index) => (
                          <span key={index}>
                            {ingredient.quantity} {ingredient.unit} {ingredient.name}
                            {index < post.ingredients.length - 1 ? ", " : ""}
                          </span>
                        ))
                      : "N/A"}
                  </p>
                  <p>
                    <span className="label">Categories:</span>{" "}
                    {Array.isArray(post.categories) && post.categories.length > 0
                      ? post.categories.join(", ")
                      : "N/A"}
                  </p>
                  <p>
                    <span className="label">Cooking Steps:</span>{" "}
                    {Array.isArray(post.steps) && post.steps.length > 0
                      ? post.steps.map((step, index) => (
                          <span key={index}>
                            Step {index + 1}: {step}
                            {index < post.steps.length - 1 ? ", " : ""}
                          </span>
                        ))
                      : "N/A"}
                  </p>
                </div>

                <div className="button-group">
                  <button onClick={() => handleEdit(post._id)} className="edit-btn">
                    ✏️ Edit Recipe
                  </button>
                  <button onClick={() => handleDelete(post._id)} className="delete-btn">
                    🗑️ Delete Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
          .recipe-container {
            max-width: 100%;
            margin: 2rem auto;
            padding: 0 1rem;
          }

          .recipe-title {
            font-size: 2.5rem;
            font-weight: bold;
            text-align: center;
            margin-bottom: 3rem;
            color: #2d2d2d;
          }

          .loading-text,
          .no-posts-text {
            text-align: center;
            font-size: 1.2rem;
            color: #888;
            padding: 2rem 0;
          }

          .recipe-list {
            display: flex;
            flex-direction: column;
            gap: 2.5rem;
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
          }

          .recipe-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            cursor: pointer;
          }

          .image-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f0f0f0;
            text-align: center;
          }

          .recipe-details {
            font-size: 1rem;
            color: #444;
            line-height: 1.6;
          }

          .label {
            font-weight: 600;
          }

          .button-group {
            margin-top: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .edit-btn,
          .delete-btn {
            padding: 0.6rem 1.4rem;
            font-weight: 500;
            color: #fff;
            background-color: #22c55e;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .edit-btn:hover,
          .delete-btn:hover {
            background-color: #16a34a;
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
          }

          .modal-content {
            position: relative;
            max-width: 90%;
            max-height: 80%;
            background-color: #fff;
            padding: 10px;
            overflow: hidden;
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
    </>
  );
}
