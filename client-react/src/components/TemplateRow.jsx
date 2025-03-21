// src/components/TemplateRow.jsx
import { useState } from "react";
import { updateTemplate, deleteTemplate } from "../api/api";

export default function TemplateRow({ template, fetchTemplates }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTemplate, setEditedTemplate] = useState({ ...template });

  // Edit Templates
  const handleUpdate = async () => {
    try {
      await updateTemplate(template._id, editedTemplate);
      setIsEditing(false);
      fetchTemplates();
    } catch (err) {
      console.error("Error updating template:", err);
    }
  };

  // Delete Templates
  const handleDelete = async () => {
    if (!window.confirm("Do you want to delete the template?")) return;
    try {
      await deleteTemplate(template._id);
      fetchTemplates();
    } catch (err) {
      console.error("Error deleting template:", err);
    }
  };

  return (
    <tr>
      <td>
        {isEditing ? (
          <input
            className="form-control"
            value={editedTemplate.title}
            onChange={(e) => setEditedTemplate({ ...editedTemplate, title: e.target.value })}
          />
        ) : (
          template.title
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            className="form-control"
            value={editedTemplate.description}
            onChange={(e) => setEditedTemplate({ ...editedTemplate, description: e.target.value })}
          />
        ) : (
          template.description
        )}
      </td>
      <td>
        {isEditing ? (
          <>
            <button className="btn btn-success btn-sm mx-1" onClick={handleUpdate}>
            Save
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>
            Cancel
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-warning btn-sm mx-1" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
