import { useState } from "react";

const CATEGORIES = ["Appetizer", "Main Course", "Dessert", "Beverage", "Other"];

export default function CreatorPostingForm({
  templateType = "default",
  initialData = {},
  onSubmit,
}) {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [categories, setCategories] = useState(initialData.categories || []);
  const [image, setImage] = useState(initialData.image || "");
  const [imageFile, setImageFile] = useState(null);
  const [ingredients, setIngredients] = useState(initialData.ingredients || []);
  const [steps, setSteps] = useState(initialData.steps || []);
  const [isPublic, setIsPublic] = useState(initialData.isPublic ?? true);

  const isImageTop = templateType === "imageTop";

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const addStep = () => {
    setSteps([...steps, ""]);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("📷 Preview image set:", reader.result); 
        setImage(reader.result); // base64 preview
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
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
    };
    onSubmit(posting);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">

      {/* 🖼️ Image preview for imageTop template */}
      {isImageTop && image && typeof image === "string" && image.startsWith("data:image") && (
        <div className="mb-3 text-center">
          <img
            src={image}
            alt="Preview"
            style={{ maxWidth: "100%", borderRadius: "12px" }}
          />
          {imageFile && (
            <p className="text-muted small">Uploaded: {imageFile.name}</p>
          )}
        </div>
      )}

      <h4>📝 Create New Posting</h4>

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
        ✅ Save Posting
      </button>
    </form>
  );
}
