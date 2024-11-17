import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDash = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/admin");
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", padding: "20px" }}>
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "10px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>

      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Admin Dashboard</h1>
      </div>
    </div>
  );
};

export default AdminDash;
