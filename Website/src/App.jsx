import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';

import Login from './Pages/Login'; // Import your login page
import RegisterVolunteer from './Pages/Registervolunteer'; // Import your registration page
import Dashboard from './Pages/Dashboard'; // Import your dashboard page
import RegisterNGO from './Pages/RegisterNGO';
import NGOPost from './Pages/CreatePostN';
import LandingPage from './Pages/LandingPage';
import DonationPosts from './Pages/DonationPosts';

import { onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth function
import { auth } from './firebase-config'; // Import your Firebase configuration
// import { useAuthState } from 'react-firebase-hooks/auth';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="home-container">
        {/* Routes */}
        <Routes>

          <Route path="/" element={<LandingPage />} />
         
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          
          <Route path="/register" element={!user ? <RegisterVolunteer /> : <Navigate to="/dashboard" />} />
          
          <Route path="/registerNGO" element={!user ? <RegisterNGO /> : <Navigate to="/dashboard" />} />
         
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/CreatePost" element={user ? <NGOPost /> : <Navigate to="/registerNGO" />} />
          <Route path="/donation-posts" element={<DonationPosts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
