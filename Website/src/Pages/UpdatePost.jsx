
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import axios from 'axios';
import { db } from '../firebase-config';
import { Button, Form, Spinner, Alert } from 'react-bootstrap';

const UpdatePost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            const docRef = doc(db, 'NGO_Posts', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setPost(docSnap.data());
            } else {
                console.error('Post not found');
            }
        };

        fetchPost();
    }, [id]);

    const handleUpdate = async () => {
        try {
            setUploading(true);

            let photoURL = '';

            if (photo) {
                const _formData = new FormData();
                _formData.append('image', photo);

                try {
                    const response = await axios.post('http://localhost:3000/upload', _formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    photoURL = response.data.url;
                } catch (error) {
                    console.error('Error uploading the image:', error);
                    setMessage('Image could not be uploaded.');
                    return;
                }
            }

            await addDoc(collection(db, 'NGO_Posts_Update'), {
                postId: id,
                description,
                updatedAt: new Date(),
                photoURL,
            });

            setMessage('Update added successfully!');
           // navigate(`/dashboard`);

            // Delaying the navigation to allow the message to show
            setTimeout(() => {
                navigate(`/dashboard`);
            }, 2000); // Delay for 2 seconds

        } catch (error) {
            console.error('Error adding update:', error);
            setMessage('Failed to add the update. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setPhoto(file);
    };

    return post ? (
        <div className="update-post">
            <h2>Add Update to Post</h2>
            {message && (
                <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>
                    {message}
                </Alert>
            )}

            <p>
                <strong>Original Post Title:</strong> {post.title}
            </p>
            <p>
                <strong>Original Post Description:</strong> {post.description}
            </p>

            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Description of the Update</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Attach an Image</Form.Label>
                    <Form.Control type="file" onChange={handleImageChange} />
                </Form.Group>
                <Button variant="success" onClick={handleUpdate} disabled={uploading}>
                    {uploading ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />{' '}
                            Adding Update...
                        </>
                    ) : (
                        'Add Update'
                    )}
                </Button>
            </Form>
        </div>
    ) : (
        <p>Loading original post data...</p>
    );
};

export default UpdatePost;
