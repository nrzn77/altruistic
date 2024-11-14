import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import VolunteerCard from '../Components/NGO/VolunteerCard.jsx';

const AvailableVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableVolunteers = async () => {
      setLoading(true);

      // Query to fetch volunteers where availability is 'available'
      const q = query(collection(db, 'volunteers'), where('availability', '==', 'available'));
      const querySnapshot = await getDocs(q);

      // Map through the results and set the volunteers state
      const volunteersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setVolunteers(volunteersList);
      console.log(volunteersList)
      setLoading(false);
    };

    fetchAvailableVolunteers();
  }, []);

  return (
    <div>
      <h2>Available Volunteers</h2>

      {loading ? (
        <p>Loading volunteers...</p>
      ) : volunteers.length > 0 ? (
        <div className="volunteers-container ngo-dashboard-tab">
          {volunteers.map((volunteer) => (
            <div key={volunteer.id} className="volunteer-card">
              <VolunteerCard volunteer={volunteer} />
            </div>
          ))}
        </div>
      ) : (
        <p>No available volunteers at the moment.</p>
      )}
    </div>
  );
};

export default AvailableVolunteers;
