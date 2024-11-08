import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { TopBar } from './Components/TopBar';
import Login from './Pages/Login'; // Import your login page
import RegisterVolunteer from './Pages/Registervolunteer'; // Import your registration page
import Dashboard from './Pages/Dashboard'; // Import your dashboard page
import RegisterNGO from './Pages/RegisterNGO';
import NGOPost from './Pages/CreatePostN';
import LandingPage from './Pages/LandingPage';
import DonationPosts from './Pages/DonationPosts';
import DashboardVolun from './Pages/DashboardVolun';
import LoginVO from './Pages/LoginVO';
import NGOOverview from './Pages/NGOOverview.jsx';

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
      <TopBar />
      <div className="home-container">
        {/* Routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* NGO Login */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          
          {/* Volunteer Login */}
          <Route path="/loginV" element={!user ? <LoginVO /> : <Navigate to="/dashboardVolun" />} />
          
          <Route path="/register" element={!user ? <RegisterVolunteer /> : <Navigate to="/dashboardVolun" />} />
          
          <Route path="/registerNGO" element={!user ? <RegisterNGO /> : <Navigate to="/dashboard" />} />
          
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/dashboardVolun" element={user ? <DashboardVolun /> : <Navigate to="/loginV" />} />
          <Route path="/CreatePost" element={user ? <NGOPost /> : <Navigate to="/registerNGO" />} />
          <Route path="/donation-posts" element={<DonationPosts />} />
          <Route path="/ngo/:ngoId" element={<NGOOverview />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
