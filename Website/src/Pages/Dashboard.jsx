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
import Loader from '../Components/Loader';

const Dashboard = ({ setUserRole }) => {
  const navigate = useNavigate();
  const [NGOData, setNGOData] = useState(null);
  const [NgoPosts, setNgoPosts] = useState([]);
  const [view, setView] = useState('overview'); 
  const [view1, setView1] = useState('posts');
  
    const handleButtonClick = (newView) => {
      setView(newView);
    };
    const handleButtonClick1 = (newView) => {
      setView1(newView);
    };
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
        setUserRole("volunteer")
        navigate('/dashboardVolun', { replace: true })
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
  
  if(!NGOData)
    return <Loader />


  return (
    <div className='ngo-dashboard text-center' style={{padding:'0px 10%'}}>
      {!NGOData && "Loading"}
      {NGOData && <>
      <h1>Welcome to Your Dashboard!</h1>
      <p>You are logged in as {auth.currentUser?.email}</p>
      {!NGOData.verified_status && <b>You have not yet been approved by an Admin.</b>}
      <Row className="gy-2">
        {NGOData.verified_status && <Col>
          <Link to="/CreatePost" style={{textDecoration:'none'}}>
          <div
           style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '15px'
           }}>
            <Button style={{
      backgroundColor: 'green',
      color: 'white',
      fontSize: '20px',
      fontWeight: 'bold',
      borderRadius: '10px',
      border: 'none',
      transition: 'all 0.2s ease'
    }}
    onMouseEnter={(e) => {
      e.target.style.backgroundColor = 'darkgreen';
      e.target.style.transform = 'scale(1.02)'; 
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = 'green'; 
      e.target.style.transform = 'scale(1)'; 
    }}>
              Create a post asking for money
            </Button>
            </div>
          </Link>
        </Col>}
      </Row>
      </>}

      {NGOData && (
        <div>
          <div style={{ backgroundColor: 'transparent', padding: '10px 20px', borderRadius: '15px' }}>
            <h3 style={{color: 'black', padding:'0px', margin:'0px',paddingBottom:'5px'}}>About NGO</h3>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <button
          style={{
            backgroundColor: view==='overview'?'white':'transparent',
            color: 'black',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            cursor: 'pointer',
            textAlign: 'center',
            width: '150px',
            border: 'none',
            fontSize:'15px',
            padding: '5px 0px'
          }}
          onClick={() => handleButtonClick('overview')}
        >
          Overview
        </button>
        <button
          style={{
            backgroundColor: view==='payment'?'white':'transparent',
            color: 'black',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            cursor: 'pointer',
            textAlign: 'center',
            width: '150px',
            border: 'none',
            fontSize:'15px',
            padding: '5px 0px'
          }}
          onClick={() => handleButtonClick('payment')}
        >
          Payment Info
        </button>
      </div>

      {view === 'overview' && (
        <Card style={{border: 'none'}}>
          <Card.Body>
            <Card.Title>{NGOData.name}</Card.Title>
            <Card.Text>
              <strong>License No:</strong> {NGOData.licenseNo}
            </Card.Text>
            <Card.Text>
              <strong>About Us:</strong> {NGOData.aboutUs}
            </Card.Text>
            <Card.Text>
              <FaPhoneAlt /> {NGOData.contactInfo.phone}
            </Card.Text>
            <Card.Text>
              <MdEmail /> {NGOData.contactInfo.email}
            </Card.Text>
          </Card.Body>
        </Card>
      )}

      {view === 'payment' && (
          <Card style={{border: 'none'}}>
          <Card.Body>
            <Card.Text>
            <strong>Cash Transfer Address:</strong> {NGOData.paymentInfo.cash}
            </Card.Text>
            <Card.Text>
            <strong>Mobile Payment:</strong> {NGOData.paymentInfo.mobilePayment}
            </Card.Text>
            <Card.Text>
              <strong>Bank Name:</strong> {NGOData.paymentInfo.wireTransfer.bankName}
            </Card.Text>
            <Card.Text>
              <strong>Branch Name:</strong> {NGOData.paymentInfo.wireTransfer.branchName}
            </Card.Text>
            <Card.Text>
              <strong>Account Number:</strong> {NGOData.paymentInfo.wireTransfer.accountNumber}
            </Card.Text>
            
          </Card.Body>
        </Card>        
      )}
      <h3 style={{color: 'black', padding:'10px 0px', margin:'0px', paddingBottom:'5px'}}>Posts & Volunteers</h3>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <button
          style={{
            backgroundColor: view1==='posts'?'white':'transparent',
            color:'black',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            cursor: 'pointer',
            textAlign: 'center',
            width: '150px',
            border: 'none',
            fontSize:'15px',
            padding: '5px 0px'
          }}
          onClick={() => handleButtonClick1('posts')}
        >
          Posts
        </button>
        <button
          style={{
            backgroundColor: view1==='volunteers'?'white':'transparent',
            color: 'black',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            cursor: 'pointer',
            textAlign: 'center',
            width: '150px',
            border: 'none',
            fontSize:'15px',
            padding: '5px 0px'
          }}
          onClick={() => handleButtonClick1('volunteers')}
        >
          Volunteers
        </button>
      </div>
      {view1 === 'posts' && (
  NgoPosts.length > 0 ? (
    <div style={{backgroundColor:'white',width:'100%',border:'none', padding:'5px 10px',borderRadius:'10px'}}>
      <h2 className='mt-2'>Previous Posts</h2>
      {NgoPosts.map((post) => (
        
        <Card key={post.id} className="mb-3 mt-2" style={{border:'solid 1px black'}}>
          
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
  )
)}

          {view1==='volunteers' &&
            <AvailableVolunteers />
          }
          </div>
        </div>
        
      )}
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

export default Dashboard;