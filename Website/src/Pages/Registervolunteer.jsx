// // src/Pages/RegisterVolunteer.jsx
// import React, { useState } from 'react';
// import axios from 'axios';
// import { auth, db, storage } from '../firebase-config'; // Firestore, Auth, Storage imports
// import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase Auth method
// import { collection, doc, setDoc } from 'firebase/firestore'; // Firestore methods
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage methods

// const RegisterVolunteer = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [dob, setDob] = useState('');
//   const [skills, setSkills] = useState('');
//   const [gender, setGender] = useState('');
//   const [availability, setAvailability] = useState('available'); // Default availability
//   const [area, setArea] = useState('');
//   const [photo, setPhoto] = useState(null); // For file uploads
//   const [loading, setLoading] = useState(false);

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Create a new user with email and password
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Upload the volunteer's photo to Firebase Storage
//       let photoURL = '';
//       if (photo) {

//         // Prepare the form data
//         const formData = new FormData();
//         formData.append('image', photo);

//         try {
//           // Make the POST request to the server
//           const response = await axios.post('http://localhost:3000/upload', formData, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           });

//           console.log('Server response:', response.data);
//           photoURL = response.data.url;
//         } catch (error) {
//           console.error('Error uploading the image:', error);
//         }

//       }

//       // Save volunteer data in Firestore using the user.uid as the document ID
//       await setDoc(doc(db, 'volunteers', user.uid), {
//         name,
//         dob,
//         skills,
//         gender,
//         availability,
//         area,
//         role: 'Volunteer',
//         photoURL, // Store photo URL
//         email: user.email // Optionally store the email for easy access
//       });

//       alert('Volunteer registered successfully!');
//     } catch (error) {
//       console.error('Error registering volunteer: ', error);
//       alert('Error registering volunteer. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1>Volunteer Registration</h1>
//       <form onSubmit={handleRegister}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />
//         <input
//           type="date"
//           placeholder="Date of Birth"
//           value={dob}
//           onChange={(e) => setDob(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Skills"
//           value={skills}
//           onChange={(e) => setSkills(e.target.value)}
//           required
//         />
//         <select value={gender} onChange={(e) => setGender(e.target.value)} required>
//           <option value="">Select Gender</option>
//           <option value="Male">Male</option>
//           <option value="Female">Female</option>
//           <option value="Other">Other</option>
//         </select>
//         <input
//           type="file"
//           onChange={(e) => setPhoto(e.target.files[0])}
//         />
//         <input
//           type="text"
//           placeholder="Area"
//           value={area}
//           onChange={(e) => setArea(e.target.value)}
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? 'Registering...' : 'Register Volunteer'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default RegisterVolunteer;


import React, { useState } from 'react';
import axios from 'axios';
import { auth, db } from '../firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const RegisterVolunteer = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [skills, setSkills] = useState('');
  const [gender, setGender] = useState('');
  const [availability, setAvailability] = useState('available');
  const [area, setArea] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      let photoURL = '';

      if (photo) {
        const formData = new FormData();
        formData.append('image', photo);

        try {
          const response = await axios.post('http://localhost:3000/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          photoURL = response.data.url;
        } catch (error) {
          console.error('Error uploading the image:', error);
        }
      }

      await setDoc(doc(db, 'volunteers', user.uid), {
        name,
        dob,
        skills,
        gender,
        availability,
        area,
        role: 'Volunteer',
        photoURL,
        email: user.email,
      });

      alert('Volunteer registered successfully!');
    } catch (error) {
      console.error('Error registering volunteer: ', error);
      alert('Error registering volunteer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Volunteer Registration</h1>
      <div className="row justify-content-center">
        {/* This is where I added the col-md-6 class to limit the form width */}
        <div className="col-md-6">
          <form onSubmit={handleRegister} className="border p-4 rounded shadow-sm">
            <div className="form-group mb-3">
              <label>Email:</label>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Password:</label>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Name:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Date of Birth:</label>
              <input
                type="date"
                className="form-control"
                placeholder="Date of Birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Skills:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Gender:</label>
              <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <label>Photo:</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </div>
            <div className="form-group mb-3">
              <label>Area:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100"
              style={{ backgroundColor: 'var(--blue)', color: 'white' }} disabled={loading}>
              {loading ? 'Registering...' : 'Register Volunteer'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterVolunteer;
