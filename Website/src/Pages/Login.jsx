import React from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase-config'; // Import the initialized auth from firebase-config.js

const Login = () => {
  const googleProvider = new GoogleAuthProvider();

  // const handleGoogleLogin = () => {
  //   signInWithPopup(auth, googleProvider)
  //     .then((result) => {
  //       console.log('User signed in with Google:', result.user);
  //     })
  //     .catch((error) => {
  //       console.error('Google login error:', error.message);
  //     });
  // };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('User signed in with email:', userCredential.user);
      })
      .catch((error) => {
        console.error('Email login error:', error.message);
      });
  };

  return (
    <div className="login-container">
      <h2>Login Page for NGOs</h2>

      {/* Google Login */}
      {/* <button onClick={handleGoogleLogin}>Login with Google</button> */}

      {/* <h3>Or</h3> */}

      {/* Email and Password Login */}
      <form onSubmit={handleEmailLogin}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit">Login with Email</button>
      </form>

      {/* Create Account Option */}
      <div className="create-account">
        <p>Don't have an account?</p>
        <Link to="/registerNGO">
          <button>Create Account</button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
