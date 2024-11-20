
import React from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase-config';
import { Link } from 'react-router-dom';
// import { setRole } from '../Components/role';

const LoginVO = ({setUserRole}) => {
  // const googleProvider = new GoogleAuthProvider();

  const handleEmailLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUserRole("volunteer");
        console.log('User signed in with email:', userCredential.user);
      })
      .catch((error) => {
        console.error('Email login error:', error.message);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Login Page for Volunteers</h2>
      
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleEmailLogin} className="border p-4 rounded shadow-sm">
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input type="email" name="email" id="email" className="form-control" required />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password" className="form-label">Password:</label>
              <input type="password" name="password" id="password" className="form-control" required />
            </div>
            <button 
              type="submit" 
              className="btn w-100" 
              style={{ backgroundColor: 'var(--blue)', color: 'white' }}
            >
              Login with Email
            </button>
          </form>

          <div className="text-center mt-3">
            <p>Don't have an account?</p>
            <Link to="/register">
              <button 
                className="btn" 
                style={{ backgroundColor: 'green', color: 'white' }}
              >
                Create Account
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginVO;



