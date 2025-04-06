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
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token= localStorage.getItem('token');

        const response = await axios.get(`http://localhost:5001/templates/user/${user?.id}`,

          {
         headers:{
          Authorization: `Bearer ${token}`,
         }
          }
        );
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

  useEffect(() => {
    console.log([posts])
  },[posts]
  )

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prepare the updated portfolio data
    const updatedPortfolio = {
      firstName,
      lastName,
      profile: {
        bios: bio,
        website,
      },
    };
  
    try {
      // Retrieve the token from localStorage or context
      const token = localStorage.getItem("token"); // Adjust this based on how you store the token
  
      const response = await fetch(`http://localhost:5001/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
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

      await axios.delete(`http://localhost:5001/templates/${id}`,
        {
       headers:{
        Authorization: `Bearer ${token}`,
       }
        });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));

      
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="mt-4">
      <h4>📝 Edit Portfolio</h4>
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
         
          <div className="p-6">
          <p><strong>Title:</strong> {post.title}</p>
          <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
          <p><strong>Description:</strong> {post.description}</p>

            <div className="text-sm">
              <p><strong>Ingredients:</strong> 
                {Array.isArray(post.ingredients) ? (
                  post.ingredients.map((ingredient, index) => (
                    <span key={index}>
                      {ingredient.quantity} {ingredient.unit} {ingredient.name}
                      {index < post.ingredients.length - 1 ? ", " : ""}
                    </span>
                  ))
                ) : (
                  "No ingredients available"
                )}
              </p>
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
  </>
  );
}
