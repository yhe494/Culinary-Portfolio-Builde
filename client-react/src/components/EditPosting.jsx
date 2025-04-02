import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const CATEGORIES = ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Other'];

export default function EditPostingForm({ onSubmit, existingData }) {
  const { user, setUser } = useContext(AuthContext);
  const [title, setTitle] = useState(existingData?.title || "");
  const [description, setDescription] = useState(existingData?.description || "");
  const [categories, setCategories] = useState(existingData?.categories || []);
  const [image, setImage] = useState(existingData?.image || "");
  const [ingredients, setIngredients] = useState(existingData?.ingredients || []);
  const [steps, setSteps] = useState(existingData?.steps || []);
  const [isPublic, setIsPublic] = useState(existingData?.isPublic ?? true);

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
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h4>✏️ Edit Posting</h4>
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

      <input
        className="form-control my-2"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

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
        ✅ Update Posting
      </button>
    </form>
  );
}
