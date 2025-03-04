import React from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase-config'; // Import the initialized auth from firebase-config.js
// import { setRole } from '../Components/role';

const EmailLogin = ({setUserRole}) => {
  const googleProvider = new GoogleAuthProvider();

  const handleEmailLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUserRole("ngo")
        console.log('User signed in with email:', userCredential.user);
      })
      .catch((error) => {
        console.error('Email login error:', error.message);
      });
  };

  return (
    <div className="container mt-3">
      <p className="text-center"
        style={
          {
            fontSize: '40px',
            marginBottom: '1px'
          }
        }>Login</p>
      <h5 style={{ fontSize: '35px' }} className="text-center mb-3">NGO</h5>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleEmailLogin} className="border p-4 rounded shadow-sm" style={{ backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input type="email" name="email" id="email" className="form-control" required />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password" className="form-label">Password:</label>
              <input type="password" name="password" id="password" className="form-control" required />
            </div>
            <button type="submit" className="btn btn-primary w-100"
              style={{ backgroundColor: 'var(--blue)', color: 'white' }}>Login</button>
          </form>

          <div className="text-center mt-3">
            <p>Don't have an account?</p>
            <Link to="/registerNGO">
              <button className="btn btn-secondary" style={{ backgroundColor: 'green', color: 'white' }}
              >Create Account</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

