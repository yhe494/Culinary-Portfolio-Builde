import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { updateTemplate, getTemplates } from "../api/api";

const CATEGORIES = ["Appetizer", "Main Course", "Dessert", "Beverage", "Other"];

export default function EditPostingForm() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "", unit: "" }]);
  const [steps, setSteps] = useState([""]);
  const [isPublic, setIsPublic] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await getTemplates();
        const existingData = res.data.find((t) => t._id === id);
        if (existingData) {
          setTitle(existingData.title || "");
          setDescription(existingData.description || "");
          setCategories(existingData.categories || []);
          setImage(existingData.image || "");
          setIngredients(existingData.ingredients || [{ name: "", quantity: "", unit: "" }]);
          setSteps(existingData.steps || [""]);
          setIsPublic(existingData.isPublic ?? true);
        } else {
          setError("Template not found.");
        }
      } catch (err) {
        setError("Failed to fetch the template.");
      }
    };

    fetchTemplate();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Image type validation (image/* allows any image format)
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Invalid image format. Please upload a JPG, PNG, GIF, or WEBP image.");
        return;
      }

      // File size validation (5MB limit for example)
      const MAX_SIZE = 15 * 1024 * 1024; // 15MB in bytes
      if (file.size > MAX_SIZE) {
        setError("Image size exceeds the 5MB limit.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImageFile(file);
        setError(""); // Clear any previous error messages
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPost = {
      title,
      description,
      categories,
      image,
      ingredients,
      steps,
      isPublic,
      user,
    };

    try {
      await updateTemplate(id, updatedPost);
      setIsUpdated(true);
      setTimeout(() => {
        setIsUpdated(false);
        navigate(`/edit-portfolio`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update post.");
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const addStep = () => {
    setSteps([...steps, ""]);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h4>✏️ Edit Posting</h4>

      {isUpdated && (
        <div className="alert alert-success mb-3" role="alert">
          ✅ Your posting has been updated successfully!
        </div>
      )}

      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          ❌ {error}
        </div>
      )}

      <input
        className="form-control my-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="form-control my-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label>Select Categories (multiple)</label>
      <select
        className="form-select my-2"
        multiple
        value={categories}
        onChange={(e) =>
          setCategories(Array.from(e.target.selectedOptions, (o) => o.value))
        }
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <label>Upload Image</label>
      <input
        type="file"
        accept="image/*"
        className="form-control my-2"
        onChange={handleImageChange}
      />

      {image && typeof image === "string" && image.startsWith("data:image") ? (
        <div className="mb-3 text-center">
          <img
            src={image}
            alt="Preview"
            style={{ maxWidth: "100%", borderRadius: "12px" }}
          />
          <button
            type="button"
            className="btn btn-outline-danger mt-2"
            onClick={() => {
              setImage(""); // Clear image state
              setImageFile(null); // Clear the file reference
            }}
          >
            🗑️ Remove Image
          </button>
        </div>
      ) : image === "" ? (
        <div className="mb-3 text-center">
          <p>No image uploaded yet</p>
        </div>
      ) : null}

      <div className="form-check my-2">
        <input
          className="form-check-input"
          type="checkbox"
          checked={isPublic}
          onChange={() => setIsPublic(!isPublic)}
        />
        <label className="form-check-label">Public</label>
      </div>

      <h5>🥬 Ingredients</h5>
      {ingredients.map((ing, idx) => (
        <div className="row mb-2" key={idx}>
          <div className="col">
            <input
              className="form-control"
              placeholder="Name"
              value={ing.name}
              onChange={(e) => {
                const updated = [...ingredients];
                updated[idx].name = e.target.value;
                setIngredients(updated);
              }}
            />
          </div>
          <div className="col">
            <input
              className="form-control"
              placeholder="Quantity"
              value={ing.quantity}
              onChange={(e) => {
                const updated = [...ingredients];
                updated[idx].quantity = e.target.value;
                setIngredients(updated);
              }}
            />
          </div>
          <div className="col">
            <input
              className="form-control"
              placeholder="Unit"
              value={ing.unit}
              onChange={(e) => {
                const updated = [...ingredients];
                updated[idx].unit = e.target.value;
                setIngredients(updated);
              }}
            />
          </div>
          <div className="col-auto">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                const updated = ingredients.filter((_, i) => i !== idx);
                setIngredients(updated);
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-outline-primary mb-3"
        onClick={addIngredient}
      >
        + Add Ingredient
      </button>

      <h5>🧑‍🍳 Cooking Steps</h5>
      {steps.map((step, idx) => (
        <div className="input-group mb-2" key={idx}>
          <span className="input-group-text">Step {idx + 1}</span>
          <input
            className="form-control"
            value={step}
            onChange={(e) => {
              const updated = [...steps];
              updated[idx] = e.target.value;
              setSteps(updated);
            }}
          />
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              const updated = steps.filter((_, i) => i !== idx);
              setSteps(updated);
            }}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-outline-secondary mb-4"
        onClick={addStep}
      >
        + Add Step
      </button>

      <button type="submit" className="btn btn-success">
        ✅ Save Changes
      </button>
    </form>
  );
}
