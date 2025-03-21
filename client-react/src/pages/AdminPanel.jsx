import { Link } from 'react-router-dom';

function AdminPanel() {
  return (
    <div className="container mt-4">
      <h2>🎛️ Admin Dashboard</h2>

      <div className="d-grid gap-2 mt-4">
        <Link to="/admin/create" className="btn btn-primary">
          ➕ Create New Template
        </Link>
        <Link to="/admin/templates" className="btn btn-secondary">
          📋 Saved Templates List
        </Link>
      </div>
    </div>
  );
}

export default AdminPanel;
