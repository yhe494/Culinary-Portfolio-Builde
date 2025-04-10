import CreatorPostingForm from "../components/CreatorPostingForm";
import { createTemplate } from "../api/api";
import { useNavigate } from "react-router-dom";

const CreatorGeneralForm = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    await createTemplate({ ...data, templateType: "default" });
    navigate("/recipes");
  };

  return (
    <div className="container mt-4">
      <h2>📝 Create Posting with Default Template </h2>
      <CreatorPostingForm templateType="default" onSubmit={handleSubmit} />
    </div>
  );
}

export default CreatorGeneralForm;