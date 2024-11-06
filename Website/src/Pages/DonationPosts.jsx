import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config'; // Firebase config
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';

const DonationPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Function to fetch posts from Firestore
        const fetchPosts = async () => {
            try {
                const postsCollection = collection(db, 'NGO_Posts');
                const postsSnapshot = await getDocs(postsCollection);

                // Create a list of promises to fetch each NGO's name
                const postsList = await Promise.all(
                    postsSnapshot.docs.map(async (docSnapshot) => {
                        const postData = docSnapshot.data();


                        // Query the NGO collection where the userId matches the post's createdBy field
                        const ngoQuery = query(collection(db, 'NGOs'), where('userId', '==', postData.createdBy));
                        const ngoSnapshot = await getDocs(ngoQuery);

                        let ngoData = null;
                        ngoSnapshot.forEach((doc) => {
                            ngoData = doc.data();  // Assuming there will be only one result
                        });

                        return {
                            ...postData,
                            ngoName: ngoData ? ngoData.name : postData.ngoEmail, //use email just in case
                            id: docSnapshot.id
                        };
                    })
                );

                setPosts(postsList);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <p>Loading posts...</p>;
    }

    return (
        <div className="donation-posts">
            <h2>Donation Posts</h2>
            {posts.length > 0 ? (
                <ul>
                    {posts.map((post) => (
                        <li key={post.id} className="post-item">
                            <h3>{post.title}</h3>
                            <p><strong>NGO:</strong> {post.ngoName}</p>
                            <p><strong>Description:</strong> {post.description}</p>
                            <p><strong>Cause:</strong> {post.cause}</p>
                            <p><strong>Targeted Amount:</strong> {post.targetedAmount}</p>
                            <p><strong>Reached Amount:</strong> {post.reachedAmount}</p>
                            <p><strong>Posted On:</strong> {new Date(post.createdAt.seconds * 1000).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No posts available at the moment.</p>
            )}
        </div>
    );
};

export default DonationPosts;
