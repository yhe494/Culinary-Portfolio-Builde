import { useEffect, useState } from "react";
import { getTemplates } from "../api/api";
import { Link } from "react-router-dom";

export default function AdminTemplateList() {
  const [templates, setTemplates] = useState([]);

  const fetchTemplates = async () => {
    try {
      const res = await getTemplates();
      setTemplates(res.data);
    } catch (err) {
      console.error("템플릿 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className="container mt-4">
      <h2>📋 Saved Templates List</h2>

     
      <Link to="/admin/create" className="btn btn-primary mb-3">
        ➕ Create New Template
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
