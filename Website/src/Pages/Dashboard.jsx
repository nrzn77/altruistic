// src/Pages/Dashboard.jsx
import React, { useEffect } from 'react';
import { auth } from '../firebase-config';
import { signOut } from 'firebase/auth';
import { Route, useNavigate, Link } from 'react-router-dom';
import NGOOverview from './NGOOverview';
// import { setRole } from '../Components/role';

// import NGOPost from './Pages/CreatePostN';

const Dashboard = ({ setUserRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUserRole(null)
        navigate('/login'); // Redirect to login page after logout
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  return (
    <div>
      <h1>Welcome to Your Dashboard!</h1>
      <p>You are logged in as {auth.currentUser?.email}</p>
      <button onClick={handleLogout}>Logout</button>
      <Link to="/CreatePost">
        <button>Create a post asking for money</button>
      </Link>
      <Link to ="/AvailableVolunteer">
      <button> Available Vlunteers </button>
      </Link>
      <NGOOverview ngoId={auth.currentUser?.uid} />
    </div>
  );
};

export default Dashboard;
