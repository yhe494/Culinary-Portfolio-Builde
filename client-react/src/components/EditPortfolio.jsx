// import { useState } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { useContext } from "react";

// export default function EditPortfolioForm({ onSubmit, initialData }) {

//   const { user } = useContext(AuthContext);

//   const [firstName, setFirstName] = useState(user?.firstName || "");
//   const [lastName, setLastName] = useState(user?.lastName || "");
//   const [bio, setBio] = useState(user?.bio || "");
//   const [website, setWebsite] = useState(user?.website || "");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const updatedPortfolio = {
//       firstName,
//       lastName,
//       bio,
//       website,
//     };

//     try {
//       const response = await fetch("http://localhost:5001/portfolio", {
//         method: "POST", // Use POST or PUT depending on your backend implementation
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedPortfolio),
//       });

//       if (response.ok) {
//         alert("Portfolio updated successfully!");
//       } else {
//         const errorData = await response.json();
//         alert(`Failed to update portfolio: ${errorData.message || "Unknown error"}`);
//       }
//     } catch (error) {
//       console.error("Error updating portfolio:", error);
//       alert("An error occurred while updating the portfolio.");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="mt-4">
//       <h4>📝 Edit Portfolio</h4>
//       <input
//         className="form-control my-2"
//         placeholder="First Name"
//         value={firstName}
//         onChange={(e) => setFirstName(e.target.value)}
//       />
//       <input
//         className="form-control my-2"
//         placeholder="Last Name"
//         value={lastName}
//         onChange={(e) => setLastName(e.target.value)}
//       />
//       <textarea
//         className="form-control my-2"
//         placeholder="Bio"
//         value={bio}
//         onChange={(e) => setBio(e.target.value)}
//       />
//       <input
//         className="form-control my-2"
//         placeholder="Website"
//         value={website}
//         onChange={(e) => setWebsite(e.target.value)}
//       />
//       <button type="submit" className="btn btn-success">
//         ✅ Save Changes
//       </button>
//     </form>
//   );
// }

import { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function EditPortfolioForm({ onSubmit, initialData }) {
  const { user } = useContext(AuthContext);
    console.log(user);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [bio, setBio] = useState(user?.profile?.bios || "");
  const [website, setWebsite] = useState(user?.profile?.website || "");

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
  
      const response = await fetch("http://localhost:5001/users/67ec5c0d37898f0835bac939", {
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

  return (
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
  );
}