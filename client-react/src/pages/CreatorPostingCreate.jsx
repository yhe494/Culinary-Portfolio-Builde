import { useState } from "react";
import { createTemplate } from "../api/api";
import CreatorTemplateForm from "../components/CreatorPostingForm"; 

export default function CreatorPostingCreate() {
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (templateData) => {
    try {
      await createTemplate(templateData);
      alert("Your posting has been saved!");
      setSuccess(true);
    } catch (err) {
      alert("Failed to save posting.");
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      {/* <h2>📝 Create New Posting</h2> */}
      <CreatorTemplateForm onSubmit={handleSubmit} />
    </div>
  );
}
