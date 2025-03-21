import { useEffect, useState } from "react";
import { getTemplates } from "../api/api";
import { Link } from "react-router-dom";

export default function CreatorPostingList() {
  const [templates, setTemplates] = useState([]);

  const fetchTemplates = async () => {
    try {
      const res = await getTemplates();
      setTemplates(res.data);
    } catch (err) {
      console.error("Failed to fetch postings:", err);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className="container mt-4">
      <h2>📋 Your Postings</h2>

      <Link to="/creator/create" className="btn btn-primary mb-3">
        ➕ Create New Posting
      </Link>

      <ul className="list-group">
        {templates.map((template) => (
          <li key={template._id} className="list-group-item">
            <strong>{template.title}</strong> – {template.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
