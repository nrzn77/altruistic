import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';

const NGOOverview = () => {
  const { ngoId } = useParams(); // ngoId is actually the userId of the NGO
  const [ngoInfo, setNgoInfo] = useState(null);
  const [ngoPosts, setNgoPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ngoId) {
      fetchNgoInfo();
      fetchNgoPosts();
    }
  }, [ngoId]);

  const fetchNgoInfo = async () => {
    try {
      const ngoRef = collection(db, 'NGOs');
      const q = query(ngoRef, where('userId', '==', ngoId)); // Query based on userId
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const ngoData = querySnapshot.docs[0].data(); // Assuming only one match for userId
        setNgoInfo(ngoData);
      } else {
        setError('NGO not found.');
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching NGO details: ", err);
      setError('Error fetching NGO details.');
      setLoading(false);
    }
  };

  const fetchNgoPosts = async () => {
    try {
      const postsRef = collection(db, 'NGO_Posts');
      const q = query(postsRef, where('createdBy', '==', ngoId)); // Fetch posts by ngoId
      const postsSnapshot = await getDocs(q);
      const postsList = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNgoPosts(postsList);
    } catch (err) {
      console.error("Error fetching NGO posts: ", err);
    }
  };

  if (loading) {
    return <p>Loading NGO details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      {ngoInfo ? (
        <div>
          <h2>{ngoInfo.name}</h2>
          <p>{ngoInfo.aboutUs}</p>
          <h3>Other Posts</h3>
          {ngoPosts.length > 0 ? (
            <ul>
              {ngoPosts.map((post) => (
                <li key={post.id}>{post.title}</li>
              ))}
            </ul>
          ) : (
            <p>No posts found for this NGO.</p>
          )}
        </div>
      ) : (
        <p>No NGO information available.</p>
      )}
    </div>
  );
};

export default NGOOverview;
