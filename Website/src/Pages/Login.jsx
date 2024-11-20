// import React from 'react';
// import { Link } from 'react-router-dom';
// import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// import { auth } from '../firebase-config'; // Import the initialized auth from firebase-config.js

// const Login = () => {
//   const googleProvider = new GoogleAuthProvider();

//   // const handleGoogleLogin = () => {
//   //   signInWithPopup(auth, googleProvider)
//   //     .then((result) => {
//   //       console.log('User signed in with Google:', result.user);
//   //     })
//   //     .catch((error) => {
//   //       console.error('Google login error:', error.message);
//   //     });
//   // };

//   const handleEmailLogin = (e) => {
//     e.preventDefault();
//     const email = e.target.email.value;
//     const password = e.target.password.value;

//     signInWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         console.log('User signed in with email:', userCredential.user);
//       })
//       .catch((error) => {
//         console.error('Email login error:', error.message);
//       });
//   };

//   return (
//     <div className="login-container">
//       <h2>Login Page for NGOs</h2>

//       {/* Google Login */}
//       {/* <button onClick={handleGoogleLogin}>Login with Google</button> */}

//       {/* <h3>Or</h3> */}

//       {/* Email and Password Login */}
//       <form onSubmit={handleEmailLogin}>
//         <div>
//           <label>Email:</label>
//           <input type="email" name="email" required />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input type="password" name="password" required />
//         </div>
//         <button type="submit">Login with Email</button>
//       </form>

//       {/* Create Account Option */}
//       <div className="create-account">
//         <p>Don't have an account?</p>
//         <Link to="/registerNGO">
//           <button>Create Account</button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Login;

/// PREVIOUS FORM CODEs USED FOR THE NGO LOGIN 

/// NEW FORM CODES FOR THE LOGIN USING BOOTHSTRAP

import React from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase-config'; // Import the initialized auth from firebase-config.js
// import { setRole } from '../Components/role';

const Login = ({setUserRole}) => {
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
            fontSize: '60px',
            fontWeight: 'bold',
            marginBottom: '1px'
          }
        }>Login</p>
      <h5 className="text-center mb-3">as NGO</h5>

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

