
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import VolunteerOverview from '../Components/Volunteer/VolunteerOverview';
import VolunteerProfile from '../Components/Volunteer/VolunteerProfile';
import MyProjects from '../Components/Volunteer/EnrolledProjectsVolunteer';
import AvailableProjects from '../Components/Volunteer/AvailableProjectsVolunteer';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase-config';
import { signOut } from 'firebase/auth';
import { db } from '../firebase-config';
// import { setRole } from '../Components/role';

const Volunteer_Dashboard = ({ setUserRole }) => {
  const [activeTab, setActiveTab] = useState('overview'); // Default to 'overview'
  const [isEnrolled, setIsEnrolled] = useState(false); // Track enrollment status
  const [volunteerData, setVolunteerData] = useState({
    photoURL: "./images/profile.png",
    name: "John Doe",
    skills: "Project Management, Fundraising",
    availability: "available"
  });



  const getNavLinkStyle = (tab) => ({
    backgroundColor: activeTab === tab ? 'var(--blue)' : 'transparent',
    color: activeTab === tab ? 'white' : 'black',
    padding: '10px',
    marginBottom: '5px',
    borderRadius: '5px',
    cursor: 'pointer',
    textAlign: 'center',
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
        console.log(a)
        handleLogout();
      }
      else {
        setVolunteerData(a);
      }
      return a;
    }
    getData()
  }, [])

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUserRole(null)
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
      }))
      console.log(`Availability updated to: ${newAvailability}`);
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  return (
    <div>
      <h1>Volunteer Dashboard</h1>
      <Container fluid>
        <Row>
          {/* Side Panel */}
          <Col md={3} className="bg-light p-3">
            <h4>Dashboard</h4>
            <Nav defaultActiveKey="overview" className="flex-column">
              <Nav.Link
                eventKey="overview"
                onClick={() => setActiveTab('overview')}
                style={getNavLinkStyle('overview')}
              >
                Overview
              </Nav.Link>
              {/* <Nav.Link
                eventKey="profile"
                onClick={() => setActiveTab('profile')}
                style={getNavLinkStyle('profile')}
              >
                Profile
              </Nav.Link>
              <Nav.Link
                eventKey="enrolled-projects"
                onClick={() => setActiveTab('enrolled-projects')}
                style={getNavLinkStyle('enrolled-projects')}
              >
                Enrolled Projects
              </Nav.Link> */}
              {/* <Nav.Link
                eventKey="availability"
                onClick={() => setActiveTab('availability')}
                style={getNavLinkStyle('availability')}
              >
                Available
                {/* Availability Status Indicator }
                <span
                  style={{
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    marginLeft: '8px',
                    backgroundColor: isEnrolled ? 'red' : 'green',
                  }}
                />
              </Nav.Link> */}
            </Nav>

            {/* Logout Button */}
            <Button
              onClick={() => {
                if (volunteerData.availability == "available")
                  updateAvailability(auth.currentUser.uid, "not available")
                else
                  updateAvailability(auth.currentUser.uid, "available")
              }}
              style={{
                backgroundColor: volunteerData.availability == "available" ? "green" : "red",
                color: 'white',
                width: '100%',
                marginTop: '10px',
                padding: '10px',
                borderRadius: '5px',
              }}
            >{volunteerData.availability}</Button>
            <Button
              onClick={handleLogout}
              style={{
                backgroundColor: 'red',
                color: 'white',
                width: '100%',
                marginTop: '10px',
                padding: '10px',
                borderRadius: '5px',
              }}
            >
              Logout
            </Button>
          </Col>

          {/* Main Content Area */}
          <Col md={9}>
            {activeTab === 'overview' && <VolunteerOverview volunteerData={volunteerData} />}
            {/* {activeTab === 'profile' && <VolunteerProfile />} */}
            {/* {activeTab === 'enrolled-projects' && <MyProjects setIsEnrolled={setIsEnrolled} />} */}
            {/* {activeTab === 'availability' && <AvailableProjects />} */}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Volunteer_Dashboard;
