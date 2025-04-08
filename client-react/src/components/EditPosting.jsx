import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const CATEGORIES = ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Other'];

export default function EditPostingForm({ onSubmit, existingData }) {
  const { user } = useContext(AuthContext);

  // Initial state setup with the existingData passed as a prop
  const [title, setTitle] = useState(existingData?.title || "");
  const [description, setDescription] = useState(existingData?.description || "");
  const [categories, setCategories] = useState(existingData?.categories || []);
  const [image, setImage] = useState(existingData?.image || "");
  const [ingredients, setIngredients] = useState(existingData?.ingredients || [{ name: "", quantity: "", unit: "" }]);
  const [steps, setSteps] = useState(existingData?.steps || [""]);
  const [isPublic, setIsPublic] = useState(existingData?.isPublic ?? true);
  const [isUpdated, setIsUpdated] = useState(false); // New state for success message

  // Whenever existingData changes, update the form fields
  useEffect(() => {
    if (existingData) {
      setTitle(existingData.title || "");
      setDescription(existingData.description || "");
      setCategories(existingData.categories || []);
      setImage(existingData.image || "");
      setIngredients(existingData.ingredients || [{ name: "", quantity: "", unit: "" }]);
      setSteps(existingData.steps || [""]);
      setIsPublic(existingData.isPublic ?? true);
    }
  }, [existingData]); // This ensures it gets updated if existingData changes

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const addStep = () => {
    setSteps([...steps, ""]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const posting = {
      title,
      description,
      categories,
      image,
      ingredients,
      steps,
      isPublic,
      user,
    };
    onSubmit(posting);
    
    // Show success message
    setIsUpdated(true);

    // Optionally, hide the success message after a few seconds
    setTimeout(() => {
      setIsUpdated(false);
    }, 3000); // Hide message after 3 seconds
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h4>✏️ Edit Posting</h4>

      {/* Success Message */}
      {isUpdated && (
        <div className="alert alert-success mb-3" role="alert">
          ✅ Your posting has been updated successfully!
        </div>
      )}

      <input
        className="form-control my-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)} // Handling change for title
      />
      <textarea
        className="form-control my-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)} // Handling change for description
      />

      <label>Select Categories (multiple)</label>
      <select
        className="form-select my-2"
        multiple
        value={categories}
        onChange={(e) =>
          setCategories(Array.from(e.target.selectedOptions, (o) => o.value)) // Handling change for categories
        }
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input
        className="form-control my-2"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)} // Handling change for image
      />

      <div className="form-check my-2">
        <input
          className="form-check-input"
          type="checkbox"
          checked={isPublic}
          onChange={() => setIsPublic(!isPublic)} // Handling change for public checkbox
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
                setIngredients(updated); // Handling change for ingredient name
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
                setIngredients(updated); // Handling change for ingredient quantity
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
                setIngredients(updated); // Handling change for ingredient unit
              }}
            />
          </div>
          <div className="col-auto">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                const updated = ingredients.filter((_, i) => i !== idx);
                setIngredients(updated); // Handling ingredient removal
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
              setSteps(updated); // Handling change for cooking steps
            }}
          />
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              const updated = steps.filter((_, i) => i !== idx);
              setSteps(updated); // Handling step removal
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
        ✅ Update Posting
      </button>
      
    </form>
  );
}
