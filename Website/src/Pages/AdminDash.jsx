import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDash.css";

const AdminDash = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/admin");
  };

  return (
    <div className="admin-container">
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
      <div className="admin-content">
        <h1>Admin Dashboard</h1>
      </div>
    </div>
  );
};

export default AdminDash;
