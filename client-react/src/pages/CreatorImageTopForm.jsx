import CreatorPostingForm from "../components/CreatorPostingForm";
import { createTemplate } from "../api/api";
import { useNavigate } from "react-router-dom";

const CreatorImageTopForm = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    await createTemplate({ ...data, templateType: "imageTop" });
    navigate("/creator/postings");
  };

  return (
    <div className="container mt-4">
      <h2>📷 Template 2</h2>
      <CreatorPostingForm templateType="imageTop" onSubmit={handleSubmit} />
    </div>
  );
}


export default CreatorImageTopForm;

