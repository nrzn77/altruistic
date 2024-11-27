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

  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation
    if (!/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|iut-dhaka\.edu)$/.test(email)) {
      alert('Invalid email address');
      return;
    }

    const passwordRegex = /^(?!.*(\d)\1)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      alert("Password does not meet criteria: at least 8 characters, includes one lowercase letter, one uppercase letter, one digit, one special character, and no consecutive identical digits.");
      return;
    }

    if(password!=confirmPassword){
      alert('Password does not match');
      return;
    }

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
  const isPasswordValid =
      /^(?!.*(\d)\1)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  return (
    <div className="container mt-3">
      <h1 className="text-center mb-4" style={{color: '#211940'}}>Volunteer Registration</h1>
      <div className="row justify-content-center">
        <div className="col-md-7" style={{ marginBottom: '50px' }}>
          <form onSubmit={handleRegister} className="border p-4 rounded shadow-sm" style={{ backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '15px' }}>
            <div className="form-group mb-2">
              <label>Email:</label>
              <input
                type="email"
                className="form-control"
                // placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  borderColor: !email
                    ? '#ced4da'
                    : /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|iut-dhaka\.edu)$/.test(email)
                    ? 'green'
                    : 'red',
                }}
              />
              {email && !/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|iut-dhaka\.edu)$/.test(email) && (
                <small style={{ color: 'red', fontSize: '12px' }}>Invalid email</small>
              )}
            </div>

            <div
              style={{
               display: 'flex', justifyContent: 'space-between', gap: '10px'
             }}
            >
              <div className="form-group mb-2" style={{ flex: '1 1 300px' }}>
                <label>Password:</label>
                <input
                  type="password"
                  className="form-control"
                  // placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    borderColor: !password
                      ? '#ced4da'
                      : isPasswordValid
                      ? 'green'
                      : 'red',
                  }}
                />
                {password && !isPasswordValid && (
                  <small style={{ color: 'red', fontSize: '12px' }}>
                    Invalid Password
                  </small>
                )}
              </div>

              <div className="form-group mb-2" style={{ flex: '1 1 300px' }}>
                <label>Confirm Password:</label>
                <input
                  type="password"
                  className="form-control"
                  // placeholder="Confirm Password"
                  value={confirmPassword}
                  disabled={!password}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    borderColor: !confirmPassword
                     ? '#ced4da'
                      : confirmPassword === password
                      ? 'green'
                      : 'red',
                  }}
                />
                {confirmPassword && confirmPassword !== password && (
                  <small style={{ color: 'red', fontSize: '12px' }}>
                    Passwords do not match.
                  </small>
                )}
              </div>
            
            </div>
            <div className='text-center' style={{color:'grey',fontSize:'14px'}}>*Password must contain atleast 8 characters including one uppercase letter, one lowercase letter, one special character, one number and no consecutive same number</div>

            <div className="form-group mb-3">
              <label>Name:</label>
              <input
                type="text"
                className="form-control"
                // placeholder="Name"
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
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                  .toISOString()
                  .split('T')[0]}
              />
            </div>

            <div className="form-group mb-3">
              <label>Skills:</label>
              <input
                type="text"
                className="form-control"
                // placeholder="Skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Gender:</label>
              <select
                className="form-control"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
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
                placeholder='Photo'
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </div>

            <div className="form-group mb-3">
              <label>Area:</label>
              <select
                className="form-control"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select your Area
                </option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chattogram">Chattogram</option>
                <option value="Khulna">Khulna</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Barishal">Barishal</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Rangpur">Rangpur</option>
                <option value="Mymensingh">Mymensingh</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{ backgroundColor: 'var(--blue)', color: 'white' }}
            >
              {loading ? 'Registering...' : 'Register Volunteer'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterVolunteer;
