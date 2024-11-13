import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Customnavigate from './Components/Customnavigate.jsx';
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
import PaymentGateway from './Pages/PaymentGateway';
//import AvailableVolunteers from './Pages/AvailableVolunteers';  // one more import & we will be done lol


//ar koto import korbo bhai?


import { onAuthStateChanged, signOut } from 'firebase/auth'; // Import Firebase Auth function
import { auth } from './firebase-config'; // Import your Firebase configuration
// import { useAuthState } from 'react-firebase-hooks/auth';

import 'bootstrap/dist/css/bootstrap.min.css'; // For react bootstrap

import { getRole, setRole } from './Components/role.js';

function App() {
  const [user, setUser] = useState(null);

  const [userRole, setUserRole] = useState(getRole);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // const navigate = useNavigate()

  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out")
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  useEffect(()=>{
    setRole(userRole);
  }, [userRole])

  useEffect(()=>{
    if(!userRole){
      logout();
      console.log('Logged Out')
    }
    else{
      console.log(userRole)
    }
  }, [user])

  return (
    <Router>
      <Layout user={user} userRole={userRole} setUserRole={setUserRole}/>
    </Router>
  );
}

function Layout({ user, userRole, setUserRole }) {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/" && <TopBar userRole={userRole} setUserRole={setUserRole}/>}
      <div className="home-container">
        {/* Routes */}
        <Routes>
          <Route path="/" element={<LandingPage userRole={userRole} setUserRole={setUserRole}/>} />

          {/* NGO Login */}
          <Route path="/login" element={!user ? <Login setUserRole={setUserRole} /> : <Customnavigate to="/dashboard" />} />

          {/* Volunteer Login */}
          <Route path="/loginV" element={!user ? <LoginVO setUserRole={setUserRole} /> : <Customnavigate to="/dashboardVolun" />} />

          <Route path="/register" element={!user ? <RegisterVolunteer setUserRole={setUserRole} /> : <Customnavigate to="/dashboardVolun" />} />

          <Route path="/registerNGO" element={!user ? <RegisterNGO setUserRole={setUserRole} /> : <Customnavigate to="/dashboard" />} />

          <Route path="/dashboard" element={user ? <Dashboard setUserRole={setUserRole} /> : <Customnavigate to="/login" />} />
          <Route path="/dashboardVolun" element={user ? <DashboardVolun setUserRole={setUserRole} /> : <Customnavigate to="/loginV" />} />
          <Route path="/CreatePost" element={user ? <NGOPost /> : <Customnavigate to="/registerNGO" />} />
          <Route path="/donation-posts" element={<DonationPosts />} />
          <Route path="/ngo/:ngoId" element={<NGOOverview />} />
          <Route path="/payment-gateway" element={<PaymentGateway />} />
          
           
        </Routes>
      </div>
    </>
  )
}


export default App;
