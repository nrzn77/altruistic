
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { db } from '../firebase-config';
// import { Alert, Card, Spinner } from 'react-bootstrap';

// const PostUpdates = () => {
//     const { id } = useParams(); // Get the post ID from URL
//     const [updates, setUpdates] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [message, setMessage] = useState('');

//     useEffect(() => {
//         const fetchUpdates = async () => {
//             try {
//                 const updatesRef = collection(db, 'NGO_Posts_Update');
//                 const q = query(updatesRef, where('postId', '==', id));
//                 const querySnapshot = await getDocs(q);

//                 if (querySnapshot.empty) {
//                     setMessage('No updates available for this post.');
//                 } else {
//                     const updatesList = querySnapshot.docs.map(doc => ({
//                         id: doc.id,
//                         ...doc.data(),
//                     }));
//                     setUpdates(updatesList);
//                 }
//             } catch (error) {
//                 console.error('Error fetching updates:', error);
//                 setMessage('Failed to load updates. Please try again later.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUpdates();
//     }, [id]);

//     return (
//         <div className="container mt-5">
//             <h2 className="mb-4 text-center">Post Updates</h2>

//             {loading && (
//                 <div className="d-flex justify-content-center">
//                     <Spinner animation="border" role="status" variant="primary" />
//                     <span className="ms-2">Loading updates...</span>
//                 </div>
//             )}

//             {message && <Alert variant="info">{message}</Alert>}

//             {updates.length > 0 ? (
//                 <div className="row">
//                     {updates.map(update => (
//                         <div key={update.id} className="col-md-6 col-lg-4 mb-4">
//                             <Card className="shadow-sm">
//                                 {update.photoURL && (
//                                     <Card.Img variant="top" src={update.photoURL} alt="Update Image" />
//                                 )}
//                                 <Card.Body>
//                                     <Card.Text>{update.description}</Card.Text>
//                                     <Card.Footer>
//                                         <small className="text-muted">
//                                             Updated on {new Date(update.updatedAt.seconds * 1000).toLocaleString()}
//                                         </small>
//                                     </Card.Footer>
//                                 </Card.Body>
//                             </Card>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 !loading && <p className="text-center">No updates to display.</p>
//             )}
//         </div>
//     );
// };

// export default PostUpdates;


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase-config';
import { Alert, Card, Spinner } from 'react-bootstrap';
import './PostUpdates.css'; // CSS file for the updates page

const PostUpdates = () => {
    const { id } = useParams(); // Get the post ID from URL
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const updatesRef = collection(db, 'NGO_Posts_Update');
                const q = query(updatesRef, where('postId', '==', id));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setMessage('No updates available for this post.');
                } else {
                    const updatesList = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setUpdates(updatesList);
                }
            } catch (error) {
                console.error('Error fetching updates:', error);
                setMessage('Failed to load updates. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUpdates();
    }, [id]);

    return (
        <div className="updates-page">
            <h2 className="updates-title">Post Updates</h2>

            {loading && (
                <div className="loading-container">
                    <Spinner animation="border" role="status" variant="primary" />
                    <span className="ms-2">Loading updates...</span>
                </div>
            )}

            {message && <Alert variant="info">{message}</Alert>}

            {updates.length > 0 ? (
                <div className="updates-container">
                    {updates.map(update => (
                        <div key={update.id} className="update-card">
                            {update.photoURL && (
                                <Card.Img variant="top" src={update.photoURL} alt="Update Image" />
                            )}
                            <Card.Body>
                                <Card.Text>{update.description}</Card.Text>
                                <Card.Footer>
                                    <small className="text-muted">
                                        Updated on {new Date(update.updatedAt.seconds * 1000).toLocaleString()}
                                    </small>
                                </Card.Footer>
                            </Card.Body>
                        </div>
                    ))}
                </div>
            ) : (
                !loading && <p className="text-center">No updates to display.</p>
            )}
        </div>
    );
};

export default PostUpdates;


