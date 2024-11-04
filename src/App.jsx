import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Login from './Pages/Login'; // Import your login page
import RegisterVolunteer from './Pages/Registervolunteer'; // Import your registration page
import Dashboard from './Pages/Dashboard'; // Import your dashboard page
import { onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth function
import { auth } from './firebase-config'; // Import your Firebase configuration

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
        <h1>Welcome to Our App</h1>

        {/* Navigation Links */}
        <nav>
          <Link to="/login">
            <button>Login</button>
          </Link>
          <Link to="/register">
            <button>Create Account</button>
          </Link>
        </nav>

        {/* Routes */}
        <Routes>
          {/* If user is logged in, redirect to dashboard; otherwise, show login */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          
          {/* Registration page route */}
          <Route path="/register" element={!user ? <RegisterVolunteer /> : <Navigate to="/dashboard" />} />

          {/* Protected dashboard route; if not logged in, redirect to login */}
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
