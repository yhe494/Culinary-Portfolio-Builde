import AdminTemplateForm from "../components/AdminTemplateForm";
import { createTemplate } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AdminTemplateCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (templateData) => {
    try {
      await createTemplate(templateData);
      alert("Successfully Saved!");
      navigate("/admin/templates"); 
    } catch (err) {
      alert("Save Failed!");
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>🧑‍🍳 Create New Template</h2>
      <AdminTemplateForm onSubmit={handleSubmit} />
    </div>
  );
}
