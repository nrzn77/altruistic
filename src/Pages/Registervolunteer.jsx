// src/Pages/RegisterVolunteer.jsx
import React, { useState } from 'react';
import { auth, db, storage } from '../firebase-config'; // Firestore, Auth, Storage imports
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase Auth method
import { collection, doc, setDoc } from 'firebase/firestore'; // Firestore methods
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage methods

const RegisterVolunteer = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [skills, setSkills] = useState('');
  const [gender, setGender] = useState('');
  const [availability, setAvailability] = useState('available'); // Default availability
  const [area, setArea] = useState('');
  const [photo, setPhoto] = useState(null); // For file uploads
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Upload the volunteer's photo to Firebase Storage
      let photoURL = '';
      if (photo) {
        const photoRef = ref(storage, `volunteer_photos/${user.uid}_${Date.now()}`);
        const snapshot = await uploadBytes(photoRef, photo);
        photoURL = await getDownloadURL(snapshot.ref); // Get URL of uploaded image
      }

      // Save volunteer data in Firestore using the user.uid as the document ID
      await setDoc(doc(db, 'volunteers', user.uid), {
        name,
        dob,
        skills,
        gender,
        availability,
        area,
        photoURL, // Store photo URL
        email: user.email // Optionally store the email for easy access
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
    <div>
      <h1>Volunteer Registration</h1>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Date of Birth"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          required
        />
        <select value={gender} onChange={(e) => setGender(e.target.value)} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="file"
          onChange={(e) => setPhoto(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="Area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register Volunteer'}
        </button>
      </form>
    </div>
  );
};

export default RegisterVolunteer;
