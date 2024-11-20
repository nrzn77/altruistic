import React, { useState } from 'react';
import axios from 'axios';
import { auth, db } from '../firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const RegisterVolunteer = ({ setUserRole }) => {
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
      setUserRole('volunteer');
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
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4" style={{ color: '#260d54' }}>Volunteer Registration</h1><br />
      <div className="row justify-content-center">
        <div className="col-md-6" style={{ marginBottom: '70px' }}>
          <form
            onSubmit={handleRegister}
            className="border p-4"
            style={{
              backgroundColor: 'white',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2), 0 6px 6px rgba(0, 0, 0, 0.15)',
              borderRadius: '12px',
              transform: 'translateY(-20px)',
              border: 'none',
            }}
          >
            {/* Custom styles for input fields */}
            <style>
              {`
                .form-control {
                  border: none; /* Remove all borders */
                  border-bottom: 2px solid #ccc; /* Add only bottom border */
                  border-radius: 0; /* Remove rounded edges */
                  outline: none; /* Remove focus outline */
                  transition: border-bottom-color 0.3s ease; /* Add smooth transition */
                }

                .form-control:focus {
                  border-bottom-color: var(--blue); /* Highlight bottom border on focus */
                  box-shadow: none; /* Prevent shadow on focus */
                }
              `}
            </style>
            <div className="form-group mb-3">
              {/* <label>Email:</label> */}
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
              {/* <label>Password:</label> */}
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
              {/* <label>Name:</label> */}
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
              {/* <label>Skills:</label> */}
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
              {/* <label>Gender:</label> */}
              <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group mb-3">
              {/* <label>Photo:</label> */}
              <input
                type="file"
                className="form-control"
                placeholder='Photo'
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </div>
            <div className="form-group mb-3">
              {/* <label>Area:</label> */}
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
