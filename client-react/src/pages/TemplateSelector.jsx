// TemplateSelector.jsx
import React from "react";
import { Link } from "react-router-dom";

const TemplateSelector = () => {
  return (
    <div className="container mt-4">
      <h2>🧩 Choose a Template</h2>
      <div className="d-flex flex-column gap-3 mt-4">
        <Link to="/creator/create/general" className="btn btn-outline-primary">📝 Template 1</Link>
        <Link to="/creator/create/imagetop" className="btn btn-outline-secondary">📷 Template 2</Link>
      </div>
    </div>
  );
}

export default TemplateSelector;
