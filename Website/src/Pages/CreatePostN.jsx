// import React, { useState, useEffect } from 'react';
// import { db, auth } from '../firebase-config';  
// import { collection, addDoc } from 'firebase/firestore';
// import { onAuthStateChanged } from 'firebase/auth'; 

// const NGOPost = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     cause: '',
//     targetedAmount: '', 
//   });

//   const [message, setMessage] = useState('');
//   const [currentUser, setCurrentUser] = useState(null);  

//   useEffect(() => {

//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setCurrentUser(user); 
//       } else {
//         setCurrentUser(null); 
//       }
//     });


//     return () => unsubscribe();
//   }, []);


//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!currentUser) {
//       setMessage('You need to be logged in to create a post.');
//       return;
//     }

//     if (formData.title && formData.description && formData.cause && formData.targetedAmount) {
//       try {
//         //console.log(currentUser)
//         await addDoc(collection(db, 'NGO_Posts'), {
//           ...formData,
//           targetedAmount: Number(formData.targetedAmount), 
//           reachedAmount: 0, 
//           createdAt: new Date(),
//           createdBy: currentUser.uid, 
//           ngoEmail: currentUser.email, 
//         });
//         setMessage('Post created successfully!');
//         setFormData({ title: '', description: '', cause: '', targetedAmount: '' }); 
//       } catch (error) {
//         console.error('Error creating post:', error);
//         setMessage('Error creating post. Please try again.');
//       }
//     } else {
//       setMessage('Please fill in all fields.');
//     }
//   };

//   return (
//     <div className="ngo-post-container">
//       <h2>Create a Post for Donations</h2>

//       <form onSubmit={handleSubmit}>
//         {}
//         <div>
//           <label>Title</label>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleInputChange}
//             placeholder="Enter title"
//             required
//           />
//         </div>

//         {}
//         <div>
//           <label>Description</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}
//             placeholder="Describe the need for donations"
//             required
//           />
//         </div>

//         {}
//         <div>
//           <label>Cause</label>
//           <select
//             name="cause"
//             value={formData.cause}
//             onChange={handleInputChange}
//             required
//           >
//             <option value="">Select a cause</option>
//             <option value="Natural Disaster">Natural Disaster</option>
//             <option value="Medical Treatment">Medical Treatment</option>
//             <option value="Education">Education</option>
//             <option value="Social Welfare">Social Welfare</option>
//             <option value="Animal Rescue">Animal Rescue</option>
//             {/*add more causes here */}
//           </select>
//         </div>

//         {}
//         <div>
//           <label>Targeted Amount</label>
//           <input
//             type="number"
//             name="targetedAmount"
//             value={formData.targetedAmount}
//             onChange={handleInputChange}
//             placeholder="Enter targeted amount (in currency)"
//             required
//           />
//         </div>

//         {}
//         <button type="submit">Create Post</button>
//       </form>

//       {}
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default NGOPost;


import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

const NGOPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cause: '',
    targetedAmount: '',
  });

  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setMessage('You need to be logged in to create a post.');
      return;
    }

    if (formData.title && formData.description && formData.cause && formData.targetedAmount) {
      try {
        await addDoc(collection(db, 'NGO_Posts'), {
          ...formData,
          targetedAmount: Number(formData.targetedAmount),
          reachedAmount: 0,
          createdAt: new Date(),
          createdBy: currentUser.uid,
          ngoEmail: currentUser.email,
        });
        setMessage('Post created successfully!');
        setFormData({ title: '', description: '', cause: '', targetedAmount: '' });
      } catch (error) {
        console.error('Error creating post:', error);
        setMessage('Error creating post. Please try again.');
      }
    } else {
      setMessage('Please fill in all fields.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h2 className="text-center mb-4">Create a Post for Donations</h2>

          {message && (
            <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>
              {message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the need for donations"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cause</Form.Label>
              <Form.Select
                name="cause"
                value={formData.cause}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a cause</option>
                <option value="Natural Disaster">Natural Disaster</option>
                <option value="Medical Treatment">Medical Treatment</option>
                <option value="Education">Education</option>
                <option value="Social Welfare">Social Welfare</option>
                <option value="Animal Rescue">Animal Rescue</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Targeted Amount</Form.Label>
              <Form.Control
                type="number"
                name="targetedAmount"
                value={formData.targetedAmount}
                onChange={handleInputChange}
                placeholder="Enter targeted amount (in currency)"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100"
              style={{ backgroundColor: 'var(--blue)', color: 'white' }}>
              Create Post
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default NGOPost;

