// src/Pages/Dashboard.jsx
import React from 'react';
import { auth } from '../firebase-config';
import { signOut } from 'firebase/auth';
import { Route, useNavigate, Link } from 'react-router-dom';

// import NGOPost from './Pages/CreatePostN';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
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
      <nav>
      <Link to="/CreatePost">
            <button>Create a post asking for money</button>
          </Link>
          </nav>
          
    </div>
  );
};

export default Dashboard;
