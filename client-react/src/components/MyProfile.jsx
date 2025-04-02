import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function EditPortfolioAndProfile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [website, setWebsite] = useState(user?.website || "");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/templates/user/${user?.id}`);
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchPosts();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedPortfolio = { firstName, lastName, bio, website };

    try {
      const response = await fetch("http://localhost:5001/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPortfolio),
      });

      if (response.ok) {
        alert("Portfolio updated successfully!");
        navigate("/myprofile");
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
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <>
    <div className="container mx-auto p-8">
      <form onSubmit={handleSubmit} className="mt-4">
        <h4 className="text-xl font-bold">📝 Edit Portfolio</h4>
        <input className="form-control my-2" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input className="form-control my-2" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <textarea className="form-control my-2" placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
        <input className="form-control my-2" placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
        <button type="submit" className="btn btn-success">✅ Save Changes</button>
      </form>

    </div>
    <div className="mt-12">
      <h1 className="text-3xl font-bold mb-6">My Profile - Your Posts</h1>
      {loading ? (
        <div className="text-center p-10">Loading...</div>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts found. Create your first recipe!</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src={post.image || "https://via.placeholder.com/400x200"} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-4">{post.description}</p>
                <div className="text-sm">
                  <p><strong>Ingredients:</strong> {post.ingredients}</p>
                  <p><strong>Cooking Time:</strong> {post.cookingTime}</p>
                </div>
                <div className="flex justify-between mt-6">
                  <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition" onClick={() => handleEdit(post._id)}>Edit Recipe</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition" onClick={() => handleDelete(post._id)}>Delete Recipe</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>)
}
