import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';

const AvailableVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableVolunteers = async () => {
      setLoading(true);
      
      // Query to fetch volunteers where availability is 'available'
      const q = query(collection(db, 'Volunteers'), where('availabilityStatus', '==', 'available'));
      const querySnapshot = await getDocs(q);

      // Map through the results and set the volunteers state
      const volunteersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setVolunteers(volunteersList);
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
        <div className="volunteers-container">
          {volunteers.map((volunteer) => (
            <div key={volunteer.id} className="volunteer-card">
              <h3>{volunteer.name}</h3>
              <p><strong>Gender:</strong> {volunteer.gender}</p>
              <p><strong>Skills:</strong> {volunteer.skills.join(', ')}</p>
              <p><strong>Area:</strong> {volunteer.area}</p>
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
