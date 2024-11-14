import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, startAfter, where } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import PostImage from '../Components/PostImage';

import './Donation.css' // CSS FILE FOR THE DONATION PAGE

const DonationPosts = () => {
    const [posts, setPosts] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [noMorePosts, setNoMorePosts] = useState(false);
    const navigate = useNavigate();

    const getNGOData = async (postData) => {
        const ngoRef = collection(db, 'NGOs');
        const q = query(ngoRef, where('userId', '==', postData.createdBy)); // Query based on userId
        const ngoSnapshots = await getDocs(q);
        return ngoSnapshots.docs[0] ? ngoSnapshots.docs[0].data() : null;
    };

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
                const ngoData = await getNGOData(postData);
                return {
                    ...postData,
                    ngoName: ngoData ? ngoData.name : postData.ngoEmail,
                    id: docSnapshot.id
                };
            })
        );

        setPosts(postsList);
        setLastVisible(lastVisiblePost);
        setLoading(false);
        if (postsSnapshot.size < 5) {
            setNoMorePosts(true);
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
                const ngoData = await getNGOData(postData);
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
        navigate("/ngo/" + ngoId);
    };

    const goToPayment = (postId, reachedAmount, targetedAmount, ngoName) => {
        navigate("/payment-gateway", {
            state: {
                postId,
                currentReachedAmount: reachedAmount,
                targetedAmount,
                ngoName
            }
        });
    };

    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
            if (scrollTop + clientHeight >= scrollHeight - 5 && !loading && !noMorePosts) {
                fetchMorePosts();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, noMorePosts]);

    return (
        <div className="Donations-page">
            <h2>Donation Posts</h2>
            <div className="posts-container">
                {posts.map((post) => (
                    <div key={post.id} className="post-card">
                        <h3>{post.title}</h3>
                        <i>{post.cause}</i>
                        <h6 className='post-creator' onClick={() => viewNGOOverview(post.createdBy)}>{post.ngoName}</h6>
                        <PostImage post={post} />
                        <p>{post.description}</p>
                        <p><strong>Targeted Amount:</strong> {post.targetedAmount}</p>
                        <meter value={post.reachedAmount} min="0" max={post.targetedAmount} low={post.targetedAmount/2}
                            style={{ width: '100%', height: '35px' }}></meter>
                        <p><strong>Reached Amount:</strong> {post.reachedAmount}</p>
                        <button type="button" className="btn btn-primary mt-3 w-100"
                            style={{ backgroundColor: 'var(--blue)', color: 'white' }} onClick={() => goToPayment(post.id, post.reachedAmount, post.targetedAmount, post.ngoName)}>
                            Donate Now!
                        </button>
                    </div>
                ))}
            </div>

            {loading && <p>Loading more posts...</p>}
            {noMorePosts && <p>No more posts to load.</p>}
        </div>
    );
};

export default DonationPosts;



