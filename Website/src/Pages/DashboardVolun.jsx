import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import VolunteerOverview from '../Components/Volunteer/VolunteerOverview';
import VolunteerProfile from '../Components/Volunteer/VolunteerProfile';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase-config';
import { signOut } from 'firebase/auth';
import { db } from '../firebase-config';
import Loader from '../Components/Loader';

const Volunteer_Dashboard = ({ setUserRole }) => {
  const [activeTab, setActiveTab] = useState('overview'); // Default to 'overview'
  const [volunteerData, setVolunteerData] = useState(null);

  const getNavLinkStyle = (tab) => ({
    backgroundColor: activeTab === tab ? 'white' : 'transparent',
    color: 'black',
    borderTopLeftRadius: '10px', 
    borderTopRightRadius: '10px',
    cursor: 'pointer',
    textAlign: 'center',
    width: '150px',
  });

  // Logout function
  const navigate = useNavigate();

  const fetchVolunteerByUID = async (uid) => {
    try {
      const volunteerRef = doc(db, 'volunteers', uid);
      const volunteerSnapshot = await getDoc(volunteerRef);

      if (volunteerSnapshot.exists()) {
        return volunteerSnapshot.data(); // Return document data
      } else {
        console.log('No volunteer found with that UID.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching volunteer:', error);
      return null;
    }
  };

  useEffect(() => {
    async function getData() {
      const a = await fetchVolunteerByUID(auth.currentUser.uid);
      if (!a) {
        console.log(a);
        handleLogout();
      } else {
        setVolunteerData(a);
      }
      return a;
    }
    getData();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUserRole(null);
        navigate('/loginV'); // Redirect to login page after logout
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  const updateAvailability = async (uid, newAvailability) => {
    try {
      const volunteerRef = doc(db, 'volunteers', uid);
      await updateDoc(volunteerRef, {
        availability: newAvailability
      });
      setVolunteerData(prev => ({
        ...prev,
        availability: newAvailability
      }));
      console.log('Availability updated to: ${newAvailability}');
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const updateProfile = async (uid, name, area, skills) => {
    try {
      const volunteerRef = doc(db, 'volunteers', uid);
      await updateDoc(volunteerRef, {
        name, area, skills
      });
      setVolunteerData(prev => ({
        ...prev,
        name, area, skills
      }));
      alert('Profile updated.');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  if(!volunteerData)
    return <Loader />

  return (
    <div>
      <h1 className='text-center mt-2 mb-2'>Volunteer Dashboard</h1>
      <Container>
            <Row className='mb-4'>
            {/* Toggle Availability Button */}
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
             <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <div
                onClick={() => {
                const newAvailability = volunteerData.availability === 'available' ? 'not available' : 'available';
                updateAvailability(auth.currentUser.uid, newAvailability);
              }}
              style={{
                width: '150px',
                height: '50px',
                borderRadius: '50px',
                backgroundColor: volunteerData.availability === 'available' ? 'green' : 'grey',
                display: 'flex',
                justifyContent: volunteerData.availability === 'available' ? 'flex-end' : 'flex-start',
                padding: '5px',
                transition: 'all 0.3s ease',
                marginRight: '10px',
                position: 'relative',
              }}
            >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'white',
              position: 'absolute',
              top: '5px',
              left: '5px',
              transition: 'transform 0.1s ease',
              transform: volunteerData.availability === 'available' ? 'translateX(100px)' : 'translateX(0)',
            }}
          />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: volunteerData.availability === 'available' ? '20%' : '35%', // Adjust based on state
            transform: 'translateY(-50%)', // Vertically center the text
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
            transition: 'left 0.1s ease', // Smooth transition
          }}
        >
          {volunteerData.availability === 'available' ? 'Available' : 'Not Available'}
          </div>
      </div>
    </label>
  </div>
  </Row>

          {/* Side Panel */}
          <div style={{backgroundColor:'transparent',padding:'12px 25px',borderRadius:'20px'}}>
          <Row  style={{borderRadius:'20px' ,margin: '0% 0%'}}>
          <Nav
  defaultActiveKey="overview"
  className="flex-row"
  style={{
    display: 'flex',
    justifyContent: 'space-around', // Center horizontally
    alignItems: 'center', // Optional: Center items vertically
    width: '100%', 
  }}
>
  <Nav.Link
    eventKey="overview"
    onClick={() => setActiveTab('overview')}
    style={getNavLinkStyle('overview')}
  >
    Overview
  </Nav.Link>
  <Nav.Link
    eventKey="profile"
    onClick={() => setActiveTab('profile')}
    style={getNavLinkStyle('profile')}
  >
    Profile
  </Nav.Link>
</Nav>
</Row>

            



            
          

          {/* Main Content Area */}
          <Row style={{}}>
            {activeTab === 'overview' && <VolunteerOverview volunteerData={volunteerData} />}
            {activeTab === 'profile' && <VolunteerProfile volunteerData={volunteerData} updateProfile={updateProfile} />}
          </Row>
          </div>
        
      </Container>
      <div
  style={{
    display: 'flex',
    justifyContent: 'center',
  }}
>
  <Button
    onClick={handleLogout}
    style={{
      backgroundColor: 'red',
      color: 'white',
      fontSize: '20px',
      fontWeight: 'bold',
      margin: '20px',
      padding: '5px 0px',
      borderRadius: '10px',
      width: '30%',
      border: 'none',
      transition: 'all 0.2s ease', // Smooth transition for hover and active states
    }}
    onMouseEnter={(e) => {
      e.target.style.backgroundColor = '#b22122'; // Darker red on hover
      e.target.style.transform = 'scale(1.02)'; // Slightly enlarge the button
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = 'red'; // Reset to original red color
      e.target.style.transform = 'scale(1)'; // Reset to original size
    }}
  >
    Logout
  </Button>
</div>
</div>
    
  );
};

export default Volunteer_Dashboard;