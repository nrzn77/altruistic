import React, { useState, useEffect } from 'react';
import { collection, doc, getDocs, query, orderBy, limit, startAfter, getDoc, where } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useNavigate } from 'react-router-dom';

//import { collection, doc, getDocs } from 'firebase/firestore';


const DonationPosts = () => {
    const [posts, setPosts] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [noMorePosts, setNoMorePosts] = useState(false);
    const navigate = useNavigate()


    const getNGOData = async (postData) => {
        const ngoRef = collection(db, 'NGOs');
        const q = query(ngoRef, where('userId', '==', postData.createdBy)); // Query based on userId
        const ngoSnapshots = await getDocs(q);
        // if (!ngoSnapshots.empty) {
        // const ngoData = ngoSnapshots.docs[0].data();
        const ngoData = ngoSnapshots.docs[0] ? ngoSnapshots.docs[0].data() : null;
        return ngoData;
    }

    const fetchInitialPosts = async () => {
        setLoading(true);
        const postsQuery = query(
            collection(db, 'NGO_Posts'),
            orderBy('createdAt', 'desc'),
            limit(5)
        );
        const postsSnapshot = await getDocs(postsQuery);
        const lastVisiblePost = postsSnapshot.docs[postsSnapshot.docs.length - 1];


        const postsList = await Promise.all(
            postsSnapshot.docs.map(async (docSnapshot) => {
                const postData = docSnapshot.data();

                // const ngoRef = collection(db, 'NGOs');
                // const q = query(ngoRef, where('userId', '==', postData.createdBy)); // Query based on userId
                // const ngoSnapshots = await getDocs(q);
                // if (!ngoSnapshots.empty) {
                // const ngoData = ngoSnapshots.docs[0] ? ngoSnapshots.docs[0].data() : null;
                const ngoData = await getNGOData(postData)

                return {
                    ...postData,
                    ngoName: ngoData ? ngoData.name : postData.ngoEmail,
                    id: docSnapshot.id
                };
            })
        );

        setPosts(postsList);
        console.log(postsList[0])
        setLastVisible(lastVisiblePost);
        setLoading(false);
        if (postsSnapshot.size < 5) {
            setNoMorePosts(true); // No more posts to load
        }
    };


    const fetchMorePosts = async () => {
        if (loading || noMorePosts) return;

        setLoading(true);
        const postsQuery = query(
            collection(db, 'NGO_Posts'),
            orderBy('createdAt', 'desc'),
            startAfter(lastVisible),
            limit(5)
        );
        const postsSnapshot = await getDocs(postsQuery);
        const lastVisiblePost = postsSnapshot.docs[postsSnapshot.docs.length - 1];

        if (!lastVisiblePost) {
            setNoMorePosts(true);
            setLoading(false);
            return;
        }

        const morePostsList = await Promise.all(
            postsSnapshot.docs.map(async (docSnapshot) => {
                const postData = docSnapshot.data();

                // const ngoRef = doc(db, 'NGOs', postData.createdBy);
                // const ngoSnapshot = await getDoc(ngoRef);
                // const ngoData = ngoSnapshot.exists() ? ngoSnapshot.data() : null;
                const ngoData = await getNGOData(postData)

                return {
                    ...postData,
                    ngoName: ngoData ? ngoData.name : postData.ngoEmail,
                    id: docSnapshot.id
                };
            })
        );

        setPosts((prevPosts) => [...prevPosts, ...morePostsList]);
        setLastVisible(lastVisiblePost);
        setLoading(false);
        if (postsSnapshot.size < 5) {
            setNoMorePosts(true);
        }
    };

    useEffect(() => {
        fetchInitialPosts();
    }, []);

    const viewNGOOverview = (ngoId) => {
        navigate("/ngo/" + ngoId)
        console.log(`Viewing NGO Overview for: ${ngoId}`);
    };

    return (
        <div>
            <h2>Donation Posts</h2>
            <div className="posts-container">
                {posts.map((post) => (
                    <div key={post.id} className="post-card">
                        <h3>{post.title}</h3>
                        <p><strong>Description:</strong> {post.description}</p>
                        <p><strong>Targeted Amount:</strong> {post.targetedAmount}</p>
                        <p><strong>Reached Amount:</strong> {post.reachedAmount}</p>
                        <p><strong>NGO Name:</strong> {post.ngoName}</p>
                        {/* Add a button to view NGO overview */}
                        <button onClick={() => viewNGOOverview(post.createdBy)}>View NGO Overview</button>
                    </div>
                ))}
            </div>

            {loading && <p>Loading more posts...</p>}

            {!loading && !noMorePosts && (
                <button onClick={fetchMorePosts}>Load More Posts</button>
            )}

            {noMorePosts && <p>No more posts to load.</p>}
        </div>
    );

};


export default DonationPosts;
