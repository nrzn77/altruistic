// src/Pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase-config';
import { signOut } from 'firebase/auth';
// import { doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
// import NGOOverview from './NGOOverview';
// import { setRole } from '../Components/role';

// import NGOPost from './Pages/CreatePostN';

const Dashboard = ({ setUserRole }) => {
  const navigate = useNavigate();
  const [NGOData, setNGOData] = useState(null);
  const [NgoPosts, setNgoPosts] = useState([]);

  const fetchNGOByUID = async (uid) => {
    try {
      const ngoRef = collection(db, 'NGOs');
      const q = query(ngoRef, where('userId', '==', uid)); // Query based on userId
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const ngoData = querySnapshot.docs[0].data(); // Assuming only one match for userId
        setNGOData(ngoData);
        return ngoData
      } else {
        setError('NGO not found.');
      }
    } catch (error) {
      console.error('Error fetching NGO:', error);
      return null;
    }
  };

  const fetchNgoPosts = async (uid) => {
    try {
      const postsRef = collection(db, 'NGO_Posts');
      const q = query(postsRef, where('createdBy', '==', uid)); // Fetch posts by ngoId
      const postsSnapshot = await getDocs(q);
      const postsList = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNgoPosts(postsList);
      console.log(postsList)
    } catch (err) {
      console.error("Error fetching NGO posts: ", err);
    }
  };


  useEffect(() => {
    console.log(auth.currentUser.uid)
    async function getData() {
      const a = await fetchNGOByUID(auth.currentUser.uid);
      if (!a) {
        handleLogout();
      }
      else {
        setNGOData(a);
        fetchNgoPosts(auth.currentUser.uid)
      }
      return a;
    }
    getData()
  }, [])

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUserRole(null)
        navigate('/login'); // Redirect to login page after logout
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  const deletePost = (PID) => {
    if(confirm("Delete this post?")){
      alert("Deleted the post " + PID)
    }
  }

  return (
    <div>
      <h1>Welcome to Your Dashboard!</h1>
      <p>You are logged in as {auth.currentUser?.email}</p>
      <button onClick={handleLogout}>Logout</button>
      <Link to="/CreatePost">
        <button>Create a post asking for money</button>
      </Link>
<<<<<<< HEAD
      <Link to ="/AvailableVolunteer">
      <button> Available Vlunteers </button>
      </Link>
      <NGOOverview ngoId={auth.currentUser?.uid} />
=======
      {NGOData && <div>
        <details>
          <summary>NGO Information</summary>
          <p><strong>Name:</strong> {NGOData.name}</p>
          <p><strong>License No:</strong> {NGOData.licenseNo}</p>
          <p><strong>About Us:</strong> {NGOData.aboutUs}</p>
        </details>
        <details>
          <summary>Contact Information</summary>
          <p><strong>Phone:</strong> {NGOData.contactInfo.phone}</p>
          <p><strong>Email:</strong> {NGOData.contactInfo.email}</p>
        </details>
        <details>
          <summary>Payment Information</summary>
          <h3>Wire Transfer</h3>
          <p><strong>Account Number:</strong> {NGOData.paymentInfo.wireTransfer.accountNumber}</p>
          <p><strong>Branch Name:</strong> {NGOData.paymentInfo.wireTransfer.branchName}</p>
          <p><strong>Bank Name:</strong> {NGOData.paymentInfo.wireTransfer.bankName}</p>
          <p><strong>Cash:</strong> {NGOData.paymentInfo.cash}</p>
          <p><strong>Mobile Payment:</strong> {NGOData.paymentInfo.mobilePayment}</p>
        </details>
        <details>
          <summary>Posts</summary>
          {NgoPosts.length > 0 ? (
            <ul>
              {NgoPosts.map((post) => (
                <li key={post.id}>
                  <h2>{post.title}</h2>
                  <p>{post.description}</p>
                  <p>{post.reachedAmount}/{post.targetedAmount}</p>
                  <button onClick={() => deletePost(post.id)}>Delete</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No posts found for this NGO.</p>
          )}
        </details>
      </div>}
      {/* <NGOOverview ngoId={auth.currentUser?.uid} /> */}
>>>>>>> dd97ee7b2005d587573cbdbda9b7a8c56cbc5f74
    </div>
  );
};

export default Dashboard;
