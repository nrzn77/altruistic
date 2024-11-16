import React, { useEffect, useState } from 'react';
import { auth } from '../firebase-config';
import { signOut } from 'firebase/auth';
import { db } from '../firebase-config';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import AvailableVolunteers from './AvailableVolunteer';
import { Card, Button, ListGroup, Row, Col } from 'react-bootstrap';
import { MdDelete, MdEmail } from 'react-icons/md';
import { FaPhoneAlt } from "react-icons/fa";
import PostImage from '../Components/PostImage';

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
        return ngoData;
      } else {
        console.error('NGO not found.');
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
      console.log(postsList);
    } catch (err) {
      console.error('Error fetching NGO posts: ', err);
    }
  };

  useEffect(() => {
    async function getData() {
      const a = await fetchNGOByUID(auth.currentUser.uid);
      if (!a) {
        handleLogout();
      } else {
        setNGOData(a);
        fetchNgoPosts(auth.currentUser.uid);
      }
    }
    getData();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUserRole(null);
        navigate('/login'); // Redirect to login page after logout
      })
      .catch((error) => {
        console.error('Error logging out: ', error);
      });
  };

  const deletePost = async (PID) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'NGO_Posts', PID)); // Deleting the post document from Firestore
        setNgoPosts(NgoPosts.filter(post => post.id !== PID)); // state also deleted
        alert('Post deleted successfully.');
      } catch (error) {
        console.error('Error deleting post: ', error);
        alert('Failed to delete the post.');
      }
    }
  };

  return (
    <div className='ngo-dashboard'>
      <h1>Welcome to Your Dashboard!</h1>
      <p>You are logged in as {auth.currentUser?.email}</p>

      <Row className="gy-2">
        <Col xs={12} sm="auto">
          <Link to="/CreatePost">
            <Button variant="primary" className="w-100">
              Create a post asking for money
            </Button>
          </Link>
        </Col>
        <Col xs={12} sm="auto">
          <Button variant="secondary" onClick={handleLogout} className="w-100">
            Logout
          </Button>
        </Col>
      </Row>

      {NGOData && (
        <div>
          <Card className="my-3">
            <Card.Body>
              <Card.Title>{NGOData.name}</Card.Title>
              <Card.Text>
                <strong>License No:</strong> {NGOData.licenseNo}
              </Card.Text>
              <Card.Text>
                <strong>About Us:</strong> {NGOData.aboutUs}
              </Card.Text>
              <Card.Text><FaPhoneAlt /> {NGOData.contactInfo.phone}</Card.Text>
              <Card.Text><MdEmail /> {NGOData.contactInfo.email}</Card.Text>
            </Card.Body>
          </Card>


          <p><strong>Cash Transfer Address:</strong> {NGOData.paymentInfo.cash}</p>
          <p><strong>Mobile Payment:</strong> {NGOData.paymentInfo.mobilePayment}</p>
          <details>
            <summary>
              <strong>Bank Information</strong>
            </summary>
            <p>Account Number: {NGOData.paymentInfo.wireTransfer.accountNumber}</p>
            <p>Branch Name: {NGOData.paymentInfo.wireTransfer.branchName}</p>
            <p>Bank Name: {NGOData.paymentInfo.wireTransfer.bankName}</p>
          </details>

          <hr />

          <details>
            <summary>Posts</summary>
            <h2>Posts</h2>
            {NgoPosts.length > 0 ? (
              <div className="ngo-dashboard-tab">
                {NgoPosts.map((post) => (
                  <Card key={post.id} className="mb-3">
                    <Card.Body>
                      <Card.Title>{post.title}</Card.Title>
                      <PostImage post={post} />
                      <Card.Text>{post.description}</Card.Text>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          {post.reachedAmount} / {post.targetedAmount} achieved
                        </ListGroup.Item>
                      </ListGroup>
                      <Button
                        variant="danger"
                        onClick={() => deletePost(post.id)}
                        className="mt-2"
                      >
                        <MdDelete /> Delete
                      </Button>
                      <Button
                        variant="warning"
                        onClick={() => navigate(`/update-post/${post.id}`)}
                        className="mt-2 ms-2"
                      >
                        Update
                      </Button>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            ) : (
              <p>No posts found for this NGO.</p>
            )}
          </details>
          <details>
            <summary>Volunteers</summary>
            <AvailableVolunteers />
          </details>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
